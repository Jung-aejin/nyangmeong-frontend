const ITEMS = [
  ['성격과 주의사항', '낯가림, 입질 이력, 무서워하는 것을 미리 알려 주세요'],
  ['정확한 일정', '요일과 시간이 정해져 있으면 문의가 훨씬 빨리 와요'],
  [
    '준비물과 인계 방법',
    '목줄 · 배변봉투 같은 준비물과 만나는 방법을 적어 주세요',
  ],
  ['얼굴이 잘 보이는 사진', '첫 번째 사진이 목록 대표 사진이 돼요'],
];

/** 글쓰기·글수정 오른쪽 「이렇게 쓰면 매칭이 빨라요」 */
export default function CareWriteGuide() {
  return (
    <aside aria-label="글쓰기 안내" className="min-w-0 max-[1100px]:mt-6">
      <section aria-labelledby="care-guide-title">
        <h2
          id="care-guide-title"
          className="pb-2 text-lg leading-[1.4] font-bold text-ink"
        >
          이렇게 쓰면 매칭이 빨라요
        </h2>
        <ul>
          {ITEMS.map(([title, description]) => (
            <li
              key={title}
              className="flex flex-col gap-1 border-t border-line py-3.5 first:border-t-0 first:pt-1.5"
            >
              <b className="font-semibold text-ink">{title}</b>
              <p className="text-sm leading-[1.6] text-muted">{description}</p>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
