import { BTN_DANGER, BTN_SECONDARY } from '@/components/buttonStyles';
import Modal from '@/components/Modal';
import { showToast } from '@/components/toastStore';
import ExpenseInfo from '../shared/ExpenseInfo';
import { formatFullDayHeader } from '../shared/expenseFormat';
import { EXPND_CLSF } from '../shared/expenseCodes';
import { DAY_HEAD, DAY_ROW_APP, EXPENSE_ROW } from '../shared/expenseStyles';
import { useDeleteExpense } from '../queries';

export default function ExpenseDeleteDialog({ expense, onClose }) {
  const deleteExpense = useDeleteExpense();

  const handleDelete = () =>
    deleteExpense.mutate(expense.expndSn, {
      onSuccess: onClose,
      onError: () => showToast('삭제하지 못했어요. 잠시 후 다시 시도해 주세요'),
    });

  return (
    <Modal
      isConfirm
      title="이 지출을 삭제할까요?"
      description="삭제하면 되돌릴 수 없어요"
      isPending={deleteExpense.isPending}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={deleteExpense.isPending}
            className={BTN_SECONDARY}
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteExpense.isPending}
            className={BTN_DANGER}
          >
            삭제
          </button>
        </>
      }
    >
      <div className="mt-4 overflow-hidden rounded-box border border-line text-left">
        <div className={DAY_HEAD}>{formatFullDayHeader(expense.expndYmd)}</div>
        <div
          className={`${EXPENSE_ROW} ${DAY_ROW_APP}`}
          style={{ '--cat': EXPND_CLSF[expense.expndClsfCd].color }}
        >
          <ExpenseInfo expense={expense} isDay />
        </div>
      </div>
    </Modal>
  );
}
