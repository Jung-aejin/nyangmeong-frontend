import { useState } from 'react';
import PageSkeleton from '@/components/PageSkeleton';
import Skeleton from '@/components/Skeleton';
import SkeletonCard from '@/components/SkeletonCard';
import CareList from '@/features/health/CareList';
import DiaryTabs from '@/features/health/diary/DiaryTabs';
import MonthCalendar from '@/features/health/MonthCalendar';
import PetFilterChips from '@/features/health/PetFilterChips';
import PetTabs from '@/features/health/PetTabs';
import ScheduleDayDetail from '@/features/health/ScheduleDayDetail';
import ScheduleModal from '@/features/health/ScheduleModal';
import UpcomingSchedules from '@/features/health/UpcomingSchedules';
import headHlt from '@/assets/head_hlt.svg';
import SideMenu from '@/layouts/SideMenu';
import { usePets, useSchedules } from '@/features/health/queries';
import {
  addDays,
  addMonths,
  getDaysInMonth,
  getMonth,
  getTodayYmd,
  getYear,
  makeYmd,
} from '@/utils/formatDate';

// 다가오는 일정을 찾을 범위. 최대 3건만 보여 주므로 1년이면 충분하다
const UPCOMING_RANGE_DAYS = 365;

const SECTION_TABS = [
  { id: 'hlt003-calendar', label: '캘린더' },
  { id: 'hlt003-care', label: '케어리스트' },
];

