// 서버 날짜("2026-10-12")는 시간대 없는 한국 날짜다. new Date('2026-10-12')는 UTC 자정으로 읽혀
// 시간대에 따라 하루가 밀리므로, 날짜 계산과 표시는 모두 이 파일의 함수로 한다(docs/convention/api.md)

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const pad = (value) => String(value).padStart(2, '0');

const parseYmd = (ymd) => {
  const [year, month, day] = ymd.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const toYmd = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const getTodayYmd = () => toYmd(new Date());

export const makeYmd = (year, month, day) =>
  `${year}-${pad(month)}-${pad(day)}`;

export const getYear = (ymd) => Number(ymd.slice(0, 4));

export const getMonth = (ymd) => Number(ymd.slice(5, 7));

export const getDay = (ymd) => Number(ymd.slice(8, 10));

export const addDays = (ymd, days) => {
  const date = parseYmd(ymd);
  date.setDate(date.getDate() + days);
  return toYmd(date);
};

// 1월 31일 + 1개월처럼 그 달에 없는 날짜는 그 달 마지막 날로 맞춘다
export const addMonths = (ymd, months) => {
  const date = parseYmd(ymd);
  const day = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + months);
  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
  ).getDate();
  date.setDate(Math.min(day, lastDay));
  return toYmd(date);
};

// to - from 의 일수. to가 앞이면 음수
export const diffDays = (fromYmd, toYmdValue) =>
  Math.round((parseYmd(toYmdValue) - parseYmd(fromYmd)) / 86400000);

export const getWeekdayIndex = (ymd) => parseYmd(ymd).getDay();

export const getDaysInMonth = (year, month) =>
  new Date(year, month, 0).getDate();

// "8월 12일(수)"
export const formatMonthDayWeekday = (ymd) =>
  `${getMonth(ymd)}월 ${getDay(ymd)}일(${WEEKDAYS[getWeekdayIndex(ymd)]})`;

// "2026-09-19(금)"
export const formatYmdWeekday = (ymd) =>
  `${ymd}(${WEEKDAYS[getWeekdayIndex(ymd)]})`;

// "08.29"
export const formatMonthDayDot = (ymd) =>
  `${ymd.slice(5, 7)}.${ymd.slice(8, 10)}`;

// "월요일"
export const formatWeekdayLong = (ymd) =>
  `${WEEKDAYS[getWeekdayIndex(ymd)]}요일`;

// "10:00" → "오전 10:00", "15:00" → "오후 3:00"
export const formatTime = (hhmm) => {
  const [hour, minute] = hhmm.split(':').map(Number);
  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${period} ${displayHour}:${pad(minute)}`;
};
