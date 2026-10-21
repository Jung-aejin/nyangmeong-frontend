import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useMe } from '@/features/member/queries';
import { PATHS } from './paths';

/** 화면 진입 차단 편의 장치(권한 판정은 서버) */
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