export default function CareCalendarPage() {
  const [sectionId, setSectionId] = useState(SECTION_TABS[0].id);
  const todayYmd = getTodayYmd();
  const [viewMonthYmd, setViewMonthYmd] = useState(() =>
    makeYmd(getYear(todayYmd), getMonth(todayYmd), 1),
  );
  const [selectedYmd, setSelectedYmd] = useState(todayYmd);
  // null은 전체 선택이다. 반려동물 목록이 늦게 와도 전체로 시작한다
  const [filterPetSns, setFilterPetSns] = useState(null);
  const [tabPetSn, setTabPetSn] = useState(null);
  const [modal, setModal] = useState(null);

  const {
    data: pets,
    isPending: isPetsPending,
    isError: isPetsError,
  } = usePets();
  const year = getYear(viewMonthYmd);
  const month = getMonth(viewMonthYmd);
  const { data: monthData, isError: isMonthError } = useSchedules({
    startYmd: viewMonthYmd,
    endYmd: makeYmd(year, month, getDaysInMonth(year, month)),
  });
  const { data: upcomingData, isError: isUpcomingError } = useSchedules({
    startYmd: todayYmd,
    endYmd: addDays(todayYmd, UPCOMING_RANGE_DAYS),
  });

  /** 첫 진입: 반려동물·이번 달·다가오는 일정이 모두 올 때까지 */
  if (
    isPetsPending ||
    (!monthData && !isMonthError) ||
    (!upcomingData && !isUpcomingError)
  )
    return (
      <PageFrame>
        <CalendarSkeleton />
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

  const allPetSns = pets.map((pet) => pet.petSn);
  const visiblePetSns = filterPetSns ?? allPetSns;
  const isAllPets = visiblePetSns.length === allPetSns.length;
  const petLabel = isAllPets
    ? '전체 반려동물'
    : pets
        .filter((pet) => visiblePetSns.includes(pet.petSn))
        .map((pet) => pet.petNm)
        .join(', ');
  const selectedTabPetSn = tabPetSn ?? pets[0]?.petSn ?? null;

  const filterByPet = (schedules = []) =>
    schedules.filter((schedule) => visiblePetSns.includes(schedule.petSn));
  const monthSchedules = filterByPet(monthData?.content);
  const upcomingSchedules = filterByPet(upcomingData?.content);

  const handleFilterChange = (petSns) =>
    setFilterPetSns(petSns.length === allPetSns.length ? null : petSns);

  // 인라인 상세는 보고 있는 달의 일정으로 그리므로, 달을 옮기면 선택 날짜도 그 달로 옮긴다(이번 달이면 오늘)
  const handleMoveMonth = (offset) => {
    const nextMonthYmd = addMonths(viewMonthYmd, offset);
    setViewMonthYmd(nextMonthYmd);
    const isThisMonth =
      getYear(nextMonthYmd) === getYear(todayYmd) &&
      getMonth(nextMonthYmd) === getMonth(todayYmd);
    setSelectedYmd(isThisMonth ? todayYmd : nextMonthYmd);
  };

  const openCreate = (ymd) =>
    setModal({ key: Date.now(), schedule: null, defaultYmd: ymd });
  const openEdit = (schedule) =>
    setModal({ key: Date.now(), schedule, defaultYmd: schedule.schdlYmd });

  return (
    <PageFrame>
      <DiaryTabs
        items={SECTION_TABS}
        activeId={sectionId}
        onSelect={setSectionId}
        label="케어 캘린더 묶음"
      />

      {sectionId === 'hlt003-calendar' && (
        <div
          id="hlt003-calendar"
          role="tabpanel"
          aria-labelledby="hlt003-calendar-tab"
          className="mt-5 grid items-start gap-5 min-[1101px]:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]"
        >
          <MonthCalendar
            year={year}
            month={month}
            schedules={monthSchedules}
            selectedYmd={selectedYmd}
            canMoveMonth={(monthData?.totalSchdlCnt ?? 0) > 0}
            onMoveMonth={handleMoveMonth}
            onSelectDate={setSelectedYmd}
          >
            <PetFilterChips
              pets={pets}
              selectedPetSns={visiblePetSns}
              onChange={handleFilterChange}
            />
          </MonthCalendar>

          {/* 넓은 화면에서는 이 열의 높이를 캘린더 카드에 맞추고, 다가오는 일정 카드는 내용 높이로 맨 아래에 붙고 남는 높이는 날짜 상세 카드가 채운다 */}
          <div className="flex min-w-0 flex-col gap-5 min-[1101px]:h-0 min-[1101px]:min-h-full min-[1101px]:self-stretch">
            <ScheduleDayDetail
              className="min-[1101px]:min-h-0 min-[1101px]:flex-1"
              bodyClassName="min-[1101px]:min-h-0 min-[1101px]:overflow-y-auto"
              ymd={selectedYmd}
              schedules={monthSchedules}
              petLabel={petLabel}
              onSelectSchedule={openEdit}
              onCreate={() => openCreate(selectedYmd)}
            />
            <UpcomingSchedules
              schedules={upcomingSchedules}
              onSelectSchedule={openEdit}
              className="min-[1101px]:shrink-0"
            />
          </div>
        </div>
      )}

      {sectionId === 'hlt003-care' && (
        <div id="hlt003-care" role="tabpanel" aria-labelledby="hlt003-care-tab">
          <PetTabs
            pets={pets}
            selectedPetSn={selectedTabPetSn}
            onSelect={setTabPetSn}
          />
          {selectedTabPetSn != null && <CareList petSn={selectedTabPetSn} />}
        </div>
      )}

      {modal && (
        <ScheduleModal
          key={modal.key}
          pets={pets}
          schedule={modal.schedule}
          defaultPetSn={selectedTabPetSn}
          defaultYmd={modal.defaultYmd}
          onClose={() => setModal(null)}
          onCreateNew={() => openCreate(modal.defaultYmd)}
        />
      )}
    </PageFrame>
  );
}

/** 로딩 자리: 달력 + 오른쪽 카드 2장, 반려동물 칩, 케어 목록 */
function CalendarSkeleton() {
  return (
    <PageSkeleton>
      <div className="grid gap-5 min-[1101px]:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <SkeletonCard className="h-[624px]" />
        <div className="flex flex-col gap-5">
          <SkeletonCard className="h-[262px]" />
          <SkeletonCard className="h-[342px]" />
        </div>
      </div>
      <div aria-hidden="true" className="mt-2 flex gap-2">
        {[0, 1, 2].map((index) => (
          <Skeleton key={index} className="h-9 w-28 rounded-full" />
        ))}
      </div>
      <SkeletonCard className="h-[1538px] max-[760px]:h-[2400px]" />
    </PageSkeleton>
  );
}

function PageFrame({ children }) {
  return (
    <div className="grid grid-cols-1 pt-6 pb-[126px] min-[1101px]:grid-cols-[210px_minmax(0,1fr)] min-[1101px]:gap-x-12">
      <header className="relative mb-6 min-[1101px]:col-span-full">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[28px] leading-[1.3] tracking-[-0.02em]">
          <span className="flex items-center gap-x-3 text-[#566465]">
            건강기록
            <span
              aria-hidden="true"
              className="-ml-[3px] size-[9px] rotate-45 border-t-2 border-r-2 border-[#b9c4c4] max-sm:size-2"
            />
          </span>
          <h1 className="font-bold text-[#1a3234]">케어 캘린더</h1>
        </div>
        <p className="mt-2 text-[#566465]">
          모든 반려동물의 일정을 한눈에 확인하는 통합 캘린더
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
