import { lazy } from 'react';
import { PATHS } from '@/routes/paths';

const ChatPage = lazy(() => import('@/pages/chat/ChatPage'));

export default [
  {
    /** 별도 창 전체 화면이라 UserLayout 밖 */
    layout: 'bare',
    auth: 'public',
    routes: [{ path: PATHS.CHAT, Component: ChatPage }],
  },
];
