import { Link, useParams } from 'react-router-dom';
import PostDetail from '@/features/community/PostDetail';
import { usePost } from '@/features/community/queries';
import SubPageLayout from '@/layouts/SubPageLayout';
import { PATHS } from '@/routes/paths';

const DESCRIPTION = '반려생활의 일상과 유용한 정보를 함께 나눠요';

export default function PostDetailPage() {
  const pstSn = Number(useParams().pstSn);
  const { data: post, isPending, isError } = usePost(pstSn);

  let body;
  if (isPending) {
    body = <p className="text-[#566465]">불러오는 중이에요</p>;
  } else if (isError) {
    body = (
      <div role="alert" className="flex flex-col items-start gap-3">
        <p className="text-[#566465]">게시글을 찾지 못했어요</p>
        <Link
          to={PATHS.COMMUNITY}
          className="text-base font-medium text-[#285a5c] hover:underline"
        >
          펫이야기 목록으로
        </Link>
      </div>
    );
  } else {
    body = <PostDetail post={post} />;
  }

  /** 상세 제목은 '상세보기'가 아니라 메뉴 이름이라 title을 넘기지 않는다. 「목록으로」는 본문 하단 */
  return (
    <SubPageLayout
      section="community"
      menu={PATHS.COMMUNITY}
      back={false}
      description={DESCRIPTION}
    >
      {body}
    </SubPageLayout>
  );
}
