import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getNotifications, getUnreadCount, readNotification } from './api';

export const notificationKeys = {
  unreadCount: ['notifications', 'unread-count'],
  list: ['notifications', 'list'],
};

export const useUnreadCount = () =>
  useQuery({
    queryKey: notificationKeys.unreadCount,
    queryFn: getUnreadCount,
  });

// tab은 notiTabs.js의 탭 하나다. 탭마다 따로 캐시한다
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
