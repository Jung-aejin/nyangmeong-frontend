import { useQuery } from '@tanstack/react-query';
import { getMe } from './api';

export const memberKeys = { me: ['members', 'me'] };

export const useMe = () =>
  useQuery({
    queryKey: memberKeys.me,
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
  });
