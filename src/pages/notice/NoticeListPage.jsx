import { useSearchParams } from 'react-router-dom';
import NoticeList from '@/features/notice/NoticeList';
import { useNotices } from '@/features/notice/queries';

const PAGE_SIZE = 10;

export default function NoticeListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const keyword = searchParams.get('keyword') ?? '';
  const {
    data: notices,
    isPending,
    isError,
  } = useNotices({ page, size: PAGE_SIZE, keyword });

  // 검색어를 바꾸면 첫 페이지부터 본다
  const handleSearch = (nextKeyword) =>
    setSearchParams(nextKeyword ? { keyword: nextKeyword } : {});

  const handlePageChange = (nextPage) =>
    setSearchParams({ ...(keyword && { keyword }), page: nextPage });

  if (isPending) return <p className="text-[#566465]">불러오는 중이에요</p>;
  if (isError) {
    return (
      <p role="alert" className="text-[#566465]">
        공지를 불러오지 못했어요. 잠시 뒤 다시 시도해 주세요
      </p>
    );
  }

  return (
    <NoticeList
      key={keyword}
      notices={notices}
      keyword={keyword}
      onSearch={handleSearch}
      onPageChange={handlePageChange}
    />
  );
}
