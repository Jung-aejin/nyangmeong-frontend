import { ChevronLeft, ChevronRight } from 'lucide-react';

const VISIBLE_PAGE_COUNT = 5;
const ITEM =
  'grid h-9 min-w-9 place-items-center rounded-full px-2 font-medium text-ink-2 hover:enabled:bg-surface-3 disabled:cursor-not-allowed disabled:text-line-strong';

export default function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null;

  /** 현재 페이지 중심의 표시 범위 */
  const start = Math.max(
    1,
    Math.min(
      page - Math.floor(VISIBLE_PAGE_COUNT / 2),
      pageCount - VISIBLE_PAGE_COUNT + 1,
    ),
  );
  const end = Math.min(pageCount, start + VISIBLE_PAGE_COUNT - 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  /** 쪽 이동 + 화면 맨 위로 */
  const selectPage = (number) => {
    onChange(number);
    window.scrollTo(0, 0);
  };

  return (
    <nav aria-label="페이지" className="flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => selectPage(page - 1)}
        disabled={page === 1}
        aria-label="이전 페이지"
        className={ITEM}
      >
        <ChevronLeft className="size-4" />
      </button>
      {pages.map((number) => (
        <button
          key={number}
          type="button"
          onClick={() => selectPage(number)}
          aria-current={number === page ? 'page' : undefined}
          className={`${ITEM} ${number === page ? 'bg-brand-500 font-bold text-white hover:enabled:bg-brand-500' : ''}`}
        >
          {number}
        </button>
      ))}
      <button
        type="button"
        onClick={() => selectPage(page + 1)}
        disabled={page === pageCount}
        aria-label="다음 페이지"
        className={ITEM}
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
