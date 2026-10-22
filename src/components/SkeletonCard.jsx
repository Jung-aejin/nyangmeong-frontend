import Skeleton from './Skeleton';

/** 카드 한 장 로딩 자리: 제목 막대 + 본문 블록 (높이·칸은 className) */
export default function SkeletonCard({ className = 'h-64' }) {
  return (
    <div
      aria-hidden="true"
      className={`flex flex-col gap-5 rounded-[14px] border border-[#e2e7e7] bg-white p-6 ${className}`}
    >
      <Skeleton className="h-5 w-32" />
      <Skeleton className="min-h-0 flex-1" />
    </div>
  );
}
