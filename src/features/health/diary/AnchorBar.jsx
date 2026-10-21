import { useEffect, useState } from 'react';

/** 스크롤 위치를 기준으로 삼을 화면 높이 비율 */
const ACTIVE_LINE_RATIO = 0.3;

/**
 * [페이지 내 이동 앵커]
 * - items: [{ id, label }], 클릭하면 해당 영역으로 스크롤
 * - 스크롤 위치에 따라 현재 보고 있는 영역을 선택 상태로 표시
 */
export default function AnchorBar({ items }) {
  const [activeId, setActiveId] = useState(items[0].id);

  useEffect(() => {
    const updateActive = () => {
      const line = window.scrollY + window.innerHeight * ACTIVE_LINE_RATIO;
      let currentId = items[0].id;
      items.forEach((item) => {
        const element = document.getElementById(item.id);
        if (
          element &&
          element.getBoundingClientRect().top + window.scrollY <= line
        )
          currentId = item.id;
      });
      setActiveId(currentId);
    };
    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
    return () => window.removeEventListener('scroll', updateActive);
  }, [items]);

  const handleClick = (event, id) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActiveId(id);
  };

  return (
    <nav
      aria-label="페이지 내 이동"
      className="mt-2 flex flex-wrap gap-1 shadow-[inset_0_-1px_0_var(--color-line)]"
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={isActive ? 'location' : undefined}
            className={`relative inline-flex h-12 items-center px-4 text-lg/[1.6] ${
              isActive
                ? "font-bold text-[#2f6f57] after:absolute after:right-3 after:bottom-0 after:left-3 after:h-0.5 after:rounded-sm after:bg-[#2f6f57] after:content-['']"
                : 'font-semibold text-muted hover:text-ink'
            }`}
            onClick={(event) => handleClick(event, item.id)}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
