import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useMe } from '@/features/member/queries';
import { PATHS } from './paths';

// 화면 진입을 막는 편의 장치다. 권한은 서버가 판정한다
export default function ProtectedRoute({ allowedRoles }) {
  const { data: me, isPending, isError } = useMe();
  const { pathname, search } = useLocation();

  if (isPending) return null;
  if (isError) {
    const redirect = encodeURIComponent(pathname + search);
    return <Navigate to={`${PATHS.HOME}?redirect=${redirect}`} replace />;
  }
  if (allowedRoles && !allowedRoles.includes(me.mbrAuthrtCd)) {
    return <Navigate to={PATHS.HOME} replace />;
  }
  return <Outlet />;
}
