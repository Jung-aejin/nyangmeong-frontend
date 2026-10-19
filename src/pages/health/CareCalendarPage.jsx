import { useState } from 'react';
import CareList from '@/features/health/CareList';
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

export default function CareCalendarPage() {
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
  const { data: monthData } = useSchedules({
    startYmd: viewMonthYmd,
    endYmd: makeYmd(year, month, getDaysInMonth(year, month)),
  });
  const { data: upcomingData } = useSchedules({
    startYmd: todayYmd,
    endYmd: addDays(todayYmd, UPCOMING_RANGE_DAYS),
  });

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
      <div className="grid items-start gap-5 min-[1101px]:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
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

        {/* 넓은 화면에서는 이 열의 높이를 캘린더 카드에 맞추고, 남는 높이는 다가오는 일정 카드가 채운다 */}
        <div className="flex min-w-0 flex-col gap-5 min-[1101px]:h-0 min-[1101px]:min-h-full min-[1101px]:self-stretch">
          <ScheduleDayDetail
            ymd={selectedYmd}
            schedules={monthSchedules}
            petLabel={petLabel}
            onSelectSchedule={openEdit}
            onCreate={() => openCreate(selectedYmd)}
          />
          <UpcomingSchedules
            schedules={upcomingSchedules}
            onSelectSchedule={openEdit}
            className="min-[1101px]:min-h-0 min-[1101px]:flex-1"
            bodyClassName="min-[1101px]:min-h-0 min-[1101px]:overflow-y-auto"
          />
        </div>
      </div>

      <PetTabs
        pets={pets}
        selectedPetSn={selectedTabPetSn}
        onSelect={setTabPetSn}
      />
      {selectedTabPetSn != null && <CareList petSn={selectedTabPetSn} />}

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
