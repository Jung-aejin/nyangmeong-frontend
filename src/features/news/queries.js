import { useQuery } from '@tanstack/react-query';
import { getNews, getNewsList, getPopularNews } from './api';

export const newsKeys = {
  all: ['news'],
  list: (params) => ['news', 'list', params],
  popular: ['news', 'popular'],
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

export const usePopularNews = () =>
  useQuery({
    queryKey: newsKeys.popular,
    queryFn: getPopularNews,
  });
