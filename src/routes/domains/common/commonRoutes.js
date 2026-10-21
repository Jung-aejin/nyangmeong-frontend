import { lazy } from 'react';
import { PATHS } from '@/routes/paths';

const LandingPage = lazy(() => import('@/pages/landing/LandingPage'));
const NotificationSettingsPage = lazy(
  () => import('@/pages/settings/NotificationSettingsPage'),
);

export default [
  {
    layout: 'user',
    auth: 'public',
    routes: [
      { path: PATHS.HOME, Component: LandingPage },
      {
        path: PATHS.SETTINGS_NOTIFICATIONS,
        Component: NotificationSettingsPage,
      },
    ],
  },
];
