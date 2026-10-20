import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MEMBER_ROLE } from '@/constants/memberRole';
import AdminLayout from '@/layouts/AdminLayout';
import CustomerCenterLayout from '@/layouts/CustomerCenterLayout';
import UserLayout from '@/layouts/UserLayout';
import ProtectedRoute from './ProtectedRoute';
import { PATHS } from './paths';

// 도메인별 구획 안에 추가한다. 맨 끝에 붙이면 병합할 때 충돌한다

// 공통
const LandingPage = lazy(() => import('@/pages/main/LandingPage'));
const NotificationSettingsPage = lazy(
  () => import('@/pages/settings/NotificationSettingsPage'),
);

// customer center
const NoticeListPage = lazy(() => import('@/pages/notice/NoticeListPage'));
const NoticeDetailPage = lazy(() => import('@/pages/notice/NoticeDetailPage'));

// ai
const AiChatPage = lazy(() => import('@/pages/ai/AiChatPage'));

// admin
const AdminHomePage = lazy(() => import('@/pages/admin/AdminHomePage'));

export default function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<UserLayout />}>
          {/* 공통 */}
          <Route path={PATHS.HOME} element={<LandingPage />} />
          <Route
            path={PATHS.SETTINGS_NOTIFICATIONS}
            element={<NotificationSettingsPage />}
          />

          {/* customer center */}
          <Route element={<CustomerCenterLayout />}>
            <Route path={PATHS.NOTICES} element={<NoticeListPage />} />
            <Route path={PATHS.NOTICE_DETAIL} element={<NoticeDetailPage />} />
          </Route>
        </Route>

        {/* ai: 별도 창 전체 화면이라 UserLayout 밖에 둔다 */}
        <Route path={PATHS.AI} element={<AiChatPage />} />

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
