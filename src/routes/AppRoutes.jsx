import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MEMBER_ROLE } from '@/constants/memberRole';
import AdminLayout from '@/layouts/AdminLayout';
import UserLayout from '@/layouts/UserLayout';
import ProtectedRoute from './ProtectedRoute';
import { PATHS } from './paths';

// 도메인별 구획 안에 추가한다. 맨 끝에 붙이면 병합할 때 충돌한다

// 공통
const LandingPage = lazy(() => import('@/pages/main/LandingPage'));

// admin
const AdminHomePage = lazy(() => import('@/pages/admin/AdminHomePage'));

export default function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<UserLayout />}>
          {/* 공통 */}
          <Route path={PATHS.HOME} element={<LandingPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[MEMBER_ROLE.ADMIN]} />}>
          <Route element={<AdminLayout />}>
            {/* admin */}
            <Route path={PATHS.ADMIN} element={<AdminHomePage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
