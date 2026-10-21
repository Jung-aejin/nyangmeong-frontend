import { Plus, User } from 'lucide-react';
import { useState } from 'react';
import Badge from '@/components/Badge';
import { showToast } from '@/components/toastStore';
import { useCaregivers, useDeleteCaregiver } from '../queries';
import { CGVR_ROLE, MAX_CAREGIVERS } from '../shared/petCodes';

const ROW_BUTTON =
  'inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-line bg-white px-4 font-semibold hover:bg-surface-2 hover:border-line-strong';

/** 'YYYY-MM-DD' → 'MM-DD' */
const formatLinkDate = (lnkDt) => lnkDt.slice(5);

function CaregiverDeleteDialog({ pet, caregiver, onClose }) {
  const deleteCaregiver = useDeleteCaregiver();

  const handleDelete = () =>
    deleteCaregiver.mutate(
      { petSn: pet.petSn, rltnSn: caregiver.rltnSn },
      {
        onSuccess: () => {
          onClose();
          showToast('연동을 해제했어요');
        },
        onError: () =>
          showToast('해제하지 못했어요. 잠시 후 다시 시도해 주세요'),
      },
    );

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto px-4 py-8">
      <div className="fixed inset-0 bg-[rgba(15,23,35,0.45)]" />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="caregiver-delete-title"
        aria-describedby="caregiver-delete-desc"
        className="relative m-auto flex w-full max-w-[440px] shrink-0 flex-col rounded-modal bg-white shadow-depth-lg"
      >
        <div className="px-10 pt-10 pb-8 text-center">
          <h2
            id="caregiver-delete-title"
            className="text-lg leading-[1.35] font-bold break-keep"
          >
            {caregiver.mbrNcnm}님과의 연동을 해제할까요?
          </h2>
          <p
            id="caregiver-delete-desc"
            className="mt-2 leading-[1.6] break-keep text-muted"
          >
            해제하면 {caregiver.mbrNcnm}님은 {pet.petNm}의 기록을 더 이상 볼 수
            없어요.
          </p>
        </div>
        <div className="flex gap-2 px-10 pb-6">
          <button
            type="button"
            onClick={onClose}
            className="h-11 min-w-0 flex-1 rounded-md border border-line bg-white font-semibold hover:border-line-strong hover:bg-surface-2"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteCaregiver.isPending}
            className="h-11 min-w-0 flex-1 rounded-md bg-danger font-semibold text-white hover:bg-[#983a2f] disabled:bg-surface-3 disabled:text-line-strong"
          >
            해제
          </button>
        </div>
      </div>
    </div>
  );
}

function CaregiverRow({ name, badge, sub, action }) {
  return (
    <li className="flex items-center gap-4 px-5 py-6 not-last:border-b not-last:border-line">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-surface-3 text-muted">
        <User className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2 font-semibold">
          {name}
          {badge}
        </p>
        <p className="mt-1 text-sm text-subtle">{sub}</p>
      </div>
      {action}
    </li>
  );
}

function SectionTitle({ id, children, sub }) {
  return (
    <h2
      id={id}
      className="flex items-baseline gap-2 text-xl font-bold tracking-[-0.02em]"
    >
      {children}
      {sub && <small className="font-medium text-subtle">{sub}</small>}
    </h2>
  );
}

/** 반려동물 슬라이드 아래 가족관리 영역: 주양육자는 연동 전원, 공동양육자는 본인 연동 1건 */
export default function FamilySection({ pet, onInvite, onUnlink }) {
  const { data: caregivers = [], isPending } = useCaregivers(pet.petSn);
  const [deletingCaregiver, setDeletingCaregiver] = useState(null);

  if (isPending) return null;

  const owner = caregivers.find(
    (caregiver) => caregiver.cgvrRoleCd === CGVR_ROLE.PCG,
  );
  const coParents = caregivers.filter(
    (caregiver) => caregiver.cgvrRoleCd === CGVR_ROLE.CCG,
  );

  /** 공동양육자 시점: 주양육자 줄과 내 연동 1건만 */
  if (owner) {
    const mine = coParents.find((caregiver) => caregiver.myYn === 'Y');
    return (
      <div className="mt-8 grid gap-x-8 gap-y-12 border-t border-line pt-12 min-[761px]:grid-cols-2 min-[761px]:items-start">
        <section aria-labelledby="family-owner" className="flex flex-col gap-5">
          <SectionTitle id="family-owner">주양육자</SectionTitle>
          <ul className="rounded-modal border border-line bg-white shadow-depth-sm">
            <CaregiverRow
              name={owner.mbrNcnm}
              badge={
                <Badge className="bg-tone-green-bg text-tone-green-fg">
                  주양육
                </Badge>
              }
              sub="이 반려동물을 등록한 사람"
            />
          </ul>
        </section>
        {mine && (
          <section
            aria-labelledby="family-mine"
            className="flex flex-col gap-5"
          >
            <SectionTitle id="family-mine">내 연동 상태</SectionTitle>
            <ul className="rounded-modal border border-line bg-white shadow-depth-sm">
              <CaregiverRow
                name={`나 (${mine.mbrNcnm})`}
                badge={
                  <Badge className="bg-tone-gray-bg text-tone-gray-fg">
                    공동양육
                  </Badge>
                }
                sub={`${mine.authrtNm} · ${formatLinkDate(mine.lnkDt)} 연동`}
                action={
                  <button
                    type="button"
                    onClick={() => onUnlink(pet)}
                    className={ROW_BUTTON}
                  >
                    연동 해제
                  </button>
                }
              />
            </ul>
          </section>
        )}
      </div>
    );
  }

  /** 주양육자 시점: 연동된 공동양육자 전원, 인원 상한 5명 */
  const isFull = coParents.length >= MAX_CAREGIVERS;
  return (
    <section
      aria-labelledby="family-list"
      className="mt-8 flex max-w-[640px] flex-col gap-5 border-t border-line pt-12"
    >
      <SectionTitle
        id="family-list"
        sub={`${coParents.length}/${MAX_CAREGIVERS}명`}
      >
        가족관리 — {pet.petNm}
      </SectionTitle>
      {coParents.length > 0 ? (
        <ul className="rounded-modal border border-line bg-white shadow-depth-sm">
          {coParents.map((caregiver) => (
            <CaregiverRow
              key={caregiver.rltnSn}
              name={caregiver.mbrNcnm}
              badge={
                <Badge className="bg-tone-gray-bg text-tone-gray-fg">
                  공동양육
                </Badge>
              }
              sub={`${caregiver.authrtNm} · ${formatLinkDate(caregiver.lnkDt)} 연동`}
              action={
                <button
                  type="button"
                  onClick={() => setDeletingCaregiver(caregiver)}
                  className={ROW_BUTTON}
                >
                  삭제
                </button>
              }
            />
          ))}
        </ul>
      ) : (
        <p className="rounded-modal border border-line bg-white px-5 py-6 text-subtle shadow-depth-sm">
          아직 함께 돌보는 가족이 없어요
        </p>
      )}
      <button
        type="button"
        onClick={() => onInvite(pet)}
        disabled={isFull}
        className={`${ROW_BUTTON} w-full gap-1.5 disabled:cursor-not-allowed disabled:bg-surface-3 disabled:text-line-strong`}
      >
        <Plus className="size-[18px]" aria-hidden="true" />
        가족 초대하기
      </button>
      {deletingCaregiver && (
        <CaregiverDeleteDialog
          pet={pet}
          caregiver={deletingCaregiver}
          onClose={() => setDeletingCaregiver(null)}
        />
      )}
    </section>
  );
}
