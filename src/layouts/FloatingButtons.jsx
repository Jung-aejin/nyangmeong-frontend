import { useState } from 'react';
import { Bot, ChevronLeft } from 'lucide-react';
import useAiDock from '@/hooks/useAiDock';
import useAiWindow from '@/hooks/useAiWindow';

export default function FloatingButtons({ hasBottomNav = false }) {
  const openAiWindow = useAiWindow();
  const [blocked, setBlocked] = useState(false);
  const dock = useAiDock();

  const handleAiClick = () => {
    if (!dock.consumeClick()) return;
    dock.closeBubble();
    setBlocked(!openAiWindow());
  };

  return (
    /** 바텀 네비(60px)가 있으면 그 위로 올림. 모바일에서 접히면 우측 가장자리에 붙임 */
    <div
      className={`fixed bottom-6 z-30 flex flex-col items-center gap-3 ${
        dock.folded ? 'right-0' : 'right-6'
      } ${
        hasBottomNav
          ? 'max-[760px]:bottom-[calc(76px+env(safe-area-inset-bottom))]'
          : ''
      }`}
    >
      <div className="relative">
        {dock.bubbleVisible && (
          <div
            role="status"
            className="absolute bottom-full right-0 mb-2 flex animate-bob flex-col items-end motion-reduce:animate-none"
          >
            <div className="whitespace-nowrap rounded-lg bg-brand-500 px-3 py-2 text-sm font-semibold text-white">
              AI 매니저예요
            </div>
            <div
              className={`-mt-1 size-2 rotate-45 bg-brand-500 ${
                dock.folded ? 'mr-2' : 'mr-[30px] max-[760px]:mr-[22px]'
              }`}
            />
          </div>
        )}
        {blocked && (
          <div
            role="alert"
            className="absolute right-full top-1/2 mr-3 flex w-64 max-w-[calc(100vw-7.5rem)] -translate-y-1/2 items-center gap-2 rounded-xl border border-[#e2e7e7] bg-white p-3 text-sm text-[#3d4a4b] shadow"
          >
            <span>팝업이 차단되어 AI 매니저를 열 수 없어요.</span>
            <button
              type="button"
              className="shrink-0 rounded-lg bg-[#285a5c] px-2 py-1 text-white"
              onClick={handleAiClick}
            >
              다시 열기
            </button>
          </div>
        )}
        {dock.folded ? (
          <button
            type="button"
            className="flex h-[52px] w-[22px] items-center justify-center rounded-l-xl bg-brand-500 text-white"
            aria-label="AI 매니저 펼치기"
            onClick={dock.expand}
          >
            <ChevronLeft size={18} />
          </button>
        ) : (
          <button
            type="button"
            className="flex h-[68px] w-[68px] touch-none items-center justify-center rounded-2xl bg-brand-500 text-white max-[760px]:h-[52px] max-[760px]:w-[52px]"
            style={{
              transform: `translateX(${dock.offset}px)`,
              transition: dock.dragging ? 'none' : 'transform 0.2s',
            }}
            aria-label="AI"
            onClick={handleAiClick}
            {...dock.dragHandlers}
          >
            <Bot size={32} className="max-[760px]:size-6" />
          </button>
        )}
      </div>
      <button
        type="button"
        className="h-[52px] w-[52px] rounded-2xl border border-[#e2e7e7] bg-white text-base font-bold text-[#3d4a4b] max-[760px]:hidden"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        TOP
      </button>
    </div>
  );
}
