import { useNavigate } from 'react-router-dom';
import SignupForm from '@/features/member/signup/SignupForm';
import { PATHS } from '@/routes/paths';

export default function SignupPage() {
  const navigate = useNavigate();

  return (
    <SignupForm
      onBackToLogin={() => navigate(PATHS.LOGIN)}
      onGoLogin={() => navigate(`${PATHS.LOGIN}?joined=1`)}
    />
  );
}
