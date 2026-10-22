import { Pencil, SearchX } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import BoardPagination from '@/components/BoardPagination';
import { BTN_PRIMARY } from '@/components/buttonStyles';
import EmptyResult from '@/components/EmptyResult';
import SearchInput from '@/components/SearchInput';
import { PATHS } from '@/routes/paths';
import { STATUS_TABS } from '../missingCodes';
import MissingCard from './MissingCard';
import MissingFilters from './MissingFilters';

const tabClass = (selected) =>
  `h-14 shrink-0 cursor-pointer px-4 text-base leading-none whitespace-nowrap max-[760px]:h-12 ${selected ? 'border-b-2 border-brand-500 font-bold text-ink' : 'font-medium text-muted hover:text-ink'}`;

/**
 * 실종센터 목록: 상태 탭 · 검색 · 빠른 필터 · 건수 · 카드(한 줄 3개) · [실종 등록하기] · 페이지
 * - filters: { stts, region, dong, pet, period, keyword }, onChange(바뀐 값만), onReset, onPageChange
 */
export default function MissingList({
  posts,
  filters,
  onChange,
  onReset,
  onPageChange,
}) {
  const [input, setInput] = useState(filters.keyword);
  const { content, page, totalPages, totalElements } = posts;

  const handleReset = () => {
    setInput('');
    onReset();
  };

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-input-line max-[760px]:flex-col max-[760px]:items-stretch">
        <div role="tablist" aria-label="게시 상태" className="flex">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={filters.stts === tab.value}
              onClick={() => onChange({ stts: tab.value })}
              className={tabClass(filters.stts === tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <SearchInput
          value={input}
          onChange={setInput}
          onSubmit={() => onChange({ keyword: input.trim() })}
          placeholder="지역, 품종, 특징으로 검색"
          className="mb-3 w-[300px] max-[760px]:mb-2 max-[760px]:w-full"
        />
      </div>

      <MissingFilters
        filters={filters}
        onChange={onChange}
        onReset={handleReset}
      />

      <p aria-live="polite" className="text-sm text-muted">
        총 <b className="font-bold text-ink">{totalElements}</b>건
      </p>

      {content.length === 0 ? (
        <EmptyResult
          icon={<SearchX size={32} aria-hidden="true" />}
          title="조건에 맞는 게시글이 없어요"
          description="지역이나 기간을 넓혀서 다시 찾아보세요"
        >
          <button
            type="button"
            onClick={handleReset}
            className="h-9 cursor-pointer rounded-md border border-line bg-white px-3 text-sm font-medium text-ink hover:bg-surface-2"
          >
            필터 초기화
          </button>
        </EmptyResult>
      ) : (
        <ul className="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-2 max-[560px]:grid-cols-1">
          {content.map((item) => (
            <li key={item.lostTpofSn}>
              <MissingCard post={item} />
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-end">
        <Link
          to={PATHS.COMMUNITY_MISSING_NEW}
          className={`${BTN_PRIMARY} min-w-[120px]`}
        >
          <Pencil size={16} aria-hidden="true" />
          실종 등록하기
        </Link>
      </div>
      <BoardPagination
        page={page}
        totalPages={totalPages}
        onChange={onPageChange}
      />
    </div>
  );
}
