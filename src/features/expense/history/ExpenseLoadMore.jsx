import { RefreshCw } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { LOAD } from '../shared/expenseCodes';

/**
 * [앱 무한 스크롤 하단 상태] 불러오는 중 / 모두 불러옴 / 실패 + ↻ 중 하나
 * 이 줄이 화면에 보이면 onLoadMore로 다음 20건을 부른다(실패하면 ↻로 다시)
 */
export default function ExpenseLoadMore({
  isEnd,
  status,
  onLoadMore,
  onRetry,
}) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (isEnd || status !== LOAD.IDLE) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore();
      },
      { rootMargin: '120px' },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isEnd, status, onLoadMore]);

  return (
    <p
      ref={sentinelRef}
      aria-live="polite"
      className="flex min-h-9 items-center justify-center gap-2 text-sm text-subtle min-[761px]:hidden"
    >
      {isEnd ? (
        '이번 달 내역을 모두 불러왔어요'
      ) : status === LOAD.ERROR ? (
        <>
          불러오지 못했어요
          <button
            type="button"
            onClick={onRetry}
            aria-label="다시 불러오기"
            className="grid size-8 place-items-center rounded-full border border-line bg-white text-ink"
          >
            <RefreshCw className="size-4" aria-hidden="true" />
          </button>
        </>
      ) : (
        <>
          <span
            aria-hidden="true"
            className="size-4 animate-spin rounded-full border-2 border-line border-t-brand-600"
          />
          불러오는 중
        </>
      )}
    </p>
  );
}
