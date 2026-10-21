import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  cancelRegister,
  confirmRegister,
  deleteConversation,
  getConversation,
  getConversations,
  recognizeCheckupReceipt,
  sendMessage,
} from './api';

export const aiKeys = {
  lists: ['ai', 'conversations', 'list'],
  list: (petSn) => ['ai', 'conversations', 'list', petSn],
  detail: (aiCnvrsRoomSn) => ['ai', 'conversations', 'detail', aiCnvrsRoomSn],
};

/** 대화 목록 조회 */
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
    /** 삭제된 대화 상세는 무효화 대신 캐시 제거 */
    onSuccess: (_, aiCnvrsRoomSn) => {
      queryClient.removeQueries({ queryKey: aiKeys.detail(aiCnvrsRoomSn) });
      queryClient.invalidateQueries({ queryKey: aiKeys.lists });
    },
  });
};

/** 등록 확정·취소 공통: 결과 문구로 바뀐 대화 상세 갱신 */
const useRegisterAnswer = (mutationFn) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (_, { aiCnvrsRoomSn }) => {
      queryClient.invalidateQueries({
        queryKey: aiKeys.detail(aiCnvrsRoomSn),
      });
    },
  });
};

export const useConfirmRegister = () => useRegisterAnswer(confirmRegister);

export const useCancelRegister = () => useRegisterAnswer(cancelRegister);

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

/** 검진 영수증 인식 */
export const useRecognizeCheckupReceipt = () =>
  useMutation({ mutationFn: recognizeCheckupReceipt });
