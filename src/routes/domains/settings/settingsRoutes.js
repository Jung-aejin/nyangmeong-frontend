import { lazy } from 'react';
import { PATHS } from '@/routes/paths';

const NotificationSettingsPage = lazy(
  () => import('@/pages/settings/NotificationSettingsPage'),
);

export default [
  {
    layout: 'user',
    auth: 'public',
    routes: [
      {
        path: PATHS.SETTINGS_NOTIFICATIONS,
        Component: NotificationSettingsPage,
      },
    ],
  },
];
