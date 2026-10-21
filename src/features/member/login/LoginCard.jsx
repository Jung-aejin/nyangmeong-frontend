import { ChevronLeft } from 'lucide-react';

export default function LoginCard({ onBack, children }) {
  return (
    <section className="relative w-full max-w-[440px]">
      <button
        type="button"
        onClick={onBack}
        aria-label="뒤로가기"
        className="absolute top-0 -left-2 z-[1] grid size-10 place-items-center rounded-full text-ink-2 hover:bg-surface-2"
      >
        <ChevronLeft className="size-6" />
      </button>
      {children}
    </section>
  );
}
