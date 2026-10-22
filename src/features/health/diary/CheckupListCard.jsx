import { useState } from 'react';
import { Link, generatePath } from 'react-router-dom';
import Badge from '@/components/Badge';
import Card from '@/components/Card';
import Modal from '@/components/Modal';
import Pagination from '@/components/Pagination';
import SkeletonCard from '@/components/SkeletonCard';
import {
  BTN_DANGER,
  BTN_PRIMARY,
  BTN_SECONDARY,
} from '@/components/buttonStyles';
import { PATHS } from '@/routes/paths';
import { formatDate, getTodayYmd, getYear } from '@/utils/formatDate';
import { useCheckups, useDeleteCheckup } from '../queries';
import { CHECKUP_TYPES } from '../scheduleTypes';
import CheckupModal from './CheckupModal';
import EmptyBox from './EmptyBox';
import { SELECT_ARROW_STYLE, SELECT_CLASS } from './formStyles';

/** 한 페이지에 고정으로 보여 주는 검진기록 수 */
const PAGE_SIZE = 10;

/** 필터 칩으로 따로 세는 검진 종류(예방접종) */
const VACCINATION = 'VACC';

const findCheckupTypeNm = (cd) =>
  CHECKUP_TYPES.find((type) => type.cd === cd)?.nm;

/**
 * [검진기록 카드]
 * - 조회 연도 드롭다운·검진 건수 필터 칩 2종·검진기록 리스트·[검진기록 등록] (FN-HLT-002-05·06·14)
 * - 병원명을 누르면 검진상세로 이동하고, [삭제]는 확인 후 검진기록만 삭제
 * - 등록 방법 선택에서 영수증을 고르면 이 모달을 닫고 onReceipt로 페이지가 영수증 등록을 이어 간다
 */
export default function CheckupListCard({ pet, pets, onReceipt }) {
  const currentYear = getYear(getTodayYmd());
  const [year, setYear] = useState(currentYear);
  const [isVaccinationOnly, setIsVaccinationOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteSn, setDeleteSn] = useState(null);
  const { data, isPending } = useCheckups({ petSn: pet.petSn, year });
  const deleteCheckup = useDeleteCheckup();

  if (isPending) {
    return (
      <div aria-busy="true">
        <SkeletonCard className="h-[1145px] max-[760px]:h-[1437px]" />
      </div>
    );
  }

  const checkups = data.content;
  const vaccinationCount = checkups.filter(
    (checkup) => checkup.ckupTypeCd === VACCINATION,
  ).length;
  const visibleCheckups = isVaccinationOnly
    ? checkups.filter((checkup) => checkup.ckupTypeCd === VACCINATION)
    : checkups;
  const pageCount = Math.max(1, Math.ceil(visibleCheckups.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageCheckups = visibleCheckups.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const yearOptions = [...new Set([currentYear, year, ...data.years])].sort(
    (a, b) => b - a,
  );
  const yearLabel = year === currentYear ? '올해' : `${year}년`;

  const handleDelete = () =>
    deleteCheckup.mutate(deleteSn, { onSuccess: () => setDeleteSn(null) });

  const chipClass = (isActive) =>
    `inline-flex h-9 items-center rounded-full border px-3.5 ${
      isActive
        ? 'border-brand-100 bg-brand-50 font-semibold text-brand-600'
        : 'border-line bg-white text-ink hover:bg-surface-2'
    }`;

  return (
    <Card title="검진기록" sub={`${year}년 이력`} className="min-w-0">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label htmlFor="hlt002-exam-year" className="text-sm/[1.6] text-subtle">
          조회 연도
        </label>
        <select
          id="hlt002-exam-year"
          value={year}
          disabled={!data.hasAnyCheckup}
          className={`${SELECT_CLASS} w-30!`}
          style={SELECT_ARROW_STYLE}
          onChange={(event) => {
            setYear(Number(event.target.value));
            setPage(1);
          }}
        >
          {yearOptions.map((option) => (
            <option key={option} value={option}>
              {option}년
            </option>
          ))}
        </select>
        <div role="group" aria-label="검진 건수 필터" className="flex gap-2">
          <button
            type="button"
            aria-pressed={!isVaccinationOnly}
            className={chipClass(!isVaccinationOnly)}
            onClick={() => {
              setIsVaccinationOnly(false);
              setPage(1);
            }}
          >
            {yearLabel} 검진 {checkups.length}
          </button>
          <button
            type="button"
            aria-pressed={isVaccinationOnly}
            className={chipClass(isVaccinationOnly)}
            onClick={() => {
              setIsVaccinationOnly((prev) => !prev);
              setPage(1);
            }}
          >
            예방접종 {vaccinationCount}
          </button>
        </div>
        <button
          type="button"
          className={`${BTN_PRIMARY} ml-auto`}
          onClick={() => setIsModalOpen(true)}
        >
          검진기록 등록
        </button>
      </div>

      {checkups.length === 0 ? (
        <EmptyBox
          icon="local_hospital"
          title="등록된 검진기록이 없어요"
          description="병원에 다녀왔다면 직접 입력하거나 영수증으로 등록해 보세요"
        />
      ) : (
        <>
          <ul className="border-t border-line-soft">
            {pageCheckups.map((checkup) => (
              <li
                key={checkup.ckupRcdSn}
                className="flex items-start gap-3 border-b border-line-soft px-[18px] py-4 hover:bg-surface-2"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <Link
                      to={generatePath(PATHS.HEALTH_CHECKUP_DETAIL, {
                        ckupRcdSn: checkup.ckupRcdSn,
                      })}
                      className="text-lg/[1.6] font-semibold text-ink underline-offset-4 hover:text-brand-600 hover:underline"
                    >
                      {checkup.hospNm}
                    </Link>
                    <span className="text-subtle tabular-nums">
                      {formatDate(checkup.ckupYmd)} ·{' '}
                      {findCheckupTypeNm(checkup.ckupTypeCd)}
                    </span>
                    {checkup.schdlSn === null && (
                      <Badge tone="gray">연결된 일정 삭제됨</Badge>
                    )}
                  </div>
                  {checkup.ckupCn && (
                    <p className="mt-1 text-subtle">{checkup.ckupCn}</p>
                  )}
                </div>
                <button
                  type="button"
                  className="min-h-9 shrink-0 px-1 font-semibold text-muted hover:underline"
                  onClick={() => setDeleteSn(checkup.ckupRcdSn)}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-7">
            <Pagination
              page={currentPage}
              pageCount={pageCount}
              onChange={setPage}
            />
          </div>
        </>
      )}

      {isModalOpen && (
        <CheckupModal
          pets={pets}
          defaultPetSn={pet.petSn}
          onReceipt={() => {
            setIsModalOpen(false);
            onReceipt();
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {deleteSn !== null && (
        <Modal
          isConfirm
          title="검진기록을 삭제할까요?"
          description="이 검진의 투약·반복 예방 항목도 케어리스트에서 삭제됩니다(완료 기록은 유지)"
          isPending={deleteCheckup.isPending}
          onClose={() => setDeleteSn(null)}
          footer={
            <>
              <button
                type="button"
                className={BTN_SECONDARY}
                disabled={deleteCheckup.isPending}
                onClick={() => setDeleteSn(null)}
              >
                취소
              </button>
              <button
                type="button"
                className={BTN_DANGER}
                disabled={deleteCheckup.isPending}
                onClick={handleDelete}
              >
                삭제하기
              </button>
            </>
          }
        />
      )}
    </Card>
  );
}
