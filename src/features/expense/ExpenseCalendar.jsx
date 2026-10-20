import { formatYm } from '@/utils/yearMonth';
import { getClsfName } from './expenseStats';
import { getPetLabel } from './expenseFormat';

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];
const CELL =
  'flex min-h-20 min-w-0 flex-col items-start border-r border-b border-line bg-white p-2 text-left text-sm';

/** 날짜 칸 클릭 -> 등록 또는 상세 */
export default function ExpenseCalendar({
  ym,
  cells,
  selectedYmd,
  onSelectDay,
  onEmptyDay,
}) {
  const monthLabel = formatYm(ym);

  return (
    <div>
      <p className="mb-3 text-sm text-subtle">날짜를 눌러 지출을 등록하세요</p>
      <div
        role="group"
        aria-label={`${monthLabel} 달력`}
        className="grid grid-cols-7 overflow-hidden rounded-box border-t border-l border-line"
      >
        {DAY_NAMES.map((name) => (
          <div
            key={name}
            className="flex items-center justify-center border-r border-b border-line bg-surface-2 py-2 text-sm font-semibold text-subtle"
          >
            {name}
          </div>
        ))}
        {cells.map((cell, index) => {
          if (cell.day === null) {
            return (
              <div
                key={`out-${index}`}
                aria-hidden="true"
                className={`${CELL} bg-surface-2`}
              />
            );
          }
          const hasItems = cell.items.length > 0;
          const isSelected = cell.expndYmd === selectedYmd;
          return (
            <button
              key={cell.expndYmd}
              type="button"
              onClick={() =>
                hasItems
                  ? onSelectDay(cell.expndYmd)
                  : onEmptyDay(cell.expndYmd)
              }
              aria-pressed={hasItems ? isSelected : undefined}
              aria-label={
                hasItems
                  ? undefined
                  : `${Number(ym.slice(5))}월 ${cell.day}일 지출 등록`
              }
              className={`${CELL} cursor-pointer hover:bg-surface-2 ${
                isSelected
                  ? 'bg-brand-50 shadow-[inset_0_0_0_2px_var(--color-brand-500)] hover:bg-brand-50'
                  : ''
              }`}
            >
              <span
                className={
                  isSelected ? 'font-bold text-brand-600' : 'text-subtle'
                }
              >
                {cell.day}
              </span>
              {hasItems && (
                <>
                  <span className="mt-1 max-w-full truncate font-bold">
                    {cell.totalAmt.toLocaleString('ko-KR')}
                  </span>
                  <span className="max-w-full truncate text-subtle">
                    {cell.items.length === 1
                      ? `${getPetLabel(cell.items[0])}·${getClsfName(cell.items[0].expndClsfCd)}`
                      : `${cell.items.length}건`}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
