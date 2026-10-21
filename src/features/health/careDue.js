import { addDays, addMonths, diffDays, getTodayYmd } from '@/utils/formatDate';

// 주기 코드는 공통코드가 정해지기 전의 가안이다
export const CARE_CYCLES = [
  { cd: '1W', nm: '1주' },
  { cd: '2W', nm: '2주' },
  { cd: '1M', nm: '한달' },
  { cd: '1Y', nm: '1년' },
  { cd: 'CUSTOM', nm: '직접입력' },
];

export const MAX_MAIN_CARE = 6;

export const getCycleName = (item) =>
  item.rptCycleCd === 'CUSTOM'
    ? `${item.rptCycleDayCnt}일`
    : CARE_CYCLES.find((cycle) => cycle.cd === item.rptCycleCd)?.nm;

export const addCycle = (ymd, rptCycleCd, rptCycleDayCnt) => {
  switch (rptCycleCd) {
    case '1W':
      return addDays(ymd, 7);
    case '2W':
      return addDays(ymd, 14);
    case '1M':
      return addMonths(ymd, 1);
    case '1Y':
      return addMonths(ymd, 12);
    default:
      return addDays(ymd, Number(rptCycleDayCnt));
  }
};

// 다음 예정일 = 가장 최근 완료일 + 주기. 완료 기록이 없으면 등록일 + 주기(FN-HLT-003-12·38)
// 늦게 완료해도 그날부터 다시 세므로 예정일이 계속 밀리지 않는다
export const getNextDueYmd = (item, records) => {
  const lastDoneYmd = records
    .filter((record) => record.careItemSn === item.careItemSn)
    .map((record) => record.careYmd)
    .sort()
    .at(-1);
  return addCycle(
    lastDoneYmd ?? item.regYmd,
    item.rptCycleCd,
    item.rptCycleDayCnt,
  );
};

// 정기관리 상태 배지. 지난 예정일은 오류가 아니라 안내라 빨강 대신 주황 "+n일"로 쓴다
export const getDueBadge = (nextSchdYmd) => {
  const days = diffDays(getTodayYmd(), nextSchdYmd);
  if (days === 0) return { label: '오늘', tone: 'today' };
  if (days > 0) return { label: `D-${days}`, tone: 'upcoming' };
  return { label: `+${-days}일`, tone: 'late' };
};
