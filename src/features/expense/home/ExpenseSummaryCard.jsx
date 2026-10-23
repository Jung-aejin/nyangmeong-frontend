import { useState } from 'react';
import StatLink from '@/components/StatLink';
import { PATHS } from '@/routes/paths';
import { getCurrentYm } from '@/utils/yearMonth';
import { useExpenses } from '../queries';

export default function ExpenseSummaryCard() {
  const [ym] = useState(getCurrentYm);
  const { data: expenses, isError } = useExpenses({ fromYm: ym, toYm: ym });

  const total = expenses?.reduce((sum, expense) => sum + expense.expndAmt, 0);

  return (
    <StatLink
      to={PATHS.MYPAGE_EXPENSES}
      label="이번달 지출액"
      value={total?.toLocaleString('ko-KR')}
      unit="원"
      note={isError ? '불러오지 못했어요' : undefined}
    />
  );
}
