import { lazy } from 'react';
import AuthLayout from '@/layouts/AuthLayout';
import { PATHS } from '@/routes/paths';

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));

export default [
  {
    layout: 'bare',
    auth: 'public',
    routes: [
      {
        Component: AuthLayout,
        children: [{ path: PATHS.LOGIN, Component: LoginPage }],
      },
    ],
  },
];
