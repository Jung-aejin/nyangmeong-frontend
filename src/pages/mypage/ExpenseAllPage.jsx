import { ChevronLeft } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import ExpenseHistory from '@/features/expense/history/ExpenseHistory';
import { PATHS } from '@/routes/paths';

export default function ExpenseAllPage() {
  const [searchParams] = useSearchParams();

  return (
    <div className="py-6">
      <Link
        to={PATHS.MYPAGE_EXPENSES}
        className="mb-2 inline-flex items-center gap-1 text-muted hover:text-ink"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        목록으로
      </Link>
      <h1 className="mb-6 text-page font-bold tracking-[-0.02em]">전체 내역</h1>
      <ExpenseHistory initialYm={searchParams.get('month')} />
    </div>
  );
}
