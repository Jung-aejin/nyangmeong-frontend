import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createExpenses,
  deleteExpense,
  deleteExpenses,
  findDuplicateExpenses,
  getExpenseOverview,
  getExpenses,
  recognizeReceipt,
  saveExpenseLimit,
  updateExpense,
} from './api';

export const expenseKeys = {
  all: ['expenses'],
  list: (range) => ['expenses', 'list', range],
  overview: () => ['expenses', 'overview'],
};

// 월을 바꿀 때 목록이 비었다 채워지며 깜박이지 않게 이전 결과를 유지한다
export const useExpenses = (range) =>
  useQuery({
    queryKey: expenseKeys.list(range),
    queryFn: () => getExpenses(range),
    placeholderData: keepPreviousData,
  });

export const useExpenseOverview = () =>
  useQuery({ queryKey: expenseKeys.overview(), queryFn: getExpenseOverview });

const useExpenseMutation = (mutationFn) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => qc.invalidateQueries({ queryKey: expenseKeys.all }),
  });
};

export const useSaveExpenseLimit = () => useExpenseMutation(saveExpenseLimit);
export const useDeleteExpense = () => useExpenseMutation(deleteExpense);
export const useDeleteExpenses = () => useExpenseMutation(deleteExpenses);
export const useCreateExpenses = () => useExpenseMutation(createExpenses);
export const useUpdateExpense = () => useExpenseMutation(updateExpense);
// 저장 전에 겹치는 지출을 찾는다. 목록이 바뀌지 않으므로 캐시를 건드리지 않는다
export const useFindDuplicateExpenses = () =>
  useMutation({ mutationFn: findDuplicateExpenses });
export const useRecognizeReceipt = () =>
  useMutation({ mutationFn: recognizeReceipt });
