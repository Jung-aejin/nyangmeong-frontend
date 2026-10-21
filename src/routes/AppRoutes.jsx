import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { MEMBER_ROLE } from '@/constants/memberRole';
import AdminLayout from '@/layouts/AdminLayout';
import UserLayout from '@/layouts/UserLayout';
import ProtectedRoute from './ProtectedRoute';

/**
 * [라우트 진입점]
 * - routes/domains/*Routes.js를 모두 모아 레이아웃에 끼움, 새 도메인은 파일만 추가
 * - 도메인 파일: [{ layout: 'user' | 'bare' | 'admin', auth: 'public' | 'member' | 'admin', routes }]
 */
const groups = Object.values(
  import.meta.glob('./domains/*Routes.js', { eager: true }),
).flatMap((module) => module.default);

const pick = (layout, auth) =>
  groups
    .filter((group) => group.layout === layout && group.auth === auth)
    .flatMap((group) => group.routes);

const routes = [
  {
    element: <UserLayout />,
    children: [
      ...pick('user', 'public'),
      { element: <ProtectedRoute />, children: pick('user', 'member') },
    ],
  },
  ...pick('bare', 'public'),
  {
    element: <ProtectedRoute allowedRoles={[MEMBER_ROLE.ADMIN]} />,
    children: [{ element: <AdminLayout />, children: pick('admin', 'admin') }],
  },
];

export default function AppRoutes() {
  const element = useRoutes(routes);

  return <Suspense fallback={null}>{element}</Suspense>;
}
