import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';
import { useDeleteConversation } from '../queries';

/** 일시 표기 변환 */
const formatDate = (crtDt) => crtDt.slice(0, 10).replaceAll('-', '.');

/** 대화 제목·삭제 헤더 */
export default function ConversationHeader({ conversation, onDeleted }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const deleteConversation = useDeleteConversation();

  const handleDeleteConfirm = () => {
    deleteConversation.mutate(conversation.aiCnvrsRoomSn, {
      onSuccess: () => onDeleted(),
    });
  };

  const handleDeleteCancel = () => {
    deleteConversation.reset();
    setIsConfirming(false);
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-[#e2e7e7] bg-white px-6">
      <h1 className="truncate text-lg font-bold text-[#1a3234]">
        {conversation.aiCnvrsRoomCnvrsTtl}
      </h1>
      <span className="shrink-0 rounded-full bg-[#e9f2f2] px-2.5 py-0.5 text-xs font-medium text-[#285a5c]">
        {conversation.petNm ?? '전체'}
      </span>
      <span className="truncate text-sm text-[#667374]">
        {formatDate(conversation.crtDt)} · 대화 제목은 첫 메시지로 자동 생성돼요
      </span>
      <button
        type="button"
        className="ml-auto flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-[#285a5c] hover:bg-[#f4f6f6]"
        onClick={() => setIsConfirming(true)}
      >
        <Trash2 size={16} aria-hidden="true" />
        삭제
      </button>

      {isConfirming && (
        <ConfirmModal
          title="이 대화를 삭제할까요? 삭제하면 복구할 수 없어요"
          confirmLabel="삭제"
          errorMessage={
            deleteConversation.isError
              ? '삭제하지 못했어요. 잠시 뒤 다시 시도해 주세요'
              : undefined
          }
          isPending={deleteConversation.isPending}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </header>
  );
}
