import { Bot, MapPinOff } from 'lucide-react';
import PlaceListItem from './PlaceListItem';
import PlaceSearchForm from './PlaceSearchForm';
import { SORT_OPTIONS, SUGGESTIONS } from './placeData';

// const AI_KEYWORDS = ['전주', '동물병원', '정형외과'];

const groupTitle =
  'flex items-baseline gap-1.5 px-4 pt-4 text-sm font-semibold text-ink-2 md:px-5';

export default function PlacePanel({
  category,
  search,
  sort,
  regionText,
  resultIds,
  favoriteIds,
  favorites,
  isOutside,
  isCollapsed,
  sheet,
  onSearch,
  onSortChange,
  onSelectPlace,
  onToggleFavorite,
}) {
  return (
    <section
      aria-label="장소 목록"
      style={{ '--sheet-y': `${sheet.sheetY}px` }}
      className={`relative z-[2] flex min-h-0 min-w-0 flex-col overflow-hidden border-r border-line bg-white max-md:absolute max-md:inset-x-0 max-md:bottom-0 max-md:z-[6] max-md:h-[calc(100%-56px)] max-md:translate-y-[calc(100%-var(--sheet-y))] max-md:rounded-t-[20px] max-md:border-0 max-md:shadow-[0_-6px_24px_rgba(26,50,52,0.14)] ${
        sheet.isDragging
          ? ''
          : 'max-md:transition-transform max-md:duration-300 max-md:ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none'
      } ${isCollapsed ? 'md:invisible' : ''}`}
    >
      <button
        type="button"
        aria-label="목록 크기 바꾸기"
        onPointerDown={(event) => sheet.startDrag(event, true)}
        onClick={sheet.handleHandleClick}
        className="flex w-full cursor-grab touch-none flex-col items-center gap-1.5 pb-1.5 pt-2.5 before:h-1 before:w-10 before:rounded-sm before:bg-line-strong before:content-[''] md:hidden"
      >
        <span className="text-sm text-subtle">
          {sheet.isFull ? '아래로 내려 지도 보기' : '위로 올려 목록 보기'}
        </span>
      </button>

      <div className="hidden flex-col gap-3 px-5 pb-4 pt-6 md:flex">
        <h1 className="text-2xl font-bold leading-[1.3] tracking-[-0.02em] text-ink">
          반려동물 플레이스
        </h1>
        <PlaceSearchForm id="place-q" q={search.q} onSearch={onSearch} />
        <div className="flex min-w-0 items-center gap-1.5 overflow-x-auto whitespace-nowrap text-sm text-subtle [scrollbar-width:none]">
          <span className="shrink-0">추천</span>
          {SUGGESTIONS[category].map((text, index) => (
            <span key={text} className="flex shrink-0 items-center gap-1.5">
              {index > 0 && <i className="not-italic text-line-strong">·</i>}
              <button
                type="button"
                onClick={() => onSearch(text)}
                className="py-0.5 font-medium text-brand-600 hover:underline hover:underline-offset-[3px]"
              >
                {text}
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex min-h-12 items-center justify-between gap-3 border-y border-line bg-surface-2 px-5 max-md:border-t-0 max-md:bg-white max-md:px-4 md:min-h-[52px]">
        <p
          onPointerDown={(event) => sheet.startDrag(event, false)}
          className="min-w-0 flex-1 touch-none truncate text-sm text-muted max-md:cursor-grab"
        >
          <b className="font-semibold text-ink">{regionText}</b> · 결과{' '}
          {resultIds.length}곳
        </p>
        <select
          aria-label="정렬"
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          className="h-9 w-[104px] shrink-0 rounded-md border border-input-line bg-white px-2 text-sm text-ink focus:ring-focus focus:outline-none"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {/* {search.isAi && (
          <div className="mx-4 mt-4 flex gap-3 rounded-xl bg-brand-50 p-4 md:mx-5">
            <Bot className="size-10 shrink-0 text-brand-500" />
            <div className="text-sm text-ink-2">
              <b className="block text-base text-ink">
                AI 매니저가 찾은 키워드
              </b>
              질문을 장소 검색어로 바꿔 찾았어요
              <div className="mt-2 flex flex-wrap gap-1.5">
                {AI_KEYWORDS.map((keyword) => (
                  <span
                    key={keyword}
                    className="inline-flex h-6 items-center rounded-full border border-line-strong bg-white px-2 text-badge font-semibold text-ink-2"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              <p className="mt-2">
                수술 실력이나 의학적 판단을 보증하지 않아요. 진료 전 병원에 꼭
                문의해 주세요.
              </p>
            </div>
          </div>
        )} */}

        {favoriteIds.length > 0 && (
          <section
            aria-labelledby="place-fav-title"
            className="border-b-8 border-surface-2"
          >
            <h2 id="place-fav-title" className={groupTitle}>
              내 즐겨찾기 <b className="text-brand-600">{favoriteIds.length}</b>
              <small className="ml-auto text-sm font-normal text-subtle">
                상단 고정
              </small>
            </h2>
            <ul>
              {favoriteIds.map((id) => (
                <PlaceListItem
                  key={id}
                  id={id}
                  isFavorite
                  isStarred={!!favorites[id]}
                  isOutside={isOutside(id)}
                  isSelected={search.selected === id}
                  shouldScroll={
                    search.selected === id && search.selectedBy === 'pin'
                  }
                  onSelect={onSelectPlace}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="place-result-title">
          <h2 id="place-result-title" className={groupTitle}>
            검색 결과 <b className="text-brand-600">{resultIds.length}</b>
            <small className="ml-auto text-sm font-normal text-subtle">
              “{search.q}”
            </small>
          </h2>
          {resultIds.length === 0 ? (
            <div className="flex flex-col items-center gap-2.5 px-6 py-12 text-center text-muted">
              <span className="grid size-16 place-items-center rounded-full bg-brand-50 text-brand-500">
                <MapPinOff className="size-8" />
              </span>
              <p className="text-lg font-bold text-ink">
                이 지도 영역에 검색 결과가 없어요
              </p>
              <p>지도를 옮기거나 검색어를 바꿔 보세요</p>
            </div>
          ) : (
            <>
              <ul>
                {resultIds.map((id, index) => (
                  <PlaceListItem
                    key={id}
                    id={id}
                    letter={String.fromCharCode(65 + index)}
                    isStarred={!!favorites[id]}
                    isSelected={search.selected === id}
                    shouldScroll={
                      search.selected === id && search.selectedBy === 'pin'
                    }
                    onSelect={onSelectPlace}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </ul>
              <p className="px-5 pb-10 pt-6 text-center text-sm text-subtle">
                마지막 검색 결과예요
              </p>
            </>
          )}
        </section>
      </div>
    </section>
  );
}
