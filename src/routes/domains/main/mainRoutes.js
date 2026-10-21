import { lazy } from 'react';
import { PATHS } from '@/routes/paths';

const LandingPage = lazy(() => import('@/pages/main/LandingPage'));

export default [
  {
    layout: 'user',
    auth: 'public',
    routes: [{ path: PATHS.HOME, Component: LandingPage }],
  },
];
