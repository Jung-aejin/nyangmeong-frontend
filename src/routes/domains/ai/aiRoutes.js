import { lazy } from 'react';
import { PATHS } from '@/routes/paths';

const AiChatPage = lazy(() => import('@/pages/ai/AiChatPage'));

export default [
  {
    /** 별도 창 전체 화면이라 UserLayout 밖 */
    layout: 'bare',
    auth: 'public',
    routes: [{ path: PATHS.AI, Component: AiChatPage }],
  },
];
