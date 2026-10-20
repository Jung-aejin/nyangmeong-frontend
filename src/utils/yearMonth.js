// 연월은 'YYYY-MM' 문자열로 다룬다. 문자열 비교가 곧 시간순이다
const pad = (value) => String(value).padStart(2, '0');

export const getCurrentYm = () => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
};

export const isYm = (value) => /^\d{4}-(0[1-9]|1[0-2])$/.test(value ?? '');

export const shiftYm = (ym, delta) => {
  const [year, month] = ym.split('-').map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
};

export const formatYm = (ym) =>
  `${ym.slice(0, 4)}년 ${Number(ym.slice(5, 7))}월`;
