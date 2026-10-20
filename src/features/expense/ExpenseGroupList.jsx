import ExpenseInfo from './ExpenseInfo';
import { formatDayHeader, formatWon } from './expenseFormat';
import { DAY_HEAD, EXPENSE_ROW } from './expenseStyles';

/** 편집 여부별 줄 형태 (체크박스 라벨 또는 수정 버튼) */
export default function ExpenseGroupList({
  groups,
  isEditing,
  selected,
  onToggle,
  onEditItem,
}) {
  return (
    <>
      {groups.map((group, index) => (
        <div key={`${group.expndYmd}-${index}`}>
          <div className={DAY_HEAD}>
            <span>{formatDayHeader(group.expndYmd)}</span>
            <span>
              {formatWon(group.totalAmt)}
              {group.items.length > 1 && ` · ${group.items.length}건`}
            </span>
          </div>
          {group.items.map((expense) =>
            isEditing ? (
              <label
                key={expense.expndSn}
                className={`${EXPENSE_ROW} cursor-pointer hover:bg-surface-2`}
              >
                <input
                  type="checkbox"
                  checked={selected.has(expense.expndSn)}
                  onChange={() => onToggle(expense.expndSn)}
                  className="size-5 shrink-0 cursor-pointer accent-brand-500"
                />
                <ExpenseInfo expense={expense} />
              </label>
            ) : (
              <button
                key={expense.expndSn}
                type="button"
                onClick={() => onEditItem(expense)}
                className={`${EXPENSE_ROW} hover:bg-surface-2`}
              >
                <ExpenseInfo expense={expense} />
              </button>
            ),
          )}
        </div>
      ))}
    </>
  );
}
