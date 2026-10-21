import ExpenseCategoryBadge from '../shared/ExpenseCategoryBadge';
import { formatMonthDay, formatWon, getPetLabel } from '../shared/expenseFormat';
import { CARD, CARD_BODY, CARD_HEAD, CARD_TITLE } from '../shared/expenseStyles';

export default function ExpenseTopList({ expenses }) {
  return (
    <section aria-labelledby="expense-top-title" className={CARD}>
      <div className={CARD_HEAD}>
        <h2 id="expense-top-title" className={CARD_TITLE}>
          이번달 주요 지출
        </h2>
      </div>
      <div className={CARD_BODY}>
        {expenses.length === 0 ? (
          <p className="text-subtle">이번 달 지출이 없어요</p>
        ) : (
          <ul>
            {expenses.map((expense) => (
              <li
                key={expense.expndSn}
                className="flex items-center gap-3 border-t border-line-soft py-3 first:border-t-0"
              >
                <span className="w-12 text-sm text-subtle">
                  {formatMonthDay(expense.expndYmd)}
                </span>
                <ExpenseCategoryBadge code={expense.expndClsfCd} />
                <span className="min-w-0 flex-1 truncate">
                  {getPetLabel(expense)}
                </span>
                <b className="font-bold whitespace-nowrap">
                  {formatWon(expense.expndAmt)}
                </b>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
