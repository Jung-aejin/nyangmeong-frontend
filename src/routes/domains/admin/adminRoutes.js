import { lazy } from 'react';
import { PATHS } from '@/routes/paths';

const AdminHomePage = lazy(() => import('@/pages/admin/AdminHomePage'));

export default [
  {
    layout: 'admin',
    auth: 'admin',
    routes: [{ path: PATHS.ADMIN, Component: AdminHomePage }],
  },
];
