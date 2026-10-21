import { useParams } from 'react-router-dom';
import InvitationAccept from '@/features/pet/invite/InvitationAccept';
import SubPageLayout from '@/layouts/SubPageLayout';
import { PATHS } from '@/routes/paths';

/**
 * [공동양육 초대 수락]
 * - 경로 변수 invitationToken: 백엔드 확정 전 가정 (라우트 연결은 별도 PR)
 */
export default function InvitationPage() {
  const { invitationToken } = useParams();

  return (
    <SubPageLayout section="mypage" menu={PATHS.MYPAGE_PETS} title="초대 수락">
      <InvitationAccept invitationToken={invitationToken} />
    </SubPageLayout>
  );
}
