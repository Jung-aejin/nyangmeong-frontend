import { ChevronLeft } from 'lucide-react';

// 로그인·비밀번호 찾기 화면의 카드 틀. onBack이 있으면 왼쪽 위에 뒤로가기 버튼을 둔다
export default function AuthCard({ onBack, children }) {
  return (
    <section className="relative w-full max-w-[440px]">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로가기"
          className="absolute top-0 -left-2 z-[1] grid size-10 place-items-center rounded-full text-ink-2 hover:bg-surface-2"
        >
          <ChevronLeft className="size-6" />
        </button>
      )}
      {children}
    </section>
  );
}
