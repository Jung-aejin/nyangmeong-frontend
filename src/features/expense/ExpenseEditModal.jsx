import { showToast } from '@/components/toastStore';
import ExpenseForm from './ExpenseForm';
import { useUpdateExpense } from './queries';

// 수정에는 중복 지출 확인을 하지 않는다. onSaved(expndYmd): 저장한 지출의 날짜
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
