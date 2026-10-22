/**
 * [채팅 입력]
 * - 텍스트 전송, [사진]·[주소 공유]는 SCR-CMU-005에서 연결 (FN-COM-009-19)
 */
import { useState } from 'react';
import { ArrowUp, Image, MapPin } from 'lucide-react';
import { MSG_TYPE } from '../api';
import { useSendChatMessage } from '../queries';

const iconButton =
  'flex size-11 shrink-0 items-center justify-center rounded-full text-[#566465] disabled:cursor-not-allowed disabled:text-[#b9c4c4]';

export default function ChatMessageInput({ otoChatRoomSn }) {
  const [msgCn, setMsgCn] = useState('');
  const sendMessage = useSendChatMessage(otoChatRoomSn);
  const canSend = msgCn.trim() !== '' && !sendMessage.isPending;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSend) return;
    sendMessage.mutate(
      {
        msgTypeCd: MSG_TYPE.TEXT,
        msgCn: msgCn.trim(),
        idmptDmndId: crypto.randomUUID(),
      },
      { onSuccess: () => setMsgCn('') },
    );
  };

  return (
    <form
      className="flex shrink-0 items-center gap-1 border-t border-[#e2e7e7] px-3 py-2.5"
      onSubmit={handleSubmit}
    >
      <button type="button" aria-label="사진" className={iconButton} disabled>
        <Image size={20} />
      </button>
      <button
        type="button"
        aria-label="주소 공유"
        className={iconButton}
        disabled
      >
        <MapPin size={20} />
      </button>
      <div className="flex h-11 min-w-0 flex-1 items-center rounded-full border border-[#d3dae2] bg-white pl-4 pr-0.5 focus-within:border-[#285a5c]">
        <input
          type="text"
          aria-label="메시지"
          placeholder="메시지를 입력하세요"
          className="min-w-0 flex-1 bg-transparent text-[#1a3234] outline-none placeholder:text-[#8c9899]"
          value={msgCn}
          onChange={(event) => setMsgCn(event.target.value)}
        />
        <button
          type="submit"
          aria-label="전송"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#285a5c] text-white disabled:bg-[#ebf0f0] disabled:text-[#8c9899]"
          disabled={!canSend}
        >
          <ArrowUp size={20} />
        </button>
      </div>
    </form>
  );
}
