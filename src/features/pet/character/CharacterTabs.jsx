const TABS = [
  { key: 'own', nm: '내 캐릭터' },
  { key: 'shared', nm: '공동양육' },
];

/**
 * [내 캐릭터 · 공동양육 탭]
 * - 공동양육 동물이 없으면 호출하는 쪽에서 이 탭을 그리지 않는다 (FN-MYP-010-01)
 */
export default function CharacterTabs({ selectedKey, sharedCount, onSelect }) {
  return (
    <div
      role="tablist"
      aria-label="캐릭터 구분"
      className="flex gap-1 overflow-x-auto shadow-[inset_0_-1px_0_var(--color-line)] [scrollbar-width:none]"
    >
      {TABS.map((tab) => {
        const isSelected = tab.key === selectedKey;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelect(tab.key)}
            className={`relative inline-flex h-12 shrink-0 items-center gap-1.5 px-4 text-lg/[1.6] whitespace-nowrap ${
              isSelected
                ? 'font-bold text-[#2f6f57] after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-sm after:bg-[#2f6f57]'
                : 'font-semibold text-muted hover:text-ink'
            }`}
          >
            {tab.nm}
            {tab.key === 'shared' && (
              <span className="font-semibold text-subtle tabular-nums">
                ({sharedCount})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
