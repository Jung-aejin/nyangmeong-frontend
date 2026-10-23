import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import EmailLoginForm from '@/features/member/login/EmailLoginForm';
import LoginMethodChoice from '@/features/member/login/LoginMethodChoice';
import { PATHS } from '@/routes/paths';
import { getRedirectPath } from '@/routes/redirect';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isEmail = searchParams.get('method') === 'email';

  const selectEmail = () =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('method', 'email');
      return next;
    });

  const backToChoice = () => {
    if (location.key !== 'default') {
      navigate(-1);
      return;
    }
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('method');
        return next;
      },
      { replace: true },
    );
  };

  const finishLogin = () =>
    navigate(getRedirectPath(location.search), { replace: true });

  if (isEmail) {
    return <EmailLoginForm onBack={backToChoice} onSuccess={finishLogin} />;
  }
  return (
    <LoginMethodChoice
      onBack={() => navigate(PATHS.HOME)}
      onSelectEmail={selectEmail}
      onSignup={() => navigate(PATHS.SIGNUP)}
      isJoined={searchParams.get('joined') === '1'}
    />
  );
}
