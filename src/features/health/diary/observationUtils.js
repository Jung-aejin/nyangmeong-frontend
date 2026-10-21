import { formatMonthDayDot } from '@/utils/formatDate';
import { findObservationChange, findObservationPart } from '../diaryTypes';

/**
 * [지속 관찰 계산]
 * - 항목(item)은 관찰일 순으로 정렬된 회차(rounds)를 가지며 회차 번호는 순서 + 1
 */

export const formatSize = (sizeMm) => `${sizeMm.toFixed(1)}mm`;

/** "등 · 오른쪽 어깨", 세부 위치가 없으면 대분류만 */
export const formatPart = (item) => {
  const partNm = findObservationPart(item.obsvPrtCd).nm;
  return item.obsvPrtDtlNm ? `${partNm} · ${item.obsvPrtDtlNm}` : partNm;
};

/** 크기를 입력한 마지막 이전 회차. 없으면 null */
const findPrevSizedIndex = (rounds, index) => {
  for (let prev = index - 1; prev >= 0; prev -= 1) {
    if (rounds[prev].obsvSizeMm !== null) return prev;
  }
  return null;
};

/** 직전 크기 대비 증감: { prevIndex, prevSizeMm, diff }. 비교할 회차가 없으면 null */
export const getSizeDiff = (rounds, index) => {
  const round = rounds[index];
  if (round.obsvSizeMm === null) return null;
  const prevIndex = findPrevSizedIndex(rounds, index);
  if (prevIndex === null) return null;
  const prevSizeMm = rounds[prevIndex].obsvSizeMm;
  return { prevIndex, prevSizeMm, diff: round.obsvSizeMm - prevSizeMm };
};

/** "▲0.3" / "▼0.2", 증감이 없으면 빈 문자열 */
export const formatDiff = (diff) => {
  const rounded = Math.round(Math.abs(diff) * 10) / 10;
  if (rounded === 0) return '';
  return `${diff > 0 ? '▲' : '▼'}${rounded.toFixed(1)}`;
};

/** 목록 값 줄: 마지막 회차의 크기(+증감), 크기가 없으면 변화, 둘 다 없으면 null. 종료 항목은 관찰 기간 */
export const getItemValueText = (item) => {
  const { rounds } = item;
  if (item.obsvEndYmd !== null) {
    return `${formatMonthDayDot(rounds[0].obsvYmd)} ~ ${formatMonthDayDot(rounds[rounds.length - 1].obsvYmd)}`;
  }
  const lastIndex = rounds.length - 1;
  const last = rounds[lastIndex];
  if (last.obsvSizeMm !== null) {
    const sizeDiff = getSizeDiff(rounds, lastIndex);
    const diffText = sizeDiff ? formatDiff(sizeDiff.diff) : '';
    return `${formatSize(last.obsvSizeMm)}${diffText ? ` ${diffText}` : ''}`;
  }
  return last.obsvChgCd ? findObservationChange(last.obsvChgCd).nm : null;
};
