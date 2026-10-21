import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { MEMBER_ROLE } from '@/constants/memberRole';
import AdminLayout from '@/layouts/AdminLayout';
import UserLayout from '@/layouts/UserLayout';
import ProtectedRoute from './ProtectedRoute';

/**
 * [라우트 진입점]
 * - routes/domains/<도메인>/index.js를 모두 모아 레이아웃에 끼움, 새 도메인은 폴더만 추가
 * - index.js는 그 도메인의 <도메인>Routes.js를 합침: [{ layout: 'user' | 'bare' | 'admin', auth: 'public' | 'member' | 'admin', routes }]
 */
const groups = Object.values(
  import.meta.glob('./domains/*/index.js', { eager: true }),
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
