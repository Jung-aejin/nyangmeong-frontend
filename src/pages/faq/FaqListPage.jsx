import { useSearchParams } from 'react-router-dom';
import FaqList from '@/features/faq/FaqList';
import { useFaqs } from '@/features/faq/queries';

const PAGE_SIZE = 10;

export default function FaqListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const category = searchParams.get('category') ?? '';
  const keyword = searchParams.get('keyword') ?? '';
  const {
    data: faqs,
    isPending,
    isError,
  } = useFaqs({ page, size: PAGE_SIZE, category, keyword });

  /** 분류·검색어가 바뀌면 첫 쪽부터 */
  const handleFilterChange = (nextKeyword, nextCategory) =>
    setSearchParams({
      ...(nextCategory && { category: nextCategory }),
      ...(nextKeyword && { keyword: nextKeyword }),
    });

  const handlePageChange = (nextPage) =>
    setSearchParams({
      ...(category && { category }),
      ...(keyword && { keyword }),
      page: nextPage,
    });

  if (isPending) return <p className="text-[#566465]">불러오는 중이에요</p>;
  if (isError) {
    return (
      <p role="alert" className="text-[#566465]">
        질문을 불러오지 못했어요. 잠시 뒤 다시 시도해 주세요
      </p>
    );
  }

  return (
    <FaqList
      key={`${category}|${keyword}`}
      faqs={faqs}
      category={category}
      keyword={keyword}
      onCategoryChange={(nextCategory) =>
        handleFilterChange(keyword, nextCategory)
      }
      onSearch={handleFilterChange}
      onPageChange={handlePageChange}
    />
  );
}
