import { useLocation } from 'react-router-dom';
import AuthSlider from '@/layouts/AuthSlider';
import { PATHS } from '@/routes/paths';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';

export default function AuthPage() {
  const { pathname } = useLocation();

  return (
    <AuthSlider
      isSignup={pathname === PATHS.SIGNUP}
      login={<LoginPage />}
      signup={<SignupPage />}
    />
  );
}
