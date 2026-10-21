/**
 * [채팅 창 확인용 DEV 화면]
 * - 게시글 [채팅하기](KSJ SCR-CMU-004) 전 FN-COM-009-02 확인
 */
import useChatWindow from '@/hooks/useChatWindow';

const buttonClass =
  'h-10 rounded-lg border border-[#e2e7e7] bg-white px-4 text-sm text-[#3d4a4b] hover:bg-[#f4f6f6]';

export default function ChatDevPage() {
  const openChatWindow = useChatWindow();

  return (
    <div className="flex flex-col items-start gap-3">
      <h1 className="text-xl font-bold text-[#1a3234]">채팅 창 확인</h1>
      <button
        type="button"
        className={buttonClass}
        onClick={() => openChatWindow({ pstSn: 101 })}
      >
        채팅하기 (기존 방 있는 게시글 101)
      </button>
      <button
        type="button"
        className={buttonClass}
        onClick={() => openChatWindow({ pstSn: 999 })}
      >
        채팅하기 (방 없는 게시글 999 → 새 방)
      </button>
      <button
        type="button"
        className={buttonClass}
        onClick={() => openChatWindow({ otoChatRoomSn: 3 })}
      >
        방 3으로 열기
      </button>
    </div>
  );
}
