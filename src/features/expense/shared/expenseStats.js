import {
  EXPND_CLSF,
  EXPND_CLSF_LIST,
  ETC_CLSF_CD,
  FILTER_ALL,
  FILTER_SHARED,
  PET_STTS,
  SORT,
} from './expenseCodes';
import { getPetFilterLabel } from './expenseFormat';

/** 가짜 응답 화면 집계 */
export const sumAmt = (expenses) =>
  expenses.reduce((sum, expense) => sum + expense.expndAmt, 0);

export const getRatio = (amt, totalAmt) =>
  totalAmt === 0 ? 0 : Math.round((amt / totalAmt) * 100);

export const getMonthExpenses = (expenses, ym) =>
  expenses.filter((expense) => expense.expndYmd.startsWith(ym));

/** 합계 100 보정 비율 (항목별 반올림 시 99·101 방지) */
const getRatiosSummingTo100 = (amts) => {
  const total = amts.reduce((sum, amt) => sum + amt, 0);
  const exacts = amts.map((amt) => (amt / total) * 100);
  const ratios = exacts.map(Math.floor);
  let rest = 100 - ratios.reduce((sum, ratio) => sum + ratio, 0);
  exacts
    .map((exact, index) => ({ index, fraction: exact - Math.floor(exact) }))
    .sort((a, b) => b.fraction - a.fraction)
    .forEach(({ index }) => {
      if (rest > 0) {
        ratios[index] += 1;
        rest -= 1;
      }
    });
  return ratios;
};

export const getCategoryStats = (expenses) => {
  const stats = EXPND_CLSF_LIST.map((clsf) => ({
    ...clsf,
    totalAmt: sumAmt(
      expenses.filter((expense) => expense.expndClsfCd === clsf.code),
    ),
  }))
    .filter((stat) => stat.totalAmt > 0)
    .sort((a, b) => b.totalAmt - a.totalAmt);
  /** 금액 큰 순, 기타는 마지막 */
  const etcIndex = stats.findIndex((stat) => stat.code === ETC_CLSF_CD);
  if (etcIndex >= 0) stats.push(...stats.splice(etcIndex, 1));
  const ratios = getRatiosSummingTo100(stats.map((stat) => stat.totalAmt));
  return stats.map((stat, index) => ({ ...stat, ratio: ratios[index] }));
};

/** 반려동물별 지출 집계 */
export const getPetStats = (expenses, pets) => {
  const totalAmt = sumAmt(expenses);
  const toStat = (pet) => {
    const amt = sumAmt(
      expenses.filter((expense) => expense.petSn === pet.petSn),
    );
    return {
      petSn: pet.petSn,
      label: getPetFilterLabel(pet),
      totalAmt: amt,
      ratio: getRatio(amt, totalAmt),
    };
  };
  const stats = pets
    .map((pet) => ({ pet, stat: toStat(pet) }))
    .filter(
      ({ pet, stat }) => pet.petStts === PET_STTS.ACTIVE || stat.totalAmt > 0,
    )
    .map(({ stat }) => stat);
  const sharedAmt = sumAmt(expenses.filter((expense) => expense.petSn == null));
  return {
    pets: stats,
    shared:
      sharedAmt > 0
        ? { totalAmt: sharedAmt, ratio: getRatio(sharedAmt, totalAmt) }
        : null,
  };
};

export const getTopExpenses = (expenses, count) =>
  [...expenses]
    .sort(
      (a, b) => b.expndAmt - a.expndAmt || b.expndYmd.localeCompare(a.expndYmd),
    )
    .slice(0, count);

/** 6주 42칸 달력 그리드 */
export const getCalendarCells = (ym, expenses) => {
  const [year, month] = ym.split('-').map(Number);
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const dayCount = new Date(year, month, 0).getDate();
  return Array.from({ length: 42 }, (_, index) => {
    const day = index - firstWeekday + 1;
    if (day < 1 || day > dayCount) return { day: null };
    const expndYmd = `${ym}-${String(day).padStart(2, '0')}`;
    const items = expenses.filter((expense) => expense.expndYmd === expndYmd);
    return { day, expndYmd, items, totalAmt: sumAmt(items) };
  });
};

export const filterExpenses = (expenses, { petFilter, categoryFilter }) =>
  expenses.filter((expense) => {
    if (petFilter === FILTER_SHARED && expense.petSn != null) return false;
    if (
      petFilter !== FILTER_ALL &&
      petFilter !== FILTER_SHARED &&
      String(expense.petSn) !== petFilter
    ) {
      return false;
    }
    return (
      categoryFilter === FILTER_ALL || expense.expndClsfCd === categoryFilter
    );
  });

export const sortExpenses = (expenses, sort) =>
  [...expenses].sort((a, b) =>
    sort === SORT.AMOUNT
      ? b.expndAmt - a.expndAmt || b.expndSn - a.expndSn
      : b.expndYmd.localeCompare(a.expndYmd) || b.expndSn - a.expndSn,
  );

/** 같은 날짜끼리 묶음 */
export const groupByDay = (expenses) => {
  const groups = [];
  expenses.forEach((expense) => {
    const last = groups[groups.length - 1];
    if (last && last.expndYmd === expense.expndYmd) {
      last.items.push(expense);
    } else {
      groups.push({ expndYmd: expense.expndYmd, items: [expense] });
    }
  });
  return groups.map((group) => ({ ...group, totalAmt: sumAmt(group.items) }));
};

export const getClsfName = (code) => EXPND_CLSF[code]?.name ?? '';
