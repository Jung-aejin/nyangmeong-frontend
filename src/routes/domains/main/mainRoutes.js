import { lazy } from 'react';
import { PATHS } from '@/routes/paths';

const MainPage = lazy(() => import('@/pages/main/MainPage'));

export default [
  {
    layout: 'user',
    auth: 'public',
    routes: [{ path: PATHS.MAIN, Component: MainPage }],
  },
];
