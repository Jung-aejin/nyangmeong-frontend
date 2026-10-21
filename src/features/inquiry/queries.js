import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createInquiry, getInquiries, getInquiry, updateInquiry } from './api';

export const inquiryKeys = {
  all: ['inquiries'],
  list: (params) => ['inquiries', 'list', params],
  detail: (otoInqrySn) => ['inquiries', otoInqrySn],
};

export const useInquiries = (params) =>
  useQuery({
    queryKey: inquiryKeys.list(params),
    queryFn: () => getInquiries(params),
  });

export const useInquiry = (otoInqrySn) =>
  useQuery({
    queryKey: inquiryKeys.detail(otoInqrySn),
    queryFn: () => getInquiry(otoInqrySn),
    retry: false,
  });

export const useCreateInquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInquiry,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: inquiryKeys.all }),
  });
};

export const useUpdateInquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateInquiry,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: inquiryKeys.all }),
  });
};
