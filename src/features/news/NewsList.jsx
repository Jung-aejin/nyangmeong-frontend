import { Megaphone, Newspaper, SearchX } from 'lucide-react';
import { useState } from 'react';
import { generatePath, Link, useLocation } from 'react-router-dom';
import BoardPagination from '@/components/BoardPagination';
import EmptyResult from '@/components/EmptyResult';
import SearchInput from '@/components/SearchInput';
import { PATHS } from '@/routes/paths';
import { formatDate } from '@/utils/formatDate';
import NewsCategoryBadge from './NewsCategoryBadge';
import NewsThumb from './NewsThumb';
import { NEWS_CATEGORIES, NEWS_SRC_ADMIN } from './newsCodes';

export default function NewsList({
  news,
  category,
  keyword,
  onCategoryChange,
  onSearch,
  onPageChange,
  onReset,
}) {
  const [input, setInput] = useState(keyword);
  const { search } = useLocation();
  const { content, page, totalPages } = news;

  const tabClass = (selected) =>
    `h-14 shrink-0 cursor-pointer px-4 text-base leading-none whitespace-nowrap max-[760px]:h-12 ${selected ? 'border-b-2 border-[#285a5c] font-bold text-[#1a3234]' : 'font-medium text-[#566465] hover:text-[#1a3234]'}`;

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-end justify-between gap-3 border-b border-[#d3dae2] max-[760px]:flex-col max-[760px]:items-stretch">
        <div
          role="tablist"
          aria-label="뉴스 카테고리"
          className="flex overflow-x-auto"
        >
          <button
            type="button"
            role="tab"
            aria-selected={!category}
            onClick={() => onCategoryChange('')}
            className={tabClass(!category)}
          >
            전체
          </button>
          {NEWS_CATEGORIES.map((item) => (
            <button
              key={item.code}
              type="button"
              role="tab"
              aria-selected={category === item.name}
              onClick={() =>
                onCategoryChange(category === item.name ? '' : item.name)
              }
              className={tabClass(category === item.name)}
            >
              {item.name}
            </button>
          ))}
        </div>
        <SearchInput
          value={input}
          onChange={setInput}
          onSubmit={() => onSearch(input.trim())}
          placeholder="제목 또는 내용 검색"
          className="mb-3 w-[300px] max-[760px]:w-full"
        />
      </div>

      {content.length === 0 ? (
        <EmptyResult
          icon={<SearchX size={32} />}
          title="해당하는 뉴스가 없어요"
          description="다른 카테고리를 고르거나 검색어를 바꿔 보세요"
        >
          <button
            type="button"
            onClick={() => {
              setInput('');
              onReset();
            }}
            className="h-9 cursor-pointer rounded-md border border-[#d3dae2] bg-white px-4 text-sm font-medium text-[#3d4a4b] hover:bg-[#f4f6f6]"
          >
            전체 뉴스 보기
          </button>
        </EmptyResult>
      ) : (
        <ul className="divide-y divide-[#e2e7e7] border-b border-[#e2e7e7]">
          {content.map((item) => {
            const isAdmin = item.newsSrcCd === NEWS_SRC_ADMIN;
            return (
              <li key={item.newsSn}>
                <Link
                  to={generatePath(PATHS.COMMUNITY_NEWS_DETAIL, {
                    newsSn: item.newsSn,
                  })}
                  state={{ listSearch: search }}
                  className={`group grid gap-x-8 gap-y-3.5 py-6 max-[760px]:gap-x-4 max-[760px]:py-5 ${isAdmin ? 'grid-cols-1' : 'grid-cols-[minmax(0,1fr)_200px] max-[760px]:grid-cols-[minmax(0,1fr)_96px]'}`}
                >
                  <div className="min-w-0">
                    <NewsCategoryBadge news={item} />
                    <h3 className="mt-2.5 truncate text-lg leading-[1.4] font-semibold tracking-[-0.18px] text-[#1a3234] group-hover:text-[#285a5c]">
                      {item.newsTtl}
                    </h3>
                    <p className="mt-3.5 line-clamp-2 text-base leading-[1.6] text-[#3d4a4b] max-[760px]:mt-2 max-[760px]:text-sm">
                      {item.newsCn}
                    </p>
                  </div>
                  {!isAdmin && (
                    <NewsThumb
                      src={item.thmbUrlPath}
                      iconSize={40}
                      className="w-[200px] self-start max-[760px]:w-24"
                    />
                  )}
                  <div className="col-span-full flex items-center gap-1.5 text-sm text-[#667374]">
                    {isAdmin ? (
                      <Megaphone size={16} />
                    ) : (
                      <Newspaper size={16} />
                    )}
                    {item.srcPressNm}
                    <i className="text-[#b9c4c4] not-italic">·</i>
                    <time>{formatDate(item.pblcnDt)}</time>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-12 max-[760px]:mt-8">
        <BoardPagination
          page={page}
          totalPages={totalPages}
          onChange={onPageChange}
        />
      </div>
    </div>
  );
}
