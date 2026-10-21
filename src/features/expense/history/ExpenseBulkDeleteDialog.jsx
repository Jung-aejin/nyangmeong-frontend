import { CalendarRange } from 'lucide-react';
import { BTN_DANGER, BTN_SECONDARY } from '@/components/buttonStyles';
import Modal from '@/components/Modal';
import { showToast } from '@/components/toastStore';
import { formatYm } from '@/utils/yearMonth';
import { formatWon } from '../shared/expenseFormat';
import { useDeleteExpenses } from '../queries';

/** 두 달 이상 범위 오삭제 방지 안내 */
export default function ExpenseBulkDeleteDialog({
  expndSns,
  totalAmt,
  fromYm,
  toYm,
  filterLabel,
  onDeleted,
  onClose,
}) {
  const deleteExpenses = useDeleteExpenses();
  const isMultiMonth = fromYm !== toYm;
  const rangeText = isMultiMonth
    ? `${formatYm(fromYm)} ~ ${formatYm(toYm)}`
    : formatYm(fromYm);

  const handleDelete = () =>
    deleteExpenses.mutate(expndSns, {
      onSuccess: onDeleted,
      onError: () => showToast('삭제하지 못했어요. 잠시 후 다시 시도해 주세요'),
    });

  return (
    <Modal
      isConfirm
      title={`선택한 지출 ${expndSns.length}건을 삭제할까요?`}
      description={
        isMultiMonth
          ? '여러 달에 걸친 내역이에요. 삭제하면 되돌릴 수 없어요'
          : '삭제하면 되돌릴 수 없어요'
      }
      isPending={deleteExpenses.isPending}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={deleteExpenses.isPending}
            className={BTN_SECONDARY}
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteExpenses.isPending}
            className={BTN_DANGER}
          >
            삭제
          </button>
        </>
      }
    >
      <p className="mt-4 flex items-start gap-2 rounded-box border border-warn-line bg-warn-soft px-4 py-3 text-left text-sm text-warn">
        <CalendarRange className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>
          {rangeText} · {filterLabel}
          <br />
          <b>
            {expndSns.length}건 · {formatWon(totalAmt)}
          </b>
        </span>
      </p>
    </Modal>
  );
}
