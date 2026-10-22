import { useNavigate } from 'react-router-dom';
import PasswordResetForm from '@/features/member/password/PasswordResetForm';
import { useRecoveryStatus } from '@/features/member/queries';
import { PATHS } from '@/routes/paths';

// 주소로 직접 들어와도 본인확인 여부를 서버에서 다시 확인한다
export default function PasswordResetPage() {
  const navigate = useNavigate();
  const status = useRecoveryStatus();

  if (status.isPending || status.isFetching) return null;

  return (
    <PasswordResetForm
      isVerified={Boolean(status.data?.verified)}
      onGoLogin={() => navigate(PATHS.LOGIN)}
      onRetryAuth={() => navigate(PATHS.PASSWORD_FIND)}
    />
  );
}
