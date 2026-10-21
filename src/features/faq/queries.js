import { useQuery } from '@tanstack/react-query';
import { getFaqs } from './api';

export const faqKeys = {
  all: ['faqs'],
  list: (params) => ['faqs', 'list', params],
};

export const useFaqs = (params) =>
  useQuery({
    queryKey: faqKeys.list(params),
    queryFn: () => getFaqs(params),
  });
