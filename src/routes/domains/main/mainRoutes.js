import { lazy } from 'react';
import { PATHS } from '@/routes/paths';

const LandingPage = lazy(() => import('@/pages/landing/LandingPage'));
const MainPage = lazy(() => import('@/pages/main/MainPage'));

export default [
  {
    layout: 'user',
    auth: 'public',
    routes: [
      { path: PATHS.HOME, Component: LandingPage },
      { path: PATHS.MAIN, Component: MainPage },
    ],
  },
];
