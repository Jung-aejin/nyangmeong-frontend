import ExpenseCategoryBadge from './ExpenseCategoryBadge';
import { formatWon, getPetLabel } from './expenseFormat';

/** 지출 한 줄 (배지·반려동물·내용·금액) */
export default function ExpenseInfo({ expense, prefix = '', isDay = false }) {
  return (
    <>
      <ExpenseCategoryBadge code={expense.expndClsfCd} isDay={isDay} />
      <span
        className={`min-w-0 flex-1 ${isDay ? 'max-[760px]:col-start-1 max-[760px]:row-start-2' : ''}`}
      >
        <span
          className={`block font-semibold ${isDay ? 'max-[760px]:text-sm max-[760px]:font-normal max-[760px]:text-subtle' : ''}`}
        >
          {prefix}
          {getPetLabel(expense)}
        </span>
        {expense.dtlMttr && (
          <span
            className={`block text-sm text-subtle ${isDay ? 'max-[760px]:hidden' : ''}`}
          >
            {expense.dtlMttr}
          </span>
        )}
      </span>
      <b
        className={`font-bold whitespace-nowrap ${isDay ? 'max-[760px]:col-start-2 max-[760px]:row-span-2 max-[760px]:row-start-1 max-[760px]:self-center max-[760px]:text-[15px]' : ''}`}
      >
        {formatWon(expense.expndAmt)}
      </b>
    </>
  );
}
