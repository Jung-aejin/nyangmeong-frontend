import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteConversation,
  getConversation,
  getConversations,
  sendMessage,
} from './api';

export const aiKeys = {
  lists: ['ai', 'conversations', 'list'],
  list: (petSn) => ['ai', 'conversations', 'list', petSn],
  detail: (aiCnvrsRoomSn) => ['ai', 'conversations', 'detail', aiCnvrsRoomSn],
};

// petSn이 null이면 [전체]다
export const useConversations = (petSn) =>
  useQuery({
    queryKey: aiKeys.list(petSn),
    queryFn: () => getConversations({ petSn }),
  });

export const useConversation = (aiCnvrsRoomSn) =>
  useQuery({
    queryKey: aiKeys.detail(aiCnvrsRoomSn),
    queryFn: () => getConversation(aiCnvrsRoomSn),
    enabled: aiCnvrsRoomSn != null,
  });

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteConversation,
    // 지운 대화의 상세는 다시 조회하면 실패하므로, 무효화하지 않고 캐시에서 뺀다
    onSuccess: (_, aiCnvrsRoomSn) => {
      queryClient.removeQueries({ queryKey: aiKeys.detail(aiCnvrsRoomSn) });
      queryClient.invalidateQueries({ queryKey: aiKeys.lists });
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,
    onSuccess: ({ aiCnvrsRoomSn }) => {
      queryClient.invalidateQueries({ queryKey: aiKeys.lists });
      queryClient.invalidateQueries({
        queryKey: aiKeys.detail(aiCnvrsRoomSn),
      });
    },
  });
};
