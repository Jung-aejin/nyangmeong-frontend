import { lazy } from 'react';
import { PATHS } from '@/routes/paths';

const CareCalendarPage = lazy(() => import('@/pages/health/CareCalendarPage'));

const HealthDiaryPage = lazy(() => import('@/pages/health/HealthDiaryPage'));

// 검진상세(SCR-HLT-005) 전까지 빈 화면
const EmptyPage = () => null;

export default [
  {
    layout: 'user',
    auth: 'public',
    routes: [
      { path: PATHS.HEALTH_DIARY, Component: HealthDiaryPage },
      { path: PATHS.HEALTH_CALENDAR, Component: CareCalendarPage },
      { path: PATHS.HEALTH_CHECKUP_DETAIL, Component: EmptyPage },
    ],
  },
];
