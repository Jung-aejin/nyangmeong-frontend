import Skeleton from './Skeleton';
import SkeletonCard from './SkeletonCard';

/**
 * [페이지 본문 로딩]
 * - top: 칩·탭 위에 놓을 카드(히어로 등), chips·tabs: 칩·탭 줄의 개수(0이면 없음)
 * - children: 카드 배치, 없으면 큰 카드 1장
 */
export default function PageSkeleton({ top, chips = 0, tabs = 0, children }) {
  return (
    <div aria-busy="true" className="flex flex-col gap-5">
      {top}
      {chips > 0 && (
        <div aria-hidden="true" className="flex flex-wrap gap-2">
          {Array.from({ length: chips }, (_, index) => (
            <Skeleton key={index} className="h-9 w-32 rounded-full" />
          ))}
        </div>
      )}
      {tabs > 0 && (
        <div
          aria-hidden="true"
          className="flex gap-8 border-b border-[#e2e7e7] px-4 pt-6 pb-4"
        >
          {Array.from({ length: tabs }, (_, index) => (
            <Skeleton key={index} className="h-5 w-20" />
          ))}
        </div>
      )}
      {children ?? <SkeletonCard className="h-[420px]" />}
    </div>
  );
}
