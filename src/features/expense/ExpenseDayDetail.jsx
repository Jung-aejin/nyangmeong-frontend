import { BTN_SECONDARY } from '@/components/buttonStyles';
import ExpenseInfo from './ExpenseInfo';
import { formatDayHeader, formatWon } from './expenseFormat';
import { DAY_HEAD, EXPENSE_ROW } from './expenseStyles';

const ROW_BUTTON = `${BTN_SECONDARY} h-8 px-3 text-sm`;

export default function ExpenseDayDetail({
  expndYmd,
  items,
  totalAmt,
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
        <div key={expense.expndSn} className={EXPENSE_ROW}>
          <ExpenseInfo expense={expense} />
          <div className="flex gap-1">
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
    </section>
  );
}
