import { Cat, Dog, Info } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BTN_PRIMARY, BTN_SECONDARY } from '@/components/buttonStyles';
import { showToast } from '@/components/toastStore';
import { PATHS } from '@/routes/paths';
import { INVT_STTS } from '../api';
import { formatAge, getVrtyName } from '@/utils/petFormat';
import { useAcceptInvitation, useInvitation } from '../queries';
import { PET_SE } from '@/utils/petCodes';
import InvitationRejectDialog from './InvitationRejectDialog';

/**
 * [초대 수락]
 * - 초대에 담긴 반려동물 전체 일괄 수락·거절, 받는 쪽은 동물을 고르지 않음
 * - 수락 -> 반려동물 관리로 이동해 방금 연동된 동물 표시
 */

/** 대기가 아닌 초대의 안내 */
const CLOSED_MESSAGES = {
  [INVT_STTS.ACPT]: '이미 수락한 초대예요',
  [INVT_STTS.RJCT]: '거절한 초대예요',
  [INVT_STTS.EXPR]: '초대 기한(7일)이 지나 수락할 수 없어요',
};

/** 마리 수 고유어 (등록 상한 10마리) */
const NATIVE_COUNTS = [
  '',
  '한',
  '두',
  '세',
  '네',
  '다섯',
  '여섯',
  '일곱',
  '여덟',
  '아홉',
  '열',
];

const CARD =
  'mx-auto w-full max-w-[560px] overflow-hidden rounded-card border border-line bg-white shadow-depth-sm';

function InvitePetCard({ pet }) {
  const Icon = pet.petSeCd === PET_SE.CAT ? Cat : Dog;
  const desc = [getVrtyName(pet), formatAge(pet.petBrdt)]
    .filter(Boolean)
    .join(' · ');
  return (
    <li className="flex flex-col items-center gap-1 rounded-box bg-surface-2 px-5 pt-[22px] pb-4 text-center">
      <span className="mb-2 grid size-28 place-items-center rounded-full bg-white text-brand-500">
        <Icon className="size-12" aria-hidden="true" />
      </span>
      <b>{pet.petNm}</b>
      <span className="text-sm text-subtle">{desc}</span>
    </li>
  );
}

export default function InvitationAccept({ invitationToken }) {
  const navigate = useNavigate();
  const {
    data: invitation,
    isPending,
    isError,
  } = useInvitation(invitationToken);
  const acceptInvitation = useAcceptInvitation();
  const [isRejecting, setIsRejecting] = useState(false);

  if (isPending) return null;
  if (isError) {
    return (
      <p className={`${CARD} px-[22px] py-10 text-center text-muted`}>
        초대를 찾을 수 없어요. 링크를 다시 확인해 주세요
      </p>
    );
  }

  const petNames = invitation.pets.map((pet) => pet.petNm).join(', ');
  const isWaiting = invitation.invtSttsCd === INVT_STTS.WAIT;

  const handleAccept = () =>
    acceptInvitation.mutate(invitationToken, {
      onSuccess: () =>
        navigate(PATHS.MYPAGE_PETS, {
          state: { petSn: invitation.pets[0].petSn },
        }),
      onError: () => showToast('수락하지 못했어요. 잠시 후 다시 시도해 주세요'),
    });

  return (
    <section aria-labelledby="invitation-title" className={CARD}>
      <div className="border-b border-line-strong px-7 pt-4 pb-2">
        <h2
          id="invitation-title"
          className="text-lg leading-[1.35] font-bold break-keep"
        >
          {petNames}의 공동양육자가 되어주세요
        </h2>
        <p className="mt-1 text-muted">{invitation.invtrNcnm}님이 초대했어요</p>
      </div>
      <div className="flex flex-col gap-5 px-[22px] pt-5 pb-[22px]">
        <ul className="grid grid-cols-2 gap-3">
          {invitation.pets.map((pet) => (
            <InvitePetCard key={pet.petSn} pet={pet} />
          ))}
        </ul>
        <p className="flex items-start gap-2.5 rounded-lg bg-surface-2 px-3.5 py-3 text-muted">
          <Info
            className="mt-0.5 size-4 shrink-0 text-subtle"
            aria-hidden="true"
          />
          <span>
            {isWaiting
              ? `수락하면 ${invitation.pets.length === 1 ? invitation.pets[0].petNm : `${NATIVE_COUNTS[invitation.pets.length] ?? invitation.pets.length} 마리`}의 건강기록·일정을 함께 관리할 수 있어요`
              : CLOSED_MESSAGES[invitation.invtSttsCd]}
          </span>
        </p>
      </div>
      {isWaiting && (
        <div className="flex items-center justify-end gap-2 border-t border-line bg-[#fbfcfd] px-7 py-4">
          <Link
            to={PATHS.MYPAGE}
            className="inline-flex h-10 items-center justify-center rounded-md px-4 font-semibold text-ink-2 hover:bg-surface-2"
          >
            나중에 하기
          </Link>
          <button
            type="button"
            onClick={() => setIsRejecting(true)}
            disabled={acceptInvitation.isPending}
            className={BTN_SECONDARY}
          >
            거절
          </button>
          <button
            type="button"
            onClick={handleAccept}
            disabled={acceptInvitation.isPending}
            className={BTN_PRIMARY}
          >
            수락
          </button>
        </div>
      )}
      {isRejecting && (
        <InvitationRejectDialog
          invitation={invitation}
          onClose={() => setIsRejecting(false)}
        />
      )}
    </section>
  );
}
