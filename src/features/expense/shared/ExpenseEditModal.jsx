import { showToast } from '@/components/toastStore';
import ExpenseForm from './ExpenseForm';
import { useUpdateExpense } from '../queries';

/** 지출 수정 모달: 중복 확인 없음 */
export default function ExpenseEditModal({ expense, pets, onSaved, onClose }) {
  const updateExpense = useUpdateExpense();

  const handleSubmit = (item) =>
    updateExpense.mutate(
      { ...item, expndSn: expense.expndSn },
      {
        onSuccess: () => onSaved(item.expndYmd),
        onError: () =>
          showToast('저장하지 못했어요. 잠시 후 다시 시도해 주세요'),
      },
    );

  return (
    <ExpenseForm
      expense={expense}
      pets={pets}
      isPending={updateExpense.isPending}
      onSubmit={handleSubmit}
      onClose={onClose}
    />
  );
}
