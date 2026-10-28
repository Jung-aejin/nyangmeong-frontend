import { useQuery } from '@tanstack/react-query';
import { getNotice, getNotices } from './api';

export const noticeKeys = {
  all: ['notices'],
  list: (params) => ['notices', 'list', params],
  detail: (ntcMttrSn) => ['notices', ntcMttrSn],
};

export const useNotices = (params) =>
  useQuery({
    queryKey: noticeKeys.list(params),
    queryFn: () => getNotices(params),
  });

export const useNotice = (ntcMttrSn) =>
  useQuery({
    queryKey: noticeKeys.detail(ntcMttrSn),
    queryFn: () => getNotice(ntcMttrSn),
  });
