import { EXPND_CLSF } from './expenseCodes';

/** isDay: 앱 날짜 상세에서는 뱃지 배경 없이 굵은 글자만 */
export default function ExpenseCategoryBadge({ code, isDay = false }) {
  const clsf = EXPND_CLSF[code];
  return (
    <span
      className={`inline-flex h-6 min-w-12 shrink-0 items-center justify-center rounded-full px-2.5 text-badge font-semibold ${clsf.badge} ${isDay ? 'max-[760px]:col-start-1 max-[760px]:row-start-1 max-[760px]:min-w-0 max-[760px]:justify-self-start max-[760px]:bg-transparent max-[760px]:p-0 max-[760px]:text-[15px] max-[760px]:font-bold max-[760px]:text-ink' : ''}`}
    >
      {clsf.name}
    </span>
  );
}
