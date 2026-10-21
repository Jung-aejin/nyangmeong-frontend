import { useState } from 'react';
import {
  Link,
  generatePath,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import AttachmentTab from '@/features/health/checkup/AttachmentTab';
import CheckupInfoCard from '@/features/health/checkup/CheckupInfoCard';
import DetailTabs from '@/features/health/checkup/DetailTabs';
import PreventionTab from '@/features/health/checkup/PreventionTab';
import PrescriptionTab from '@/features/health/checkup/PrescriptionTab';
import ResultsTab from '@/features/health/checkup/ResultsTab';
import { PANEL } from '@/features/health/checkup/checkupStyles';
import {
  ATTACHMENT_IMAGE,
  DETAIL_TABS,
  getPanelId,
  getTabId,
} from '@/features/health/checkup/checkupTypes';
import { useCheckupDetail, usePets } from '@/features/health/queries';
import headHlt from '@/assets/head_hlt.svg';
import SideMenu from '@/layouts/SideMenu';
import { PATHS } from '@/routes/paths';

const DEFAULT_TAB = 'result';

export default function CheckupDetailPage() {
  const { ckupRcdSn } = useParams();

  return <CheckupDetail key={ckupRcdSn} ckupRcdSn={Number(ckupRcdSn)} />;
}

function CheckupDetail({ ckupRcdSn }) {
  const [searchParams] = useSearchParams();
  const { state } = useLocation();
  const requestedTab = searchParams.get('tab');
  const [tabKey, setTabKey] = useState(
    DETAIL_TABS.some((tab) => tab.key === requestedTab)
      ? requestedTab
      : DEFAULT_TAB,
  );
  /** 영상검사 칩의 [첨부 자료 탭에서 등록하기]로 들어오면 첨부 추가 영역을 펼친 채 연다 */
  const [isAddOpenOnEnter, setIsAddOpenOnEnter] = useState(false);
  const {
    data: detail,
    isPending,
    isError,
    error,
  } = useCheckupDetail(ckupRcdSn);
  const { data: pets, isPending: isPetsPending } = usePets();

  if (isPending || isPetsPending) {
    return (
      <PageFrame>
        <p className="text-[#566465]">불러오는 중이에요</p>
      </PageFrame>
    );
  }
  if (isError) {
    return (
      <PageFrame>
        <p role="alert" className="text-[#566465]">
          {error?.code === 'NOT_FOUND'
            ? '검진기록을 찾을 수 없어요'
            : '검진기록을 불러오지 못했어요. 잠시 뒤 다시 시도해 주세요'}
        </p>
      </PageFrame>
    );
  }

  const { checkup } = detail;
  const imagingCount = detail.attachments.filter(
    (attachment) => attachment.atchTypeCd === ATTACHMENT_IMAGE,
  ).length;
  const counts = {
    result:
      detail.bloodInspections.length +
      imagingCount +
      detail.etcInspections.length,
    attachments: detail.attachments.length,
    prescription: detail.prescriptions.length,
    prevention: detail.preventions.length,
  };
  /** 영수증 여러 마리 저장 뒤 들어온 경우 다른 반려동물의 기록으로 가는 링크 */
  const otherSavedCheckups = (state?.savedCheckups ?? []).filter(
    (saved) => saved.ckupRcdSn !== ckupRcdSn,
  );

  const selectTab = (key) => {
    setIsAddOpenOnEnter(false);
    setTabKey(key);
  };

  const goAttachments = () => {
    setIsAddOpenOnEnter(true);
    setTabKey('attachments');
  };

  return (
    <PageFrame>
      <Link
        to={PATHS.HEALTH_DIARY}
        className="inline-flex items-center gap-2 self-start font-medium text-[#566465] hover:text-[#1a3234]"
      >
        <span
          aria-hidden="true"
          className="ml-[3px] size-2 rotate-45 border-b-2 border-l-2 border-current"
        />
        건강 일지로 돌아가기
      </Link>

      {otherSavedCheckups.length > 0 && (
        <p role="status" className="-mt-3 flex flex-wrap gap-x-4 gap-y-1">
          {otherSavedCheckups.map((saved) => (
            <Link
              key={saved.ckupRcdSn}
              to={generatePath(PATHS.HEALTH_CHECKUP_DETAIL, {
                ckupRcdSn: saved.ckupRcdSn,
              })}
              state={state}
              className="font-semibold text-brand-600 hover:underline hover:underline-offset-3"
            >
              {saved.petNm} 기록 보기
            </Link>
          ))}
        </p>
      )}

      <CheckupInfoCard checkup={checkup} pets={pets} />

      <div className="flex flex-col gap-5">
        <DetailTabs selectedKey={tabKey} counts={counts} onSelect={selectTab} />
        <div
          role="tabpanel"
          id={getPanelId(tabKey)}
          aria-labelledby={getTabId(tabKey)}
        >
          {tabKey === 'result' && (
            <div className={PANEL}>
              <ResultsTab detail={detail} onGoAttachments={goAttachments} />
            </div>
          )}
          {tabKey === 'attachments' && (
            <AttachmentTab
              ckupRcdSn={ckupRcdSn}
              attachments={detail.attachments}
              isAddOpenInitially={isAddOpenOnEnter}
            />
          )}
          {tabKey === 'prescription' && (
            <PrescriptionTab
              ckupRcdSn={ckupRcdSn}
              prescriptions={detail.prescriptions}
            />
          )}
          {tabKey === 'prevention' && (
            <PreventionTab
              ckupRcdSn={ckupRcdSn}
              preventions={detail.preventions}
            />
          )}
        </div>
      </div>
    </PageFrame>
  );
}

function PageFrame({ children }) {
  return (
    <div className="grid grid-cols-1 pt-6 pb-[126px] text-ink leading-[1.6] break-keep tabular-nums antialiased min-[1101px]:grid-cols-[210px_minmax(0,1fr)] min-[1101px]:gap-x-12">
      <header className="relative mb-6 min-[1101px]:col-span-full">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[28px] leading-[1.3] tracking-[-0.02em]">
          <nav
            aria-label="현재 위치"
            className="flex items-center gap-x-3 text-[#566465]"
          >
            <Link to={PATHS.HEALTH} className="hover:text-[#1a3234]">
              건강기록
            </Link>
            <Chevron />
            <Link to={PATHS.HEALTH_DIARY} className="hover:text-[#1a3234]">
              건강 일지
            </Link>
            <Chevron />
          </nav>
          <h1 className="font-bold text-[#1a3234]">검진상세</h1>
        </div>
        <p className="mt-2 text-[#566465]">
          병원에서 받은 검사 결과와 처방을 한곳에서 확인해요
        </p>
        <img
          src={headHlt}
          alt=""
          width="160"
          height="100"
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-1 right-0 origin-bottom-right [image-rendering:pixelated] select-none max-[1100px]:scale-80 max-[760px]:hidden"
        />
      </header>
      <SideMenu menuLabel="건강기록" />
      <div className="flex min-w-0 flex-col gap-7 min-[1101px]:pt-6">
        {children}
      </div>
    </div>
  );
}

function Chevron() {
  return (
    <span
      aria-hidden="true"
      className="-ml-[3px] size-[9px] rotate-45 border-t-2 border-r-2 border-[#b9c4c4] max-sm:size-2"
    />
  );
}
