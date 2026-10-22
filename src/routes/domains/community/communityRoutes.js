import { lazy } from 'react';
import { PATHS } from '@/routes/paths';

const PostListPage = lazy(() => import('@/pages/community/PostListPage'));
const PostDetailPage = lazy(() => import('@/pages/community/PostDetailPage'));
const PostWritePage = lazy(() => import('@/pages/community/PostWritePage'));
const PostEditPage = lazy(() => import('@/pages/community/PostEditPage'));
const NewsListPage = lazy(() => import('@/pages/news/NewsListPage'));
const NewsDetailPage = lazy(() => import('@/pages/news/NewsDetailPage'));

/** 펫이야기·실종센터·펫뉴스·펫돌봄(KSJ). 로그인 구현 전 public: 연결 때 member로 전환 */
export default [
  {
    layout: 'user',
    auth: 'public',
    routes: [
      { path: PATHS.COMMUNITY, Component: PostListPage },
      { path: PATHS.COMMUNITY_POST_NEW, Component: PostWritePage },
      { path: PATHS.COMMUNITY_POST_DETAIL, Component: PostDetailPage },
      { path: PATHS.COMMUNITY_POST_EDIT, Component: PostEditPage },
      { path: PATHS.COMMUNITY_NEWS, Component: NewsListPage },
      { path: PATHS.COMMUNITY_NEWS_DETAIL, Component: NewsDetailPage },
    ],
  },
];
