import { useEffect, useRef } from 'react';
import { Hospital, Star, Store } from 'lucide-react';
import { KIND, PLACES } from './placeData';

const URGENT_TAGS = ['응급', '24시'];

// letter가 없으면 상단 고정된 즐겨찾기 줄이다
export default function PlaceListItem({
  id,
  letter,
  isFavorite,
  isStarred,
  isOutside,
  isSelected,
  shouldScroll,
  onSelect,
  onToggleFavorite,
}) {
  const place = PLACES[id];
  const itemRef = useRef(null);
  const ThumbIcon = place.cat === 'hospital' ? Hospital : Store;

  // 지도 핀으로 고른 장소를 목록에서도 보이게 한다. 모바일은 바텀시트가 가려 건너뛴다
  useEffect(() => {
    if (shouldScroll && !window.matchMedia('(max-width: 767px)').matches) {
      itemRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [shouldScroll]);

  const handleKeyDown = (event) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(id);
    }
  };

  return (
    <li
      ref={itemRef}
      tabIndex={0}
      aria-label={`${place.name} — 지도에서 보기`}
      onClick={() => onSelect(id)}
      onKeyDown={handleKeyDown}
      className={`relative grid cursor-pointer grid-cols-[84px_minmax(0,1fr)] gap-4 border-b border-line-soft px-4 py-4 hover:bg-surface-2 md:px-5 lg:grid-cols-[88px_minmax(0,1fr)] ${
        isSelected
          ? 'bg-brand-50 shadow-[inset_3px_0_0_var(--color-brand-500)] hover:bg-brand-50'
          : ''
      }`}
    >
      <span
        aria-hidden="true"
        className="flex size-[84px] flex-col items-center justify-center gap-1 self-start rounded-xl bg-surface-2 text-line-strong lg:size-[88px]"
      >
        <ThumbIcon className="size-[30px]" />
        <small className="text-xs text-subtle">업체 사진</small>
      </span>
      <div className="min-w-0">
        <div className="flex items-center gap-2 pr-9">
          {letter && (
            <span
              aria-hidden="true"
              className="grid size-[22px] shrink-0 place-items-center rounded-full bg-brand-500 text-xs font-bold text-white"
            >
              {letter}
            </span>
          )}
          <h3 className="min-w-0 truncate text-lg font-bold leading-[1.35] text-ink">
            {place.name}
          </h3>
          <span className="shrink-0 text-sm text-subtle">
            {KIND[place.cat]}
          </span>
        </div>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted">
          <span className="font-semibold text-tone-green-fg">{place.open}</span>
          <i className="size-0.5 rounded-full bg-line-strong" />
          <span>{place.hours}</span>
          <i className="size-0.5 rounded-full bg-line-strong" />
          <span className="font-semibold text-ink">{place.d.toFixed(1)}km</span>
        </p>
        <p className="mt-1 truncate text-sm text-muted">{place.addr}</p>
        <div className="mt-2.5 flex flex-wrap gap-1">
          {place.tags.map((tag) => (
            <span
              key={tag}
              className={`inline-flex h-6 items-center rounded px-2 text-badge font-semibold ${
                URGENT_TAGS.includes(tag)
                  ? 'bg-danger-soft text-danger'
                  : 'bg-tone-gray-bg text-tone-gray-fg'
              }`}
            >
              {tag}
            </span>
          ))}
          {isFavorite && isOutside && (
            <span className="ml-1 inline-flex h-6 items-center rounded bg-[#fdf3d8] px-2 text-badge font-semibold text-[#8a5a00]">
              현재 지도 밖
            </span>
          )}
        </div>
      </div>
      <button
        type="button"
        aria-pressed={isStarred}
        aria-label={`${place.name} 즐겨찾기 ${isStarred ? '해제' : '추가'}`}
        onClick={(event) => {
          event.stopPropagation();
          onToggleFavorite(id);
        }}
        className={`absolute right-3 top-2 grid size-10 place-items-center rounded-full ${
          isStarred
            ? ''
            : 'text-placeholder hover:bg-surface-3 hover:text-muted'
        }`}
      >
        <span
          className={`grid size-7 place-items-center rounded-full ${
            isStarred ? 'bg-[#fbd85d] text-brand-500' : ''
          }`}
        >
          <Star className={`size-4 ${isStarred ? 'fill-current' : ''}`} />
        </span>
      </button>
    </li>
  );
}
