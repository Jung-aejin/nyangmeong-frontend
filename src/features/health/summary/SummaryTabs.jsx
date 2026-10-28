import { useEffect, useRef } from 'react';

/**
 * [종합 건강기록 묶음 탭]
 * - items: [{ id, label }], 선택한 묶음만 화면에 보임. 모양은 건강 일지 앵커와 같음
 * - 탭 본문은 id가 같은 tabpanel 영역
 * - 줄바꿈하지 않고 넘치면 가로로 밀어 봄, 선택한 탭이 가려져 있으면 탭 줄만 가로로 스크롤 (모바일 추가 요청)
 */
export default function SummaryTabs({ items, activeId, onSelect }) {
  const listRef = useRef(null);

  useEffect(() => {
    const list = listRef.current;
    const tab = list?.querySelector('[aria-selected="true"]');
    if (!tab) return;
    const left =
      tab.getBoundingClientRect().left -
      list.getBoundingClientRect().left +
      list.scrollLeft;
    const right = left + tab.offsetWidth;
    if (left < list.scrollLeft) {
      list.scrollTo({ left, behavior: 'smooth' });
    } else if (right > list.scrollLeft + list.clientWidth) {
      list.scrollTo({ left: right - list.clientWidth, behavior: 'smooth' });
    }
  }, [activeId]);

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="종합 건강기록 묶음"
      className="mt-2 flex gap-1 overflow-x-auto shadow-[inset_0_-1px_0_var(--color-line)] [scrollbar-width:none]"
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            id={`${item.id}-tab`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={item.id}
            className={`relative inline-flex h-12 shrink-0 items-center px-4 text-lg/[1.6] whitespace-nowrap ${
              isActive
                ? "font-bold text-[#2f6f57] after:absolute after:right-3 after:bottom-0 after:left-3 after:h-0.5 after:rounded-sm after:bg-[#2f6f57] after:content-['']"
                : 'font-semibold text-muted hover:text-ink'
            }`}
            onClick={() => onSelect(item.id)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
