import { Bot } from 'lucide-react';

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col items-center gap-3">
      <button
        type="button"
        className="flex h-[68px] w-[68px] items-center justify-center rounded-2xl border border-dashed border-[#285a5c] bg-white text-[#285a5c]"
        aria-label="AI"
      >
        <Bot size={32} />
      </button>
      <button
        type="button"
        className="h-[52px] w-[52px] rounded-2xl border border-[#e2e7e7] bg-white text-base font-bold text-[#3d4a4b]"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        TOP
      </button>
    </div>
  );
}
