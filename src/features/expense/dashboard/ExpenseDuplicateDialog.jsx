import { BTN_PRIMARY, BTN_SECONDARY } from '@/components/buttonStyles';
import Modal from '@/components/Modal';
import ExpenseInfo from '../shared/ExpenseInfo';
import { EXPND_CLSF } from '../shared/expenseCodes';
import { formatMonthDay } from '../shared/expenseFormat';
import { DAY_ROW_APP, EXPENSE_ROW } from '../shared/expenseStyles';

/** 겹치는 기존 지출 확인 */
export default function ExpenseDuplicateDialog({
  duplicates,
  isPending,
  onConfirm,
  onClose,
}) {
  return (
    <Modal
      isConfirm
      title="이미 같은 지출이 있어요"
      description="같은 날짜·반려동물·카테고리·금액의 지출이 가계부에 있어요. 그래도 저장할까요?"
      isPending={isPending}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className={BTN_SECONDARY}
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={BTN_PRIMARY}
          >
            그래도 저장
          </button>
        </>
      }
    >
      <div className="mt-4 max-h-60 overflow-y-auto rounded-box border border-line text-left">
        {duplicates.map((expense) => (
          <div
            key={expense.expndSn}
            className={`${EXPENSE_ROW} ${DAY_ROW_APP}`}
            style={{ '--cat': EXPND_CLSF[expense.expndClsfCd].color }}
          >
            <ExpenseInfo
              expense={expense}
              prefix={`${formatMonthDay(expense.expndYmd)} · `}
              isDay
            />
          </div>
        ))}
      </div>
    </Modal>
  );
}
