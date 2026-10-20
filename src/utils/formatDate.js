/**
 * [날짜 표기 유틸]
 * - 'YYYY-MM-DD' 문자열(시간이 붙으면 앞 10자리)과 Date를 같은 옵션으로 표기
 * - formatDate 옵션: separator·hasYear·weekday·weekdayGap
 */

export const WEEKDAYS = '일월화수목금토';

const pad = (value) => String(value).padStart(2, '0');

/** 'YYYY-MM-DD' → 로컬 Date */
export const parseYmd = (ymd) => {
  const [year, month, day] = ymd.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
};

/** Date → 'YYYY-MM-DD' */
export const toYmd = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** 화면 표기 변환: 기본 '2026.10.06' */
export const formatDate = (
  value,
  { separator = '.', hasYear = true, weekday = false, weekdayGap = ' ' } = {},
) => {
  const date = value instanceof Date ? value : parseYmd(value);
  const parts = [pad(date.getMonth() + 1), pad(date.getDate())];
  if (hasYear) parts.unshift(date.getFullYear());
  const base = parts.join(separator);
  return weekday ? `${base}${weekdayGap}(${WEEKDAYS[date.getDay()]})` : base;
};
