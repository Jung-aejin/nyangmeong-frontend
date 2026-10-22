import { isFound } from '../missingCodes';

const BADGE_CLASS =
  'inline-flex h-6 items-center rounded-full px-2.5 pt-[1.5px] text-[13px] leading-none font-semibold whitespace-nowrap';

/** 실종(빨강) · 찾았어요(초록) 상태 배지 */
export default function MissingStatusBadge({ post, className = '' }) {
  const found = isFound(post);
  return (
    <span
      className={`${BADGE_CLASS} ${found ? 'bg-tone-green-bg text-tone-green-fg' : 'bg-tone-rose-bg text-tone-rose-fg'} ${className}`}
    >
      {found ? '찾았어요' : '실종'}
    </span>
  );
}
