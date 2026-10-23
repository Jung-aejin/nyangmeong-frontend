import { Link, useParams } from 'react-router-dom';
import MissingDetail from '@/features/community/missing/MissingDetail';
import { useMissing } from '@/features/community/missingQueries';
import SubPageLayout from '@/layouts/SubPageLayout';
import { PATHS } from '@/routes/paths';

const DESCRIPTION =
  '잃어버린 반려동물을 함께 찾아요. 비슷한 아이를 보셨다면 댓글로 알려 주세요';

export default function MissingDetailPage() {
  const lostTpofSn = Number(useParams().lostTpofSn);
  const { data: post, isPending, isError } = useMissing(lostTpofSn);

  let body;
  if (isPending) {
    body = <p className="text-muted">불러오는 중이에요</p>;
  } else if (isError) {
    body = (
      <div role="alert" className="flex flex-col items-start gap-3">
        <p className="text-muted">게시글을 찾지 못했어요</p>
        <Link
          to={PATHS.COMMUNITY_MISSING}
          className="text-base font-medium text-brand-500 hover:underline"
        >
          실종센터 목록으로
        </Link>
      </div>
    );
  } else {
    body = <MissingDetail post={post} />;
  }

  /** 상세 제목은 메뉴 이름이라 title을 넘기지 않는다. 「목록으로」는 본문 하단 */
  return (
    <SubPageLayout
      section="community"
      menu={PATHS.COMMUNITY_MISSING}
      back={false}
      description={DESCRIPTION}
    >
      {body}
    </SubPageLayout>
  );
}
