import { useQuery } from '@tanstack/react-query';
import { getNews, getNewsList } from './api';

export const newsKeys = {
  all: ['news'],
  list: (params) => ['news', 'list', params],
  detail: (newsSn) => ['news', newsSn],
};

export const useNewsList = (params) =>
  useQuery({
    queryKey: newsKeys.list(params),
    queryFn: () => getNewsList(params),
  });

export const useNews = (newsSn) =>
  useQuery({
    queryKey: newsKeys.detail(newsSn),
    queryFn: () => getNews(newsSn),
  });
