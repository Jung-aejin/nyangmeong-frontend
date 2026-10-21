import { useNavigate } from 'react-router-dom';
import ExpenseDashboard from '@/features/expense/dashboard/ExpenseDashboard';
import { PATHS } from '@/routes/paths';
import SubPageLayout from '@/layouts/SubPageLayout';

export default function ExpensePage() {
  const navigate = useNavigate();

  return (
    <SubPageLayout section="mypage">
      <ExpenseDashboard
        onViewAll={(ym) => navigate(`${PATHS.MYPAGE_EXPENSES_ALL}?month=${ym}`)}
      />
    </SubPageLayout>
  );
}
