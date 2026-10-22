import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageSkeleton from '@/components/PageSkeleton';
import Skeleton from '@/components/Skeleton';
import SkeletonCard from '@/components/SkeletonCard';
import AnchorBar from '@/features/health/diary/AnchorBar';
import { useHealthSummary, usePets } from '@/features/health/queries';
import AttachmentStrip from '@/features/health/summary/AttachmentStrip';
import ConditionCard from '@/features/health/summary/ConditionCard';
import LabSection from '@/features/health/summary/LabSection';
import ObservationSummaryCard from '@/features/health/summary/ObservationSummaryCard';
import PrescriptionHistoryCard from '@/features/health/summary/PrescriptionHistoryCard';
import PreventionHistoryCard from '@/features/health/summary/PreventionHistoryCard';
import SummaryHero from '@/features/health/summary/SummaryHero';
import { SectionHead } from '@/features/health/summary/SummaryParts';
import TimelineCard from '@/features/health/summary/TimelineCard';
import headHlt from '@/assets/head_hlt.svg';
import SideMenu from '@/layouts/SideMenu';
import { PATHS } from '@/routes/paths';

const ANCHORS = [
  { id: 'hlt011-hist', label: '진료 · 예방 이력' },
  { id: 'hlt011-lab', label: '검사 · 수치' },
  { id: 'hlt011-rx', label: '처방 · 투약' },
  { id: 'hlt011-obs', label: '관찰 기록 · 첨부 자료' },
];

/**
 * [종합 건강기록 SCR-HLT-011]
 * - 반려동물별 기록을 모아 보여 주는 조회 전용 화면. 등록·수정·삭제는 원천 화면(SCR-HLT-002·003·005)에서만
 * - ?inspection=<검사 항목>이면 검사 수치 추이를 그 항목으로 시작(검진상세에서 들어옴)
 */
export default function HealthSummaryPage() {
  const [searchParams] = useSearchParams();
  const [tabPetSn, setTabPetSn] = useState(null);
  const {
    data: pets,
    isPending: isPetsPending,
    isError: isPetsError,
  } = usePets();
  const selectedPet =
    pets?.find((pet) => pet.petSn === tabPetSn) ?? pets?.[0] ?? null;
  const { data: summary, isError: isSummaryError } = useHealthSummary(
    selectedPet?.petSn ?? null,
  );

  if (isPetsPending) {
    return (
      <PageFrame>
        <SummarySkeleton />
      </PageFrame>
    );
  }
  if (isPetsError || isSummaryError) {
    return (
      <PageFrame>
        <p role="alert" className="text-muted">
          건강기록을 불러오지 못했어요. 잠시 뒤 다시 시도해 주세요
        </p>
      </PageFrame>
    );
  }
  if (!selectedPet) {
    return (
      <PageFrame>
        <p className="text-muted">
          등록된 반려동물이 없어요.{' '}
          <Link
            to={`${PATHS.MYPAGE_PETS}?register=1`}
            className="font-semibold text-brand-600 underline underline-offset-3"
          >
            반려동물 등록
          </Link>
        </p>
      </PageFrame>
    );
  }
  if (!summary) {
    return (
      <PageFrame>
        <SummarySkeleton />
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <SummaryHero
        pets={pets}
        pet={selectedPet}
        summary={summary}
        onSelect={setTabPetSn}
      />
      <AnchorBar items={ANCHORS} />

      <SectionHead
        id="hlt011-hist"
        title="진료 · 예방 이력"
        description="병원 방문과 접종·검진 기록을 시간순으로 모았어요"
      />
      <div className="grid items-stretch gap-5 min-[1101px]:grid-cols-2">
        <TimelineCard timeline={summary.timeline} />
        <div className="flex flex-col gap-5">
          <PreventionHistoryCard prevention={summary.prevention} />
          <ConditionCard profile={summary.profile} />
        </div>
      </div>

      <SectionHead
        id="hlt011-lab"
        title="검사 · 수치"
        description="최근 혈액검사 결과와 항목별 변화를 확인해요"
      />
      <LabSection
        key={`lab-${selectedPet.petSn}`}
        lab={summary.lab}
        trends={summary.trends}
        initialItemNm={searchParams.get('inspection')}
      />

      <SectionHead
        id="hlt011-rx"
        title="처방 · 투약"
        description="검진상세에 등록한 처방약을 복용 중인 것부터 보여줘요"
      />
      <PrescriptionHistoryCard prescriptions={summary.prescriptions} />

      <SectionHead
        id="hlt011-obs"
        title="관찰 기록 · 첨부 자료"
        description="계속 지켜보는 부위의 변화와 병원 서류를 함께 확인해요"
      />
      <ObservationSummaryCard
        key={`obs-${selectedPet.petSn}`}
        observations={summary.observations}
      />
      <AttachmentStrip attachments={summary.attachments} />
    </PageFrame>
  );
}

/** 로딩 자리: 히어로 + 탭 + 구역별 카드 배치 */
function SummarySkeleton() {
  return (
    <PageSkeleton
      top={<SkeletonCard className="h-[290px]" />}
      tabs={ANCHORS.length}
    >
      <SectionHeadSkeleton />
      <div className="grid gap-5 min-[1101px]:grid-cols-2">
        <SkeletonCard className="h-[650px]" />
        <div className="flex flex-col gap-5">
          <SkeletonCard className="h-[365px]" />
          <SkeletonCard className="h-[265px]" />
        </div>
      </div>
      <SectionHeadSkeleton />
      <div className="grid gap-5 min-[1101px]:grid-cols-2">
        <SkeletonCard className="h-[495px]" />
        <SkeletonCard className="h-[495px]" />
      </div>
      <SectionHeadSkeleton />
      <SkeletonCard className="h-[250px]" />
      <SectionHeadSkeleton />
      <SkeletonCard className="h-[485px]" />
      <SkeletonCard className="h-[380px]" />
    </PageSkeleton>
  );
}

/** 구역 머리 자리: 제목 + 설명 */
function SectionHeadSkeleton() {
  return (
    <div aria-hidden="true" className="mt-5 flex flex-col gap-2">
      <Skeleton className="h-6 w-36" />
      <Skeleton className="h-4 w-72 max-w-full" />
    </div>
  );
}

function PageFrame({ children }) {
  return (
    <div className="grid grid-cols-1 pt-6 pb-[126px] text-ink leading-[1.6] break-keep tabular-nums antialiased min-[1101px]:grid-cols-[210px_minmax(0,1fr)] min-[1101px]:gap-x-12">
      <header className="relative mb-6 min-[1101px]:col-span-full">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[28px] leading-[1.3] tracking-[-0.02em]">
          <span className="flex items-center gap-x-3 text-[#566465]">
            건강기록
            <span
              aria-hidden="true"
              className="-ml-[3px] size-[9px] rotate-45 border-t-2 border-r-2 border-[#b9c4c4] max-sm:size-2"
            />
          </span>
          <h1 className="font-bold text-[#1a3234]">종합 건강기록</h1>
        </div>
        <p className="mt-2 text-[#566465]">
          우리 아이의 지금까지의 건강 이력을 한눈에 확인할 수 있어요
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
