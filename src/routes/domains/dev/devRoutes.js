import { lazy } from 'react';
import { IS_DEV } from '@/api/env';

const ReceiptUploadDevPage = lazy(
  () => import('@/pages/dev/ReceiptUploadDevPage'),
);

/** DEV 전용 확인 화면: 건강 일지(JAJ)가 영수증 모달을 열면 ReceiptUploadDevPage와 함께 지움 */
export default IS_DEV
  ? [
      {
        layout: 'user',
        auth: 'public',
        routes: [
          { path: '/dev/receipt-upload', Component: ReceiptUploadDevPage },
        ],
      },
    ]
  : [];
