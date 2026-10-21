import { lazy } from 'react';
import CommunityLayout from '@/layouts/CommunityLayout';
import { PATHS } from '@/routes/paths';

const NewsListPage = lazy(() => import('@/pages/news/NewsListPage'));
const NewsDetailPage = lazy(() => import('@/pages/news/NewsDetailPage'));

/** 펫이야기·실종센터·펫뉴스·펫돌봄(KSJ). 로그인 구현 전 public: 연결 때 member로 전환 */
export default [
  {
    layout: 'user',
    auth: 'public',
    routes: [
      {
        Component: CommunityLayout,
        children: [
          { path: PATHS.COMMUNITY_NEWS, Component: NewsListPage },
          { path: PATHS.COMMUNITY_NEWS_DETAIL, Component: NewsDetailPage },
        ],
      },
    ],
  },
];
