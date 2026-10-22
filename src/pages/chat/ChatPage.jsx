/**
 * [채팅 창]
 * - 헤더 아이콘·게시글 [채팅하기]·알림이 여는 새 창 (SCR-COM-009, SCR-CMU-005)
 * - 한 칸 화면: 목록 → 채팅방, 방 위 ‹로 목록 복귀
 * - ?otoChatRoomSn= 선택 방, ?pstSn= 게시글 방 생성 후 그 방으로, ?listPstSn= 그 글의 채팅만 보기
 */
import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from '@/components/Icon';
import ChatConversation from '@/features/chat/room/ChatConversation';
import ChatRoomList from '@/features/chat/room/ChatRoomList';
import { useCreateChatRoom } from '@/features/chat/queries';
import { PATHS } from '@/routes/paths';

const toNumber = (value) => (value ? Number(value) : null);

/** window.closed 반영 대기: 닫히는 창을 메인으로 보내지 않게 */
const CLOSE_CHECK_DELAY = 100;

export default function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedRoomSn = toNumber(searchParams.get('otoChatRoomSn'));
  const pstSn = toNumber(searchParams.get('pstSn'));
  const listPstSn = toNumber(searchParams.get('listPstSn'));
  const { mutate: createChatRoom } = useCreateChatRoom();

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
            { replace: true },
          ),
      },
    );
  }, [pstSn, createChatRoom, setSearchParams]);

  /** 글별 보기(listPstSn)는 방을 오가도 유지 */
  const makeParams = (otoChatRoomSn) => {
    const params = {};
    if (otoChatRoomSn !== null) params.otoChatRoomSn = String(otoChatRoomSn);
    if (listPstSn !== null) params.listPstSn = String(listPstSn);
    return params;
  };

  const handleSelectRoom = (otoChatRoomSn) =>
    setSearchParams(makeParams(otoChatRoomSn));

  const handleBack = () => setSearchParams(makeParams(null));

  /** 나간 방은 뒤로 가기로 돌아오지 않게 */
  const handleLeft = () => setSearchParams(makeParams(null), { replace: true });

  const handleClearPost = () => setSearchParams({});

  /** 주소창 직접 진입처럼 스크립트가 열지 않은 창은 닫히지 않아 메인으로 */
  const handleClose = () => {
    window.close();
    setTimeout(() => {
      if (!window.closed) navigate(PATHS.MAIN);
    }, CLOSE_CHECK_DELAY);
  };

  const isRoomOpen = selectedRoomSn !== null;

  return (
    <div className="bg-[#fdfcfb]">
      <div className="mx-auto flex h-dvh max-w-[760px] flex-col border-x border-line bg-white max-[760px]:border-x-0">
        {!isRoomOpen && (
          <header className="flex h-[60px] shrink-0 items-center gap-2 border-b border-line pr-4 pl-5">
            <h1 className="flex-1 text-lg font-bold text-ink">채팅</h1>
            <button
              type="button"
              aria-label="창 닫기"
              className="grid size-11 place-items-center rounded-full text-ink-2 hover:bg-surface-3"
              onClick={handleClose}
            >
              <Icon name="close" className="text-2xl" />
            </button>
          </header>
        )}

        <ChatRoomList
          isHidden={isRoomOpen}
          listPstSn={listPstSn}
          onClearPost={handleClearPost}
          onSelect={handleSelectRoom}
        />

        {isRoomOpen && (
          <ChatConversation
            key={selectedRoomSn}
            otoChatRoomSn={selectedRoomSn}
            onBack={handleBack}
            onLeft={handleLeft}
          />
        )}
        {!isRoomOpen && pstSn !== null && (
          <p
            role="status"
            className="absolute inset-0 grid place-items-center bg-white/80 text-subtle"
          >
            채팅방을 여는 중이에요
          </p>
        )}
      </div>
    </div>
  );
}
