import { PET_STTS } from './expenseCodes';

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

export const formatWon = (amt) => `${amt.toLocaleString('ko-KR')}원`;

// '2026-09-15' → '9월 15일 (화)'
export const formatDayHeader = (expndYmd) => {
  const [year, month, day] = expndYmd.split('-').map(Number);
  const dayName = DAY_NAMES[new Date(year, month - 1, day).getDay()];
  return `${month}월 ${day}일 (${dayName})`;
};

export const formatFullDayHeader = (expndYmd) =>
  `${expndYmd.slice(0, 4)}년 ${formatDayHeader(expndYmd)}`;

// '2026-09-15' → '09-15'
export const formatMonthDay = (expndYmd) => expndYmd.slice(5);

// 지출 줄과 달력에 보이는 반려동물 이름. petSn이 없으면 공용 지출이다
export const getPetLabel = (expense) => {
  if (expense.petSn == null) return '공용';
  if (expense.petStts === PET_STTS.DELETED) return `${expense.petNm} (삭제됨)`;
  return expense.petNm;
};

// 반려동물 필터 목록과 반려동물별 지출에 보이는 이름
export const getPetFilterLabel = (pet) => {
  if (pet.petStts === PET_STTS.DELETED) return `${pet.petNm} (삭제됨)`;
  if (pet.petStts === PET_STTS.UNLINKED) return `${pet.petNm} (연동 해제)`;
  return pet.petNm;
};
