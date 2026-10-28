import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/components/toastStore';
import {
  acceptCareMatch,
  cancelCareMatch,
  confirmCareCompletion,
  confirmCareReceipt,
  createChatMessage,
  createChatRoom,
  getChatMessages,
  getChatRoom,
  getChatRooms,
  getChatUnreadCount,
  leaveChatRoom,
  readChatRoom,
  requestCareCompletion,
  requestCareMatch,
  searchChatPlaces,
} from './api';

export const chatKeys = {
  lists: ['chat-rooms', 'list'],
  list: (unreadOnly) => ['chat-rooms', 'list', unreadOnly],
  unreadCount: ['chat-rooms', 'unread-count'],
  detail: (otoChatRoomSn) => ['chat-rooms', otoChatRoomSn, 'detail'],
  places: (keyword) => ['chat-places', keyword],
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
  });
};

export const useChatRoom = (otoChatRoomSn) =>
  useQuery({
    queryKey: chatKeys.detail(otoChatRoomSn),
    queryFn: () => getChatRoom(otoChatRoomSn),
    enabled: otoChatRoomSn !== null,
    refetchInterval: 60_000,
  });

/** 주소 공유 모달의 장소 목록: 키워드가 없으면 돌봄 글 동네 근처 */
export const useChatPlaces = (keyword) =>
  useQuery({
    queryKey: chatKeys.places(keyword),
    queryFn: () => searchChatPlaces({ keyword }),
  });

/** 거래 버튼이 부르는 API: 눌린 key → 함수 */
const DEAL_API = {
  request: requestCareMatch,
  cancel: cancelCareMatch,
  accept: acceptCareMatch,
  doneRequest: requestCareCompletion,
  confirm: confirmCareCompletion,
  receive: confirmCareReceipt,
};

/** 거래 단계 변경: 서버가 방·대화에 반영하므로 끝나면 둘 다 다시 조회 */
export const useDealAction = (otoChatRoomSn) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (action) =>
      action === 'request'
        ? DEAL_API.request({ otoChatRoomSn })
        : DEAL_API[action](otoChatRoomSn),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.detail(otoChatRoomSn),
      });
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(otoChatRoomSn),
      });
      queryClient.invalidateQueries({ queryKey: chatKeys.lists });
    },
    onError: (error) => showToast(error.message),
  });
};

export const useLeaveChatRoom = (otoChatRoomSn) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => leaveChatRoom(otoChatRoomSn),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.lists });
      queryClient.invalidateQueries({ queryKey: chatKeys.unreadCount });
    },
    onError: (error) => showToast(error.message),
  });
};
