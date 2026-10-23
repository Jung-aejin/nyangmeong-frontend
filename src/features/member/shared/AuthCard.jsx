import { ChevronLeft } from 'lucide-react';

export default function AuthCard({ onBack, children }) {
  return (
    <section className="relative w-full">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로가기"
          className="-ml-2 mb-1 grid size-9 place-items-center rounded-full text-ink-2 hover:bg-surface-2"
        >
          <ChevronLeft className="size-6" />
        </button>
      )}
      {children}
    </section>
  );
}
