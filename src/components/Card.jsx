import { createElement, useId } from 'react';

// 제목 줄(제목·보조 글·오른쪽 동작) + 본문으로 이뤄진 카드. 퍼블리싱 시안의 .card와 같은 모양이다
export default function Card({
  as: headingTag = 'h2',
  title,
  sub,
  action,
  className = '',
  bodyClassName = '',
  children,
}) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className={`flex min-w-0 flex-col rounded-[14px] border border-[#e2e7e7] bg-white shadow-[0_1px_2px_rgba(26,50,52,0.04)] ${className}`}
    >
      <div className="flex min-w-0 items-center justify-between gap-3 border-b border-[#edf1f1] px-[18px] py-4 sm:px-[22px] sm:py-[18px]">
        {createElement(
          headingTag,
          {
            id: titleId,
            className:
              'flex min-w-0 flex-1 items-baseline gap-2 text-lg font-bold tracking-[-0.01em] text-[#1a3234]',
          },
          <span className="truncate">{title}</span>,
          sub && (
            <small className="text-sm font-normal text-[#566465]">{sub}</small>
          ),
        )}
        {action}
      </div>
      <div
        className={`flex-1 px-[18px] pt-4 pb-[18px] sm:px-[22px] sm:pt-5 sm:pb-[22px] ${bodyClassName}`}
      >
        {children}
      </div>
    </section>
  );
}
