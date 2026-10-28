import { lazy } from 'react';
import { IS_DEV } from '@/api/env';

const ReceiptUploadDevPage = lazy(
  () => import('@/pages/dev/ReceiptUploadDevPage'),
);
const SubPageDevPage = lazy(() => import('@/pages/dev/SubPageDevPage'));
const ChatDevPage = lazy(() => import('@/pages/dev/ChatDevPage'));

/** DEV 전용 확인 화면: 건강 일지(JAJ)가 영수증 모달을 열면 ReceiptUploadDevPage와 함께 지움 */
/** SubPageDevPage: 각 섹션 화면이 SubPageLayout으로 옮겨 가면 지움 */
/** ChatDevPage: 게시글 [채팅하기](KSJ)가 생기면 지움 */
export default IS_DEV
  ? [
      {
        layout: 'user',
        auth: 'public',
        routes: [
          { path: '/dev/receipt-upload', Component: ReceiptUploadDevPage },
          { path: '/dev/sub-page', Component: SubPageDevPage },
          { path: '/dev/chat', Component: ChatDevPage },
        ],
      },
    ]
  : [];
