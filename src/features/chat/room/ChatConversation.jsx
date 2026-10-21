/**
 * [채팅 대화 영역]
 * - 텍스트 말풍선만, 사진·주소·거래 카드는 SCR-CMU-005 (FN-COM-009-20)
 * - 창이 보일 때 표시된 마지막 메시지까지 읽음 처리 (FN-COM-009-14·16)
 */
import { useEffect, useRef } from 'react';
import { useChatMessages, useReadChatRoom } from '../queries';
import ChatAvatar from './ChatAvatar';
import ChatMessageInput from './ChatMessageInput';

function MessageBubble({ message, ctptMbrNcnm }) {
  if (message.mine) {
    return (
      <li className="flex justify-end">
        <p className="max-w-[75%] whitespace-pre-wrap break-words rounded-2xl rounded-tr-sm bg-[#285a5c] px-3.5 py-2.5 text-white">
          {message.msgCn}
        </p>
      </li>
    );
  }

  return (
    <li className="flex gap-2">
      <ChatAvatar name={ctptMbrNcnm} size="sm" />
      <div className="flex min-w-0 flex-col items-start gap-1">
        <span className="text-sm text-[#667374]">{ctptMbrNcnm}</span>
        <p className="max-w-[75%] whitespace-pre-wrap break-words rounded-2xl rounded-tl-sm border border-[#e2e7e7] bg-white px-3.5 py-2.5 text-[#1a3234]">
          {message.msgCn}
        </p>
      </div>
    </li>
  );
}

/** room: 목록의 방 요약, 목록에 없는 방(참여자 아님 등)은 undefined */
export default function ChatConversation({ otoChatRoomSn, room }) {
  const ctptMbrNcnm = room?.ctptMbrNcnm;
  const {
    data: messages,
    isPending,
    isError,
    error,
    refetch,
  } = useChatMessages(otoChatRoomSn);
  const { mutate: readChatRoom } = useReadChatRoom();
  const listRef = useRef(null);
  const lastMsgSeq = messages?.at(-1)?.msgSeq;

  /** 마지막 메시지가 보이도록 맨 아래로 */
  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages]);

  /** 창이 보일 때만 읽음 처리: 다른 탭에 가려진 동안 도착한 메시지 제외 */
  useEffect(() => {
    if (lastMsgSeq === undefined) return undefined;
    const handleVisible = () => {
      if (document.visibilityState !== 'visible') return;
      readChatRoom({ otoChatRoomSn, lastPrslMsgSeq: lastMsgSeq });
    };
    handleVisible();
    document.addEventListener('visibilitychange', handleVisible);
    return () =>
      document.removeEventListener('visibilitychange', handleVisible);
  }, [otoChatRoomSn, lastMsgSeq, readChatRoom]);

  return (
    <div className="flex h-full flex-col">
      {room && (
        <header className="flex h-[60px] shrink-0 items-center gap-3 border-b border-[#e2e7e7] px-4">
          <ChatAvatar name={ctptMbrNcnm} />
          <div className="min-w-0">
            <p className="truncate font-bold text-[#1a3234]">{ctptMbrNcnm}</p>
            <p className="truncate text-sm text-[#667374]">{room.pstTtl}</p>
          </div>
        </header>
      )}

      <div
        ref={listRef}
        className="min-h-0 flex-1 overflow-y-auto bg-[#faf8f5] px-4 py-5"
      >
        {isPending && (
          <p className="py-10 text-center text-[#667374]">불러오는 중이에요</p>
        )}
        {isError && (
          <div className="flex flex-col items-center gap-3 py-10 text-center text-[#566465]">
            <p>{error.message}</p>
            <button
              type="button"
              className="h-10 rounded-lg border border-[#e2e7e7] bg-white px-4 text-sm hover:bg-[#f4f6f6]"
              onClick={() => refetch()}
            >
              다시 시도
            </button>
          </div>
        )}
        {messages?.length === 0 && (
          <p className="py-10 text-center text-[#667374]">
            첫 메시지를 보내 보세요
          </p>
        )}
        {messages?.length > 0 && (
          <ul className="flex flex-col gap-3">
            {messages.map((message) => (
              <MessageBubble
                key={message.chatMsgSn}
                message={message}
                ctptMbrNcnm={ctptMbrNcnm}
              />
            ))}
          </ul>
        )}
      </div>

      {!isError && <ChatMessageInput otoChatRoomSn={otoChatRoomSn} />}
    </div>
  );
}
