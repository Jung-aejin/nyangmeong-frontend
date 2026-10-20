import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useChatModal } from '@/context/chatModal';
import ChatModalPlaceholder from './ChatModalPlaceholder';

/** 채팅 모달 겉틀 */
export default function ChatModal() {
  const { isOpen, close } = useChatModal();

  /** 모달 열림 중 본문 스크롤 잠금 */
  useEffect(() => {
    if (!isOpen) return undefined;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previousPaddingRight = root.style.paddingRight;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    root.style.overflow = 'hidden';
    root.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      root.style.overflow = previousOverflow;
      root.style.paddingRight = previousPaddingRight;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/** 헤더(z-30) 아래 배치: 모달 중에도 헤더 클릭 가능 */}
      <div className="fixed inset-0 z-20 bg-[#0f1723]/45" aria-hidden="true" />
      <div
        role="dialog"
        aria-label="채팅"
        className="fixed left-1/2 top-1/2 z-40 flex h-[780px] max-h-[calc(100vh-32px)] w-[1040px] max-w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[20px] bg-white shadow-lg"
      >
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#e2e7e7] px-6">
          <h2 className="text-xl font-bold text-[#1a3234]">채팅</h2>
          <button
            type="button"
            aria-label="닫기"
            className="flex h-11 w-11 items-center justify-center rounded-full text-[#3d4a4b] hover:bg-[#f4f6f6]"
            onClick={close}
          >
            <X size={22} />
          </button>
        </header>
        {/** 가짜 방(개발 환경 전용 확인용) */}
        {import.meta.env.DEV && <ChatModalPlaceholder />}
      </div>
    </>
  );
}
