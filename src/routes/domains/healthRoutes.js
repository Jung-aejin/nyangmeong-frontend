import { lazy } from 'react';
import { PATHS } from '@/routes/paths';

const CareCalendarPage = lazy(() => import('@/pages/health/CareCalendarPage'));

export default [
  {
    layout: 'user',
    auth: 'public',
    routes: [{ path: PATHS.HEALTH_CALENDAR, Component: CareCalendarPage }],
  },
];
