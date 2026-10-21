import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/components/toastStore';
import {
  createChatMessage,
  createChatRoom,
  getChatMessages,
  getChatRooms,
  getChatUnreadCount,
  readChatRoom,
} from './api';

export const chatKeys = {
  lists: ['chat-rooms', 'list'],
  list: (unreadOnly) => ['chat-rooms', 'list', unreadOnly],
  unreadCount: ['chat-rooms', 'unread-count'],
  messages: (otoChatRoomSn) => ['chat-rooms', otoChatRoomSn, 'messages'],
};

/** 다른 창의 새 메시지를 반영하는 1분 주기 목록 */
export const useChatRooms = (unreadOnly) =>
  useQuery({
    queryKey: chatKeys.list(unreadOnly),
    queryFn: () => getChatRooms({ unreadOnly }),
    refetchInterval: 60_000,
  });

/** 헤더 배지: 채팅 창에서 읽고 본창으로 돌아오면 다시 조회 */
export const useChatUnreadCount = () =>
  useQuery({
    queryKey: chatKeys.unreadCount,
    queryFn: getChatUnreadCount,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });

export const useChatMessages = (otoChatRoomSn) =>
  useQuery({
    queryKey: chatKeys.messages(otoChatRoomSn),
    queryFn: () => getChatMessages(otoChatRoomSn),
    enabled: otoChatRoomSn !== null,
  });

export const useCreateChatRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChatRoom,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: chatKeys.lists }),
    onError: (error) => showToast(error.message),
  });
};

export const useReadChatRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: readChatRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.lists });
      queryClient.invalidateQueries({ queryKey: chatKeys.unreadCount });
    },
  });
};

export const useSendChatMessage = (otoChatRoomSn) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => createChatMessage({ otoChatRoomSn, ...body }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(otoChatRoomSn),
      });
      queryClient.invalidateQueries({ queryKey: chatKeys.lists });
    },
    onError: (error) => showToast(error.message),
  });
};
