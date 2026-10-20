import { useNavigate } from 'react-router-dom';
import ExpenseDashboard from '@/features/expense/ExpenseDashboard';
import { PATHS } from '@/routes/paths';

export default function ExpensePage() {
  const navigate = useNavigate();

  return (
    <div className="py-6">
      <h1 className="mb-6 text-page font-bold tracking-[-0.02em]">가계부</h1>
      <ExpenseDashboard
        onViewAll={(ym) => navigate(`${PATHS.MYPAGE_EXPENSES_ALL}?month=${ym}`)}
      />
    </div>
  );
}
