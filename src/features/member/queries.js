import { useMutation, useQuery } from '@tanstack/react-query';
import { getMe, getMemberSummary, logout } from './api';

export const memberKeys = {
  me: ['members', 'me'],
  summary: ['members', 'summary'],
};

export const useMe = () =>
  useQuery({
    queryKey: memberKeys.me,
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
  });

export const useMemberSummary = () =>
  useQuery({
    queryKey: memberKeys.summary,
    queryFn: getMemberSummary,
    staleTime: 5 * 60 * 1000,
  });

export const useLogout = () => useMutation({ mutationFn: logout });
