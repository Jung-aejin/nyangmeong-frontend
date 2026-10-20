import { ChevronLeft, ChevronRight } from 'lucide-react';

const NAV_BUTTON =
  'grid size-10 shrink-0 place-items-center rounded-full border border-line bg-white text-ink-2 hover:enabled:border-line-strong hover:enabled:text-ink disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-line-strong';

// children은 ◀ ▶ 사이에 놓이는 연월 표시다
export default function MonthNav({
  onPrev,
  onNext,
  isPrevDisabled = false,
  isNextDisabled = false,
  children,
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onPrev}
        disabled={isPrevDisabled}
        aria-label="이전 달"
        className={NAV_BUTTON}
      >
        <ChevronLeft className="size-5" />
      </button>
      {children}
      <button
        type="button"
        onClick={onNext}
        disabled={isNextDisabled}
        aria-label="다음 달"
        className={NAV_BUTTON}
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
