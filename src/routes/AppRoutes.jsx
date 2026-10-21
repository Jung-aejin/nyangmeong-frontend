import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { MEMBER_ROLE } from '@/constants/memberRole';
import AdminLayout from '@/layouts/AdminLayout';
import UserLayout from '@/layouts/UserLayout';
import domainRoutes from './domains';
import ProtectedRoute from './ProtectedRoute';

/**
 * [라우트 진입점]
 * - routes/domains/index.js가 모은 도메인 라우트를 레이아웃에 끼움
 * - 도메인 라우트: [{ layout: 'user' | 'bare' | 'admin', auth: 'public' | 'member' | 'admin', routes }]
 */
const pick = (layout, auth) =>
  domainRoutes
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
