import { useSearchParams } from 'react-router-dom';
import NewsList from '@/features/news/NewsList';
import { getCategoryCode } from '@/features/news/newsCodes';
import { useNewsList } from '@/features/news/queries';

const PAGE_SIZE = 10;

export default function NewsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const keyword = searchParams.get('keyword') ?? '';
  /** URL에는 카테고리 이름, 서버에는 코드로 보낸다. 모르는 이름은 전체 */
  const categoryName = searchParams.get('category') ?? '';
  const newsClsfCd = getCategoryCode(categoryName) ?? '';
  const category = newsClsfCd ? categoryName : '';
  const {
    data: news,
    isPending,
    isError,
  } = useNewsList({ page, size: PAGE_SIZE, newsClsfCd, keyword });

  const setQuery = (next) =>
    setSearchParams(
      Object.fromEntries(Object.entries(next).filter(([, value]) => value)),
    );

  /** 칩·검색어가 바뀌면 첫 쪽부터 */
  const handleCategoryChange = (nextCategory) =>
    setQuery({ category: nextCategory, keyword });

  const handleSearch = (nextKeyword) =>
    setQuery({ category, keyword: nextKeyword });

  const handlePageChange = (nextPage) =>
    setQuery({ category, keyword, page: nextPage > 1 ? nextPage : '' });

  if (isPending) return <p className="text-[#566465]">불러오는 중이에요</p>;
  if (isError) {
    return (
      <p role="alert" className="text-[#566465]">
        뉴스를 불러오지 못했어요. 잠시 뒤 다시 시도해 주세요
      </p>
    );
  }

  return (
    <NewsList
      key={keyword}
      news={news}
      category={category}
      keyword={keyword}
      onCategoryChange={handleCategoryChange}
      onSearch={handleSearch}
      onPageChange={handlePageChange}
      onReset={() => setSearchParams({})}
    />
  );
}
