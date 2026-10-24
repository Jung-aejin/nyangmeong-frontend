import { Plus } from 'lucide-react';
import { BTN_SECONDARY } from '@/components/buttonStyles';
import ExpenseInfo from '../shared/ExpenseInfo';
import { formatDayHeader, formatWon } from '../shared/expenseFormat';
import { EXPND_CLSF } from '../shared/expenseCodes';
import { DAY_HEAD, DAY_ROW_APP, EXPENSE_ROW } from '../shared/expenseStyles';

const ROW_BUTTON = `${BTN_SECONDARY} h-8 px-3 text-sm`;

export default function ExpenseDayDetail({
  expndYmd,
  items,
  totalAmt,
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <section aria-label="날짜별 지출 상세" className="mt-5">
      <div className={`${DAY_HEAD} rounded-md`}>
        <span>{formatDayHeader(expndYmd)}</span>
        <span>
          {formatWon(totalAmt)} · {items.length}건
        </span>
      </div>
      {items.map((expense) => (
        <div
          key={expense.expndSn}
          className={`${EXPENSE_ROW} ${DAY_ROW_APP}`}
          style={{ '--cat': EXPND_CLSF[expense.expndClsfCd].color }}
        >
          <ExpenseInfo expense={expense} isDay />
          <div className="flex gap-1 max-[760px]:col-span-2 max-[760px]:row-start-3 max-[760px]:mt-2">
            <button
              type="button"
              onClick={() => onEdit(expense)}
              className={ROW_BUTTON}
            >
              수정
            </button>
            <button
              type="button"
              onClick={() => onDelete(expense)}
              className={ROW_BUTTON}
            >
              삭제
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className={`${BTN_SECONDARY} mt-2 w-full`}
      >
        <Plus className="size-4" aria-hidden="true" />
        지출 추가
      </button>
    </section>
  );
}
