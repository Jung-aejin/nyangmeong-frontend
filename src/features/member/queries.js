import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  checkNickname,
  checkPhone,
  getCaptcha,
  getLoginStatus,
  getMe,
  getMemberSummary,
  getMyProfile,
  getRecoveryStatus,
  login,
  logout,
  resetPassword,
  sendRecoveryCode,
  updateNickname,
  updatePassword,
  updatePhone,
  updateProfileImage,
  verifyPassword,
  verifyRecoveryCode,
} from './api';

export const memberKeys = {
  me: ['members', 'me'],
  summary: ['members', 'summary'],
  profile: ['members', 'profile'],
  recovery: ['members', 'recovery'],
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

export const useMyProfile = () =>
  useQuery({ queryKey: memberKeys.profile, queryFn: getMyProfile });

export const useVerifyPassword = () =>
  useMutation({ mutationFn: verifyPassword });

export const useUpdateProfileImage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateProfileImage,
    onSuccess: () => qc.invalidateQueries({ queryKey: memberKeys.profile }),
  });
};

export const useCheckNickname = () =>
  useMutation({ mutationFn: checkNickname });

export const useUpdateNickname = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateNickname,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: memberKeys.profile });
      qc.invalidateQueries({ queryKey: memberKeys.summary });
    },
  });
};

export const useCheckPhone = () => useMutation({ mutationFn: checkPhone });

export const useUpdatePhone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updatePhone,
    onSuccess: () => qc.invalidateQueries({ queryKey: memberKeys.profile }),
  });
};

export const useUpdatePassword = () =>
  useMutation({ mutationFn: updatePassword });

export const useLogin = () => useMutation({ mutationFn: login });

export const useLoginStatus = () => useMutation({ mutationFn: getLoginStatus });

export const useNewCaptcha = () => useMutation({ mutationFn: getCaptcha });

export const useSendRecoveryCode = () =>
  useMutation({ mutationFn: sendRecoveryCode });

export const useVerifyRecoveryCode = () =>
  useMutation({ mutationFn: verifyRecoveryCode });

export const useRecoveryStatus = () =>
  useQuery({ queryKey: memberKeys.recovery, queryFn: getRecoveryStatus });

export const useResetPassword = () =>
  useMutation({ mutationFn: resetPassword });
