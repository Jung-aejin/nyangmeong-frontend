/**
 * [채팅 창]
 * - 채팅 모달의 [새 창으로 띄우기]·AI 대화창이 여는 새 창 (SCR-COM-009, SCR-CMU-005)
 * - 본문은 모달과 같은 ChatPanes(왼쪽 목록 | 오른쪽 대화, 760px 이하 한 칸)
 * - ?otoChatRoomSn= 선택 방, ?pstSn= 게시글 방 생성 후 그 방으로, ?listPstSn= 그 글의 채팅만 보기
 */
import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from '@/components/Icon';
import ChatPanes from '@/features/chat/room/ChatPanes';
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

  return (
    <div className="flex h-dvh flex-col bg-white">
      <header className="flex h-16 shrink-0 items-center gap-1 border-b border-line pr-4 pl-6 max-[760px]:pl-5">
        <h1 className="flex-1 text-xl font-bold text-ink">채팅</h1>
        <button
          type="button"
          aria-label="창 닫기"
          title="창 닫기"
          className="grid size-11 place-items-center rounded-full text-ink-2 hover:bg-surface-3"
          onClick={handleClose}
        >
          <Icon name="close" className="text-2xl" />
        </button>
      </header>

      <ChatPanes
        otoChatRoomSn={selectedRoomSn}
        pstSn={pstSn}
        listPstSn={listPstSn}
        onSelect={handleSelectRoom}
        onBack={handleBack}
        onLeft={handleLeft}
        onClearPost={handleClearPost}
      />
    </div>
  );
}
