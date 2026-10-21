import { useSearchParams } from 'react-router-dom';
import ExpenseHistory from '@/features/expense/history/ExpenseHistory';
import SubPageLayout from '@/layouts/SubPageLayout';
import { PATHS } from '@/routes/paths';

export default function ExpenseAllPage() {
  const [searchParams] = useSearchParams();

  return (
    <SubPageLayout
      section="mypage"
      menu={PATHS.MYPAGE_EXPENSES}
      title="전체 내역"
    >
      <ExpenseHistory initialYm={searchParams.get('month')} />
    </SubPageLayout>
  );
}
