/**
 * [채팅 목록]
 * - 최신 메시지순, 안 읽음만 보기 (FN-COM-009-05~08)
 */
import { useState } from 'react';
import { Info } from 'lucide-react';
import CountBadge from '@/components/CountBadge';
import { formatDate } from '@/utils/formatDate';
import { useChatRooms } from '../queries';
import ChatAvatar from './ChatAvatar';

/** lastMsgDt 내림차순, 메시지 없는 방은 끝 */
const sortByLastMessage = (rooms) =>
  [...rooms].sort((a, b) =>
    (b.lastMsgDt ?? '').localeCompare(a.lastMsgDt ?? ''),
  );

function ChatRoomRow({ room, isSelected, onSelect }) {
  const hasUnread = room.unreadCnt > 0;

  return (
    <li>
      <button
        type="button"
        aria-current={isSelected ? 'true' : undefined}
        className={`flex w-full gap-3.5 border-b border-[#e2e7e7] px-5 py-5 text-left ${
          isSelected ? 'bg-[#e9f2f2]' : 'hover:bg-[#f4f6f6]'
        }`}
        onClick={() => onSelect(room.otoChatRoomSn)}
      >
        <ChatAvatar name={room.ctptMbrNcnm} size="lg" />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex items-center justify-between gap-2">
            <span className="truncate font-bold text-[#1a3234]">
              {room.ctptMbrNcnm}
            </span>
            {room.lastMsgDt && (
              <span className="shrink-0 text-sm text-[#8c9899]">
                {formatDate(room.lastMsgDt, { hasYear: false })}
              </span>
            )}
          </span>
          <span className="truncate text-sm text-[#667374]">{room.pstTtl}</span>
          <span className="flex items-center gap-2">
            <span
              className={`min-w-0 flex-1 truncate ${
                hasUnread ? 'font-bold text-[#1a3234]' : 'text-[#3d4a4b]'
              }`}
            >
              {room.lastMsgCn ?? '아직 메시지가 없어요'}
            </span>
            <CountBadge count={room.unreadCnt} className="shrink-0" />
          </span>
        </span>
      </button>
    </li>
  );
}

export default function ChatRoomList({ selectedRoomSn, onSelect }) {
  const [isUnreadOnly, setIsUnreadOnly] = useState(false);
  const {
    data: rooms,
    isPending,
    isError,
    error,
    refetch,
  } = useChatRooms(isUnreadOnly);

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-[#e2e7e7] pl-5 pr-3">
        <span className="relative flex h-full items-center font-bold text-[#2f6f57] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-[#2f6f57]">
          전체
        </span>
        <label className="flex h-11 cursor-pointer items-center gap-2 text-sm font-medium text-[#3d4a4b]">
          <input
            type="checkbox"
            className="size-5 accent-[#285a5c]"
            checked={isUnreadOnly}
            onChange={(event) => setIsUnreadOnly(event.target.checked)}
          />
          안 읽음만
        </label>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isPending && (
          <p className="px-5 py-10 text-center text-[#667374]">
            불러오는 중이에요
          </p>
        )}
        {isError && (
          <div className="flex flex-col items-center gap-3 px-5 py-10 text-center text-[#566465]">
            <p>{error.message}</p>
            <button
              type="button"
              className="h-10 rounded-lg border border-[#e2e7e7] px-4 text-sm hover:bg-[#f4f6f6]"
              onClick={() => refetch()}
            >
              다시 시도
            </button>
          </div>
        )}
        {rooms?.length === 0 && (
          <p className="px-5 py-10 text-center text-[#667374]">
            {isUnreadOnly ? '안 읽은 채팅이 없어요' : '아직 채팅이 없어요'}
          </p>
        )}
        {rooms?.length > 0 && (
          <ul>
            {sortByLastMessage(rooms).map((room) => (
              <ChatRoomRow
                key={room.otoChatRoomSn}
                room={room}
                isSelected={room.otoChatRoomSn === selectedRoomSn}
                onSelect={onSelect}
              />
            ))}
          </ul>
        )}
      </div>

      <p className="flex shrink-0 gap-2 border-t border-[#e2e7e7] px-5 py-3 text-sm text-[#667374]">
        <Info size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
        거래는 채팅방 위 카드에서 단계별로 진행해요. 냥멍케어는 결제를 대신하지
        않아요.
      </p>
    </div>
  );
}
