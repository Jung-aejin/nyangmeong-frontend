import { Link, useParams } from 'react-router-dom';
import NewsDetail from '@/features/news/NewsDetail';
import { useNews } from '@/features/news/queries';
import SubPageLayout from '@/layouts/SubPageLayout';
import { PATHS } from '@/routes/paths';

const DESCRIPTION = '반려생활에 도움이 되는 소식을 언론사에서 모아 전해 드려요';

export default function NewsDetailPage() {
  const newsSn = Number(useParams().newsSn);
  const { data: news, isPending, isError } = useNews(newsSn);

  let body;
  if (isPending) {
    body = <p className="text-[#566465]">불러오는 중이에요</p>;
  } else if (isError) {
    body = (
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
  } else {
    body = <NewsDetail news={news} />;
  }

  /** 상세 제목은 '상세보기'가 아니라 메뉴 이름이라 title을 넘기지 않는다. 「목록으로」는 본문 하단 */
  return (
    <SubPageLayout
      section="community"
      menu={PATHS.COMMUNITY_NEWS}
      back={false}
      description={DESCRIPTION}
    >
      {body}
    </SubPageLayout>
  );
}
