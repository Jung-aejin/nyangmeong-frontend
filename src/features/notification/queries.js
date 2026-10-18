import { useQuery } from '@tanstack/react-query';
import { getUnreadCount } from './api';

export const notificationKeys = { unreadCount: ['notifications', 'unread-count'] };

export const useUnreadCount = () =>
  useQuery({
    queryKey: notificationKeys.unreadCount,
    queryFn: getUnreadCount,
  });
