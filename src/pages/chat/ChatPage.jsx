/**
 * [채팅 창]
 * - 헤더 아이콘·게시글 [채팅하기]·알림이 여는 새 창 (SCR-COM-009)
 * - ?otoChatRoomSn= 선택 방, ?pstSn= 게시글 방 생성 후 그 방으로
 */
import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import ChatConversation from '@/features/chat/room/ChatConversation';
import ChatRoomList from '@/features/chat/room/ChatRoomList';
import { useChatRooms, useCreateChatRoom } from '@/features/chat/queries';
import { PATHS } from '@/routes/paths';

const toRoomSn = (value) => (value ? Number(value) : null);

/** window.closed 반영 대기: 닫히는 창을 메인으로 보내지 않게 */
const CLOSE_CHECK_DELAY = 100;

export default function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedRoomSn = toRoomSn(searchParams.get('otoChatRoomSn'));
  const pstSn = toRoomSn(searchParams.get('pstSn'));
  const { data: rooms } = useChatRooms(false);
  const { mutate: createChatRoom } = useCreateChatRoom();
  const selectedRoom = rooms?.find(
    (room) => room.otoChatRoomSn === selectedRoomSn,
  );

  /** StrictMode effect 이중 실행 방지 */
  const startedPstSn = useRef(null);
  useEffect(() => {
    if (pstSn === null || startedPstSn.current === pstSn) return;
    startedPstSn.current = pstSn;
    createChatRoom(
      { pstSn },
      {
        onSuccess: ({ otoChatRoomSn }) =>
          setSearchParams(
            { otoChatRoomSn: String(otoChatRoomSn) },
            {
              replace: true,
            },
          ),
      },
    );
  }, [pstSn, createChatRoom, setSearchParams]);

  const handleSelectRoom = (otoChatRoomSn) =>
    setSearchParams({ otoChatRoomSn: String(otoChatRoomSn) });

  /** 주소창 직접 진입처럼 스크립트가 열지 않은 창은 닫히지 않아 메인으로 */
  const handleClose = () => {
    window.close();
    setTimeout(() => {
      if (!window.closed) navigate(PATHS.MAIN);
    }, CLOSE_CHECK_DELAY);
  };

  return (
    <div className="flex h-dvh flex-col bg-white">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#e2e7e7] px-6">
        <h1 className="text-xl font-bold text-[#1a3234]">채팅</h1>
        <button
          type="button"
          aria-label="닫기"
          className="flex size-11 items-center justify-center rounded-full text-[#3d4a4b] hover:bg-[#f4f6f6]"
          onClick={handleClose}
        >
          <X size={22} />
        </button>
      </header>
      <div className="flex min-h-0 flex-1">
        <section
          aria-label="채팅 목록"
          className="w-[380px] shrink-0 border-r border-[#e2e7e7]"
        >
          <ChatRoomList
            selectedRoomSn={selectedRoomSn}
            onSelect={handleSelectRoom}
          />
        </section>
        <section aria-label="대화" className="min-w-0 flex-1">
          {selectedRoomSn === null ? (
            <p className="flex h-full items-center justify-center bg-[#faf8f5] text-[#667374]">
              {pstSn === null
                ? '채팅방을 선택하세요'
                : '채팅방을 여는 중이에요'}
            </p>
          ) : (
            <ChatConversation
              key={selectedRoomSn}
              otoChatRoomSn={selectedRoomSn}
              room={selectedRoom}
            />
          )}
        </section>
      </div>
    </div>
  );
}
