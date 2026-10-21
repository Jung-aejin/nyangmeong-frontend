import { lazy } from 'react';
import { PATHS } from '@/routes/paths';

const CareCalendarPage = lazy(() => import('@/pages/health/CareCalendarPage'));

const CheckupDetailPage = lazy(
  () => import('@/pages/health/CheckupDetailPage'),
);

const HealthDiaryPage = lazy(() => import('@/pages/health/HealthDiaryPage'));

/** 검사 수치 입력(SCR-HLT-007) 전까지 빈 화면 */
const EmptyPage = () => null;

export default [
  {
    layout: 'user',
    auth: 'public',
    routes: [
      { path: PATHS.HEALTH_DIARY, Component: HealthDiaryPage },
      { path: PATHS.HEALTH_CALENDAR, Component: CareCalendarPage },
      { path: PATHS.HEALTH_CHECKUP_DETAIL, Component: CheckupDetailPage },
      { path: PATHS.HEALTH_CHECKUP_INSPECTIONS, Component: EmptyPage },
    ],
  },
];
