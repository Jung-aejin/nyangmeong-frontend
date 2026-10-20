import ExpenseCategoryBadge from './ExpenseCategoryBadge';
import { formatWon, getPetLabel } from './expenseFormat';

// 지출 한 줄의 내용: 카테고리 배지 + 반려동물·내용 + 금액. 줄 바깥 요소(버튼·라벨)는 쓰는 쪽이 정한다
export default function ExpenseInfo({ expense, prefix = '' }) {
  return (
    <>
      <ExpenseCategoryBadge code={expense.expndClsfCd} />
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">
          {prefix}
          {getPetLabel(expense)}
        </span>
        {expense.dtlMttr && (
          <span className="block text-sm text-subtle">{expense.dtlMttr}</span>
        )}
      </span>
      <b className="font-bold whitespace-nowrap">
        {formatWon(expense.expndAmt)}
      </b>
    </>
  );
}
