import { lazy } from 'react';
import CustomerCenterLayout from '@/layouts/CustomerCenterLayout';
import { PATHS } from '@/routes/paths';

const NoticeListPage = lazy(() => import('@/pages/notice/NoticeListPage'));
const NoticeDetailPage = lazy(() => import('@/pages/notice/NoticeDetailPage'));
const FaqListPage = lazy(() => import('@/pages/faq/FaqListPage'));

/** 로그인 구현 전 public: 연결 때 member로 전환 */
export default [
  {
    layout: 'user',
    auth: 'public',
    routes: [
      {
        Component: CustomerCenterLayout,
        children: [
          { path: PATHS.NOTICES, Component: NoticeListPage },
          { path: PATHS.NOTICE_DETAIL, Component: NoticeDetailPage },
          { path: PATHS.FAQS, Component: FaqListPage },
        ],
      },
    ],
  },
];
