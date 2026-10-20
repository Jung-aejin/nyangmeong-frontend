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

/** 월 전환 시 깜박임 방지용 이전 결과 유지 */
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
/** 저장 전 중복 지출 조회 */
export const useFindDuplicateExpenses = () =>
  useMutation({ mutationFn: findDuplicateExpenses });
export const useRecognizeReceipt = () =>
  useMutation({ mutationFn: recognizeReceipt });
