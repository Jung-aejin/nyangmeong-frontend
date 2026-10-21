import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MEMBER_ROLE } from '@/constants/memberRole';
import AdminLayout from '@/layouts/AdminLayout';
import UserLayout from '@/layouts/UserLayout';
import ProtectedRoute from './ProtectedRoute';
import { PATHS } from './paths';

/** 도메인별 구획 안에 추가: 맨 끝 추가 시 병합 충돌 */

/** 공통 */
const LandingPage = lazy(() => import('@/pages/main/LandingPage'));
const NotificationSettingsPage = lazy(
  () => import('@/pages/settings/NotificationSettingsPage'),
);

/** health */
const CareCalendarPage = lazy(() => import('@/pages/health/CareCalendarPage'));

/** ai */
const AiChatPage = lazy(() => import('@/pages/ai/AiChatPage'));

/** mypage */
const PetListPage = lazy(() => import('@/pages/mypage/PetListPage'));
const ExpensePage = lazy(() => import('@/pages/mypage/ExpensePage'));
const ExpenseAllPage = lazy(() => import('@/pages/mypage/ExpenseAllPage'));
const PointPage = lazy(() => import('@/pages/mypage/PointPage'));
const ProfileEditPage = lazy(() => import('@/pages/mypage/ProfileEditPage'));

/** admin */
const AdminHomePage = lazy(() => import('@/pages/admin/AdminHomePage'));

export default function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<UserLayout />}>
          {/** 공통 */}
          <Route path={PATHS.HOME} element={<LandingPage />} />
          <Route
            path={PATHS.SETTINGS_NOTIFICATIONS}
            element={<NotificationSettingsPage />}
          />

          {/** health */}
          <Route path={PATHS.HEALTH_CALENDAR} element={<CareCalendarPage />} />

          {/** mypage: 로그인 API(AIC) 후 ProtectedRoute 아래로 이동 */}
          <Route path={PATHS.MYPAGE_PETS} element={<PetListPage />} />
          <Route path={PATHS.MYPAGE_EXPENSES} element={<ExpensePage />} />
          <Route
            path={PATHS.MYPAGE_EXPENSES_ALL}
            element={<ExpenseAllPage />}
          />
          <Route path={PATHS.MYPAGE_POINTS} element={<PointPage />} />
          <Route path={PATHS.MYPAGE_PROFILE} element={<ProfileEditPage />} />
        </Route>

        {/** ai: 별도 창 전체 화면이라 UserLayout 밖 */}
        <Route path={PATHS.AI} element={<AiChatPage />} />

        <Route element={<ProtectedRoute allowedRoles={[MEMBER_ROLE.ADMIN]} />}>
          <Route element={<AdminLayout />}>
            {/** admin */}
            <Route path={PATHS.ADMIN} element={<AdminHomePage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
