import { useState } from 'react';
import AnchorBar from '@/features/health/diary/AnchorBar';
import CheckupListCard from '@/features/health/diary/CheckupListCard';
import DailyTrendCard from '@/features/health/diary/DailyTrendCard';
import ObservationCard from '@/features/health/diary/ObservationCard';
import RecentRecordTable from '@/features/health/diary/RecentRecordTable';
import TodayRecordCard from '@/features/health/diary/TodayRecordCard';
import TodayRecordForm from '@/features/health/diary/TodayRecordForm';
import PetTabs from '@/features/health/PetTabs';
import { MEAL } from '@/features/health/diaryTypes';
import { useDailyRecords, usePets } from '@/features/health/queries';
import headHlt from '@/assets/head_hlt.svg';
import SideMenu from '@/layouts/SideMenu';
import { getTodayYmd } from '@/utils/formatDate';

const ANCHORS = [
  { id: 'hlt002-graph', label: '건강기록 변화' },
  { id: 'hlt002-obs', label: '지속 관찰' },
  { id: 'hlt002-exam', label: '검진기록' },
];

export default function HealthDiaryPage() {
  const todayYmd = getTodayYmd();
  const [tabPetSn, setTabPetSn] = useState(null);
  /** 오늘 기록하기 입력 영역: null이면 닫힘, token으로 같은 영역을 다른 종류로 다시 엶 */
  const [recordForm, setRecordForm] = useState(null);

  const {
    data: pets,
    isPending: isPetsPending,
    isError: isPetsError,
  } = usePets();
  const selectedPetSn = tabPetSn ?? pets?.[0]?.petSn ?? null;
  const { data: recordData, isPending: isRecordsPending } =
    useDailyRecords(selectedPetSn);

  if (isPetsPending)
    return (
      <PageFrame>
        <p className="text-[#566465]">불러오는 중이에요</p>
      </PageFrame>
    );
  if (isPetsError) {
    return (
      <PageFrame>
        <p role="alert" className="text-[#566465]">
          반려동물 정보를 불러오지 못했어요. 잠시 뒤 다시 시도해 주세요
        </p>
      </PageFrame>
    );
  }

  const selectedPet = pets.find((pet) => pet.petSn === selectedPetSn);
  const records = recordData?.content ?? [];

  const openRecordForm = (typeCd) =>
    setRecordForm({ typeCd, token: Date.now() });

  return (
    <PageFrame>
      <PetTabs
        pets={pets}
        selectedPetSn={selectedPetSn}
        label="반려동물 선택"
        onSelect={setTabPetSn}
      />
      <AnchorBar items={ANCHORS} />

      {selectedPet && isRecordsPending && (
        <p className="text-[#566465]">불러오는 중이에요</p>
      )}
      {selectedPet && !isRecordsPending && (
        <>
          <div
            id="hlt002-graph"
            className="grid scroll-mt-28 items-stretch gap-5 min-[1101px]:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]"
          >
            <DailyTrendCard
              pet={selectedPet}
              records={records}
              onAddRecord={openRecordForm}
            />
            <TodayRecordCard
              records={records}
              todayYmd={todayYmd}
              isFormOpen={recordForm !== null}
              onToggleForm={() =>
                recordForm ? setRecordForm(null) : openRecordForm(MEAL)
              }
            />
          </div>

          {recordForm && (
            <TodayRecordForm
              key={recordForm.token}
              petSn={selectedPet.petSn}
              initialTypeCd={recordForm.typeCd}
            />
          )}

          <RecentRecordTable records={records} todayYmd={todayYmd} />
        </>
      )}

      {selectedPet && (
        <div id="hlt002-obs" className="scroll-mt-28">
          <ObservationCard petSn={selectedPet.petSn} />
        </div>
      )}
      {selectedPet && (
        <div id="hlt002-exam" className="scroll-mt-28">
          <CheckupListCard
            key={selectedPet.petSn}
            pet={selectedPet}
            pets={pets}
          />
        </div>
      )}
    </PageFrame>
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
          <h1 className="font-bold text-[#1a3234]">건강 일지</h1>
        </div>
        <p className="mt-2 text-[#566465]">
          일상 기록과 지속 관찰, 검진기록을 한곳에서 남기고 확인해요
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
