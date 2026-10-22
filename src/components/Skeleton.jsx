/**
 * [로딩 막대]
 * - lines 없으면 막대 하나: 크기·모양은 className
 * - lines 있으면 여러 줄: 마지막 줄은 짧게
 */
export default function Skeleton({ className = '', lines }) {
  if (!lines) {
    /** className에 둥글림이 있으면 기본 둥글림 생략 */
    const rounded = className.includes('rounded') ? '' : 'rounded-md';
    return (
      <div
        aria-hidden="true"
        className={`animate-pulse bg-[#e9eded] ${rounded} ${className}`}
      />
    );
  }

  return (
    <div aria-hidden="true" className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }, (_, index) => (
        <div
          key={index}
          className={`h-4 animate-pulse rounded-md bg-[#e9eded] ${index === lines - 1 && lines > 1 ? 'w-3/5' : 'w-full'}`}
        />
      ))}
    </div>
  );
}
