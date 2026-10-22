import { Link, useParams } from 'react-router-dom';
import CareDetail from '@/features/community/care/CareDetail';
import { useCare } from '@/features/community/careQueries';
import SubPageLayout from '@/layouts/SubPageLayout';
import { PATHS } from '@/routes/paths';

const DESCRIPTION = '가까운 이웃과 산책 · 돌봄을 부탁하고 도와줘요';

export default function CareDetailPage() {
  const petPrtcRcrtSn = Number(useParams().petPrtcRcrtSn);
  const { data: post, isPending, isError } = useCare(petPrtcRcrtSn);

  let body;
  if (isPending) {
    body = <p className="text-muted">불러오는 중이에요</p>;
  } else if (isError) {
    body = (
      <div role="alert" className="flex flex-col items-start gap-3">
        <p className="text-muted">게시글을 찾지 못했어요</p>
        <Link
          to={PATHS.COMMUNITY_PETCARE}
          className="text-base font-medium text-brand-500 hover:underline"
        >
          우리동네 펫돌봄 목록으로
        </Link>
      </div>
    );
  } else {
    body = <CareDetail post={post} />;
  }

  /** 상세 제목은 메뉴 이름이라 title을 넘기지 않는다. 「목록으로」는 본문 하단 */
  return (
    <SubPageLayout
      section="community"
      menu={PATHS.COMMUNITY_PETCARE}
      back={false}
      description={DESCRIPTION}
    >
      {body}
    </SubPageLayout>
  );
}
