import { ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_GROUP_SIZE = 10;

// 번호는 10개씩 묶어 보여 준다. ‹는 2쪽부터, ›는 마지막 쪽 전까지 한 쪽씩 옮긴다. page는 1부터 시작한다
export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages < 1) return null;

  const start = Math.floor((page - 1) / PAGE_GROUP_SIZE) * PAGE_GROUP_SIZE + 1;
  const end = Math.min(start + PAGE_GROUP_SIZE - 1, totalPages);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  const buttonClass =
    'flex size-9 items-center justify-center rounded-full text-base font-medium text-[#3d4a4b] hover:bg-[#e9f2f2] max-[760px]:size-8';

  return (
    <nav
      aria-label="페이지 이동"
      className="flex flex-wrap items-center justify-center gap-1 max-[760px]:gap-0.5"
    >
      {page > 1 && (
        <button
          type="button"
          aria-label="이전 페이지"
          onClick={() => onChange(page - 1)}
          className={`${buttonClass} mr-2`}
        >
          <ChevronLeft size={18} />
        </button>
      )}
      {pages.map((number) => (
        <button
          key={number}
          type="button"
          aria-current={number === page ? 'page' : undefined}
          onClick={() => onChange(number)}
          className={`${buttonClass} ${number === page ? 'bg-[#285a5c] font-bold text-white hover:bg-[#285a5c]' : ''}`}
        >
          {number}
        </button>
      ))}
      {page < totalPages && (
        <button
          type="button"
          aria-label="다음 페이지"
          onClick={() => onChange(page + 1)}
          className={`${buttonClass} ml-2`}
        >
          <ChevronRight size={18} />
        </button>
      )}
    </nav>
  );
}
