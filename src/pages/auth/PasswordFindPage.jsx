import { useNavigate } from 'react-router-dom';
import PasswordFindForm from '@/features/member/password/PasswordFindForm';
import { PATHS } from '@/routes/paths';

export default function PasswordFindPage() {
  const navigate = useNavigate();

  return (
    <PasswordFindForm
      onVerified={() => navigate(PATHS.PASSWORD_RESET)}
      onBackToLogin={() => navigate(`${PATHS.LOGIN}?method=email`)}
      onGoLogin={() => navigate(PATHS.LOGIN)}
    />
  );
}
