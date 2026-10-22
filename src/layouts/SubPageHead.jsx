import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * [페이지 머리]
 * - 경로(얇게·링크) › 현재 페이지(굵게) · 설명 · 픽셀 그림(디자인 COM-5)
 * - 761~1100px 목록 화면은 제목 옆 ▾로 같은 섹션 메뉴 전환(COM-6), 760px 이하는 바텀 네비가 맡음
 */
export default function SubPageHead({
  section,
  activeItem,
  title,
  description,
  pixel,
  hasSwitch,
  onLeave,
}) {
  const isDeep = Boolean(title && activeItem);
  const heading = title ?? activeItem?.label;

  return (
    <header className="relative mb-6 max-[1101px]:mb-5 min-[1101px]:col-span-full">
      <div className="relative flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[28px] leading-[1.3] tracking-[-0.02em] max-[761px]:gap-x-2.5 max-[761px]:gap-y-1 max-[761px]:text-2xl">
        <nav
          aria-label="현재 위치"
          className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-muted max-[761px]:contents"
        >
          <CrumbLink
            to={section.to}
            onLeave={onLeave}
            className="max-[761px]:basis-full max-[761px]:text-base max-[761px]:tracking-normal"
          >
            {section.label}
          </CrumbLink>
          <Chevron className="max-[761px]:hidden" />
          {isDeep && (
            <>
              <CrumbLink to={activeItem.to} onLeave={onLeave}>
                {activeItem.label}
              </CrumbLink>
              <Chevron />
            </>
          )}
        </nav>
        <h1 className="font-bold text-ink">{heading}</h1>
        {hasSwitch && <MenuSwitch section={section} activeItem={activeItem} />}
      </div>
      {/** 설명이 없어도 한 줄 높이를 비워 콘텐츠 시작 위치를 맞춤 */}
      <p
        aria-hidden={description ? undefined : 'true'}
        className={`mt-2 text-muted max-[761px]:mt-1.5 max-[761px]:text-sm ${description ? '' : 'invisible'}`}
      >
        {description || ' '}
      </p>
      {pixel && (
        <img
          src={pixel}
          alt=""
          width="160"
          height="100"
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-1 right-0 origin-bottom-right [image-rendering:pixelated] select-none max-[1101px]:scale-80 max-[761px]:hidden"
        />
      )}
    </header>
  );
}

/** 경로 링크: onLeave가 있으면 이동 대신 호출 */
function CrumbLink({ to, onLeave, className = '', children }) {
  const handleClick = (event) => {
    if (!onLeave) return;
    event.preventDefault();
    onLeave(to);
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={`transition-colors hover:text-ink hover:underline hover:decoration-2 hover:underline-offset-[6px] max-[761px]:hover:decoration-1 max-[761px]:hover:underline-offset-4 ${className}`}
    >
      {children}
    </Link>
  );
}

/** 경로 구분자 › */
function Chevron({ className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`-ml-[3px] size-[9px] rotate-45 border-t-2 border-r-2 border-line-strong max-[761px]:size-2 ${className}`}
    />
  );
}

/** 761~1100px 섹션 메뉴 전환 드롭다운 */
function MenuSwitch({ section, activeItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);
  const menuId = useId();

  useEffect(() => {
    if (!isOpen) return undefined;
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="contents">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={`${section.label} 메뉴 열기`}
        onClick={() => setIsOpen((open) => !open)}
        className="-ml-1 hidden size-8 flex-none cursor-pointer place-items-center rounded-full bg-brand-50 text-brand-600 transition-colors hover:bg-brand-100 aria-expanded:bg-brand-100 min-[761px]:max-[1101px]:inline-grid"
      >
        <span
          aria-hidden="true"
          className={`size-2 border-r-2 border-b-2 border-current transition-[rotate,margin] duration-200 ${isOpen ? 'mt-1 -rotate-[135deg]' : '-mt-1 rotate-45'}`}
        />
      </button>
      {isOpen && (
        <div
          id={menuId}
          role="dialog"
          aria-label={`${section.label} 메뉴`}
          className="absolute top-[calc(100%+8px)] left-0 z-60 w-[280px] rounded-[10px] border border-line bg-white p-2 tracking-normal shadow-depth-sm min-[1101px]:hidden max-[761px]:hidden"
        >
          <nav className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const isActive = item === activeItem;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setIsOpen(false)}
                  className={`flex min-h-12 items-center justify-between gap-3 rounded-[6px] px-3.5 text-base leading-[1.4] ${
                    isActive
                      ? 'bg-brand-50 font-bold text-brand-600'
                      : 'font-medium text-ink-2 hover:bg-surface-2 hover:text-ink'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="mr-1 -mt-[3px] h-[11px] w-1.5 flex-none rotate-45 border-r-2 border-b-2 border-current"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
