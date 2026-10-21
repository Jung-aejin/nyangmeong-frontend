import { lazy } from 'react';
import { PATHS } from '@/routes/paths';

const PetListPage = lazy(() => import('@/pages/mypage/PetListPage'));
const ExpensePage = lazy(() => import('@/pages/mypage/ExpensePage'));
const ExpenseAllPage = lazy(() => import('@/pages/mypage/ExpenseAllPage'));

export default [
  {
    /** 로그인 API(AIC) 후 auth를 'member'로 바꿈 */
    layout: 'user',
    auth: 'public',
    routes: [
      { path: PATHS.MYPAGE_PETS, Component: PetListPage },
      { path: PATHS.MYPAGE_EXPENSES, Component: ExpensePage },
      { path: PATHS.MYPAGE_EXPENSES_ALL, Component: ExpenseAllPage },
    ],
  },
];
