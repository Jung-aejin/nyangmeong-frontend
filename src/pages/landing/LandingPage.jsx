import { Link, useLocation } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

export default function LandingPage() {
  const { search } = useLocation();
  /** 복귀 경로를 로그인 화면에 전달(검증은 로그인 성공 뒤) */
  const redirect = new URLSearchParams(search).get('redirect');
  const loginTo = redirect
    ? `${PATHS.LOGIN}?redirect=${encodeURIComponent(redirect)}`
    : PATHS.LOGIN;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">냥멍케어</h1>
      <Link to={loginTo} className="mt-4 inline-block underline">
        로그인
      </Link>
    </div>
  );
}
