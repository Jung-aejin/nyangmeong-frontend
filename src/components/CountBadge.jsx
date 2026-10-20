/** 개수 배지(0은 숨김, 99 초과는 99+) */
export default function CountBadge({ count, className = '' }) {
  if (!count) return null;

  return (
    <span
      className={`flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#f44b21] px-1 text-xs font-bold text-white ${className}`}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
