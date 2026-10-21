import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/components/toastStore';
import {
  getNotificationSettings,
  getNotifications,
  getUnreadCount,
  readNotification,
  saveNotificationSettings,
} from './api';

export const notificationKeys = {
  unreadCount: ['notifications', 'unread-count'],
  list: ['notifications', 'list'],
  settings: ['notifications', 'settings'],
};

/** 배치(09:00) 생성 알림을 열린 창에도 반영하는 1분 주기 조회 */
export const useUnreadCount = () =>
  useQuery({
    queryKey: notificationKeys.unreadCount,
    queryFn: getUnreadCount,
    refetchInterval: 60_000,
  });

/** tab별 캐시 알림 목록 */
export const useNotifications = (tab) =>
  useQuery({
    queryKey: [...notificationKeys.list, tab.key],
    queryFn: () => getNotifications({ notiTypeCd: tab.types, size: 5 }),
  });

export const useReadNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: readNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount });
      queryClient.invalidateQueries({ queryKey: notificationKeys.list });
    },
  });
};

export const useNotificationSettings = () =>
  useQuery({
    queryKey: notificationKeys.settings,
    queryFn: getNotificationSettings,
  });

export const useSaveNotificationSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveNotificationSettings,
    onSuccess: (saved) => {
      queryClient.setQueryData(notificationKeys.settings, saved);
      showToast('저장했어요');
    },
    onError: () => showToast('저장하지 못했어요. 잠시 뒤 다시 시도해 주세요'),
  });
};
