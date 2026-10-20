import {
  EXPND_CLSF,
  EXPND_CLSF_LIST,
  FILTER_ALL,
  FILTER_SHARED,
  PET_STTS,
  SORT,
} from './expenseCodes';
import { getPetFilterLabel } from './expenseFormat';

// 백엔드가 집계를 주기 전까지 가짜 응답에서 화면이 직접 집계한다
export const sumAmt = (expenses) =>
  expenses.reduce((sum, expense) => sum + expense.expndAmt, 0);

export const getRatio = (amt, totalAmt) =>
  totalAmt === 0 ? 0 : Math.round((amt / totalAmt) * 100);

export const getMonthExpenses = (expenses, ym) =>
  expenses.filter((expense) => expense.expndYmd.startsWith(ym));

// 항목마다 반올림하면 합이 99나 101이 되므로, 내림한 뒤 모자란 만큼을 소수 부분이 큰 항목부터 1씩 더한다
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
  const ratios = getRatiosSummingTo100(stats.map((stat) => stat.totalAmt));
  return stats.map((stat, index) => ({ ...stat, ratio: ratios[index] }));
};

// 현재 연동 중인 동물은 지출이 없어도 등록순으로 모두 보이고,
// 연동 해제·삭제된 동물은 그 달에 지출이 있을 때만 뒤에 붙는다. 공용은 따로 돌려준다
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

// 6주(42칸) 그리드. 달 밖의 칸은 { day: null }
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

// 같은 날짜가 이어진 것끼리 묶는다. 금액순이면 같은 날짜 머리가 여러 번 나올 수 있다
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
