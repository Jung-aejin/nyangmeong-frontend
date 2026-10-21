import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MEMBER_ROLE } from '@/constants/memberRole';
import AdminLayout from '@/layouts/AdminLayout';
import UserLayout from '@/layouts/UserLayout';
import PlaceLayout from '@/layouts/PlaceLayout';
import ProtectedRoute from './ProtectedRoute';
import { PATHS } from './paths';

// 도메인별 구획 안에 추가한다. 맨 끝에 붙이면 병합할 때 충돌한다

// 공통
const LandingPage = lazy(() => import('@/pages/landing/LandingPage'));
const NotificationSettingsPage = lazy(
  () => import('@/pages/settings/NotificationSettingsPage'),
);

// main
const MainPage = lazy(() => import('@/pages/main/MainPage'));

// ai
const AiChatPage = lazy(() => import('@/pages/ai/AiChatPage'));

// mypage
const PetListPage = lazy(() => import('@/pages/mypage/PetListPage'));

// admin
const AdminHomePage = lazy(() => import('@/pages/admin/AdminHomePage'));

const PlacePage = lazy(() => import('@/pages/place/PlacePage'));

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

          {/* main. 로그인 API(AIC)가 나오면 ProtectedRoute 아래로 옮긴다 */}
          <Route path={PATHS.MAIN} element={<MainPage />} />

          {/* mypage. 로그인 API(AIC)가 나오면 ProtectedRoute 아래로 옮긴다 */}
          <Route path={PATHS.MYPAGE_PETS} element={<PetListPage />} />
        </Route>

        <Route element={<PlaceLayout />}>
          <Route path={PATHS.PLACES} element={<PlacePage />} />
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
