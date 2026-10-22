import { useSearchParams } from 'react-router-dom';
import PageSkeleton from '@/components/PageSkeleton';
import Skeleton from '@/components/Skeleton';
import SkeletonCard from '@/components/SkeletonCard';
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

  /** 검색어 변경 시 첫 쪽부터 */
  const handleSearch = (nextKeyword) =>
    setSearchParams(nextKeyword ? { keyword: nextKeyword } : {});

  const handlePageChange = (nextPage) =>
    setSearchParams({ ...(keyword && { keyword }), page: nextPage });

  if (isPending) {
    return (
      <PageSkeleton>
        <div
          aria-hidden="true"
          className="flex items-center justify-between gap-3 max-[760px]:flex-col max-[760px]:items-stretch"
        >
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-12 w-[300px] max-[760px]:w-full" />
        </div>
        <SkeletonCard className="h-[754px]" />
        <Skeleton className="mx-auto mt-7 h-9 w-64" />
      </PageSkeleton>
    );
  }
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
