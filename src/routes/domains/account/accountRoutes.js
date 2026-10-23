import { lazy } from 'react';
import AuthLayout from '@/layouts/AuthLayout';
import { PATHS } from '@/routes/paths';

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const PasswordFindPage = lazy(() => import('@/pages/auth/PasswordFindPage'));
const PasswordResetPage = lazy(() => import('@/pages/auth/PasswordResetPage'));

export default [
  {
    layout: 'bare',
    auth: 'public',
    routes: [
      {
        Component: AuthLayout,
        children: [
          { path: PATHS.LOGIN, Component: LoginPage },
          { path: PATHS.SIGNUP, Component: SignupPage },
          { path: PATHS.PASSWORD_FIND, Component: PasswordFindPage },
          { path: PATHS.PASSWORD_RESET, Component: PasswordResetPage },
        ],
      },
    ],
  },
];
