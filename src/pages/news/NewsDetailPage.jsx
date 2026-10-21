import { Link, useParams } from 'react-router-dom';
import NewsDetail from '@/features/news/NewsDetail';
import { useNews } from '@/features/news/queries';
import { PATHS } from '@/routes/paths';

export default function NewsDetailPage() {
  const newsSn = Number(useParams().newsSn);
  const { data: news, isPending, isError } = useNews(newsSn);

  if (isPending) return <p className="text-[#566465]">불러오는 중이에요</p>;
  if (isError) {
    return (
      <div role="alert" className="flex flex-col items-start gap-3">
        <p className="text-[#566465]">뉴스를 찾지 못했어요</p>
        <Link
          to={PATHS.COMMUNITY_NEWS}
          className="text-base font-medium text-[#285a5c] hover:underline"
        >
          펫뉴스 목록으로
        </Link>
      </div>
    );
  }

  return <NewsDetail news={news} />;
}
