import { Search } from 'lucide-react';
import { useState } from 'react';
import { generatePath, Link } from 'react-router-dom';
import Pagination from '@/components/Pagination';
import { PATHS } from '@/routes/paths';
import { formatDate } from '@/utils/formatDate';

export default function NoticeList({
  notices,
  keyword,
  onSearch,
  onPageChange,
}) {
  const [input, setInput] = useState(keyword);
  const { content, page, totalElements, totalPages } = notices;

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(input.trim());
  };

  const handleReset = () => {
    setInput('');
    onSearch('');
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-base leading-[1.6] text-[#566465]">
          전체 <b className="font-bold text-[#1a3234]">{totalElements}</b> 건
        </p>
        <form onSubmit={handleSubmit} className="relative w-[300px]">
          <input
            type="search"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="제목 또는 내용 검색"
            aria-label="제목 또는 내용 검색"
            className="h-10 w-full rounded-md border border-[#d3dae2] bg-white pr-10 pl-[15px] text-base placeholder:text-[#8c9899]"
          />
          <button
            type="submit"
            aria-label="검색"
            className="absolute top-[9px] right-[9px] text-[#566465]"
          >
            <Search size={20} />
          </button>
        </form>
      </div>

      {content.length === 0 ? (
        <div className="rounded-[14px] border border-[#e2e7e7] bg-white px-6 py-14 text-center text-[#566465]">
          <p>{keyword ? '검색한 공지가 없어요' : '등록된 공지가 없어요'}</p>
          {keyword && (
            <button
              type="button"
              onClick={handleReset}
              className="mt-4 rounded-lg border border-[#285a5c] px-5 py-2 text-sm font-medium text-[#285a5c]"
            >
              전체 공지 보기
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[14px] border border-[#e2e7e7] bg-white">
          <div className="flex h-12 items-center border-b border-[#e2e7e7] bg-[#f4f6f6] text-sm font-medium text-[#566465]">
            <span className="w-[104px] shrink-0 pl-4 text-center">번호</span>
            <span className="flex-1">제목</span>
            <span className="w-[100px] shrink-0 text-center">작성일</span>
            <span className="w-9 shrink-0" />
          </div>
          <ul className="divide-y divide-[#e2e7e7]">
            {content.map((notice) => (
              <li key={notice.ntcMttrSn} className="h-16">
                <Link
                  to={generatePath(PATHS.NOTICE_DETAIL, {
                    ntcMttrSn: notice.ntcMttrSn,
                  })}
                  className={`flex h-full items-center hover:bg-[#f1f7f7] ${notice.fixYn ? 'bg-[#e9f2f2] hover:bg-[#e9f2f2]' : ''}`}
                >
                  <span className="flex w-[104px] shrink-0 justify-center pl-4 text-sm text-[#667374]">
                    {notice.fixYn ? (
                      <span className="flex h-6 w-[42px] items-center justify-center rounded-xl bg-[#285a5c] text-[13px] leading-none font-medium text-white">
                        공지
                      </span>
                    ) : (
                      notice.ntcMttrSn
                    )}
                  </span>
                  <span className="flex-1 truncate text-base leading-normal font-medium text-[#1a3234]">
                    {notice.ntcMttrTtl}
                  </span>
                  <span className="w-[100px] shrink-0 text-center text-sm text-[#667374]">
                    {formatDate(notice.crtDt)}
                  </span>
                  <span className="w-9 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-12">
        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={onPageChange}
        />
      </div>
    </div>
  );
}
