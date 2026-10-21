import { useState } from 'react';
import { Bot } from 'lucide-react';
import useAiWindow from '@/hooks/useAiWindow';

export default function FloatingButtons({ hasBottomNav = false }) {
  const openAiWindow = useAiWindow();
  const [blocked, setBlocked] = useState(false);

  const handleAiClick = () => {
    setBlocked(!openAiWindow());
  };

  return (
    /** 바텀 네비(60px)가 있으면 그 위로 올림 */
    <div
      className={`fixed bottom-6 right-6 z-30 flex flex-col items-center gap-3 ${
        hasBottomNav
          ? 'max-[760px]:bottom-[calc(76px+env(safe-area-inset-bottom))]'
          : ''
      }`}
    >
      <div className="relative">
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
        <button
          type="button"
          className="flex h-[68px] w-[68px] items-center justify-center rounded-2xl border border-dashed border-[#285a5c] bg-white text-[#285a5c] max-[760px]:h-[52px] max-[760px]:w-[52px]"
          aria-label="AI"
          onClick={handleAiClick}
        >
          <Bot size={32} className="max-[760px]:size-6" />
        </button>
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
