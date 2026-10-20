import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { showToast } from '@/components/toastStore';
import { getCurrentYm, shiftYm } from '@/utils/yearMonth';
import ExpenseCalendar from './ExpenseCalendar';
import ExpenseCategoryChart from './ExpenseCategoryChart';
import ExpenseDayDetail from './ExpenseDayDetail';
import ExpenseDeleteDialog from './ExpenseDeleteDialog';
import ExpenseLimitModal from './ExpenseLimitModal';
import ExpensePetChart from './ExpensePetChart';
import ExpenseSummary from './ExpenseSummary';
import ExpenseTopList from './ExpenseTopList';
import {
  getCalendarCells,
  getCategoryStats,
  getMonthExpenses,
  getPetStats,
  getTopExpenses,
  sumAmt,
} from './expenseStats';
import { CARD, CARD_BODY } from './expenseStyles';
import { useExpenseOverview, useExpenses } from './queries';

const TOP_EXPENSE_COUNT = 3;

// onViewAll(ym): 보고 있던 달을 들고 전체 내역으로 간다
export default function ExpenseDashboard({ onViewAll }) {
  const [maxYm] = useState(getCurrentYm);
  const [ym, setYm] = useState(maxYm);
  const [selectedYmd, setSelectedYmd] = useState(null);
  const [isLimitOpen, setIsLimitOpen] = useState(false);
  const [deletingExpense, setDeletingExpense] = useState(null);

  // 지난달 대비를 위해 지난달까지 함께 받는다
  const { data: expenses = [], isPlaceholderData } = useExpenses({
    fromYm: shiftYm(ym, -1),
    toYm: ym,
  });
  const { data: overview } = useExpenseOverview();

  if (!overview) return null;

  const monthExpenses = getMonthExpenses(expenses, ym);
  const prevExpenses = getMonthExpenses(expenses, shiftYm(ym, -1));
  const selectedItems = selectedYmd
    ? monthExpenses.filter((expense) => expense.expndYmd === selectedYmd)
    : [];

  const handleChangeMonth = (delta) => {
    setYm(shiftYm(ym, delta));
    setSelectedYmd(null);
  };
  const handleSelectDay = (expndYmd) =>
    setSelectedYmd(expndYmd === selectedYmd ? null : expndYmd);
  // 지출 등록·수정 모달(SCR-MYP-031)을 만들 때 연결한다
  const showPending = () => showToast('준비 중인 기능이에요');

  return (
    <div
      className={`grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)] lg:items-start ${isPlaceholderData ? 'opacity-60' : ''}`}
    >
      <div className="flex min-w-0 flex-col gap-5">
        <ExpenseSummary
          ym={ym}
          isNextDisabled={ym >= maxYm}
          onChangeMonth={handleChangeMonth}
          totalAmt={sumAmt(monthExpenses)}
          count={monthExpenses.length}
          prevTotalAmt={prevExpenses.length > 0 ? sumAmt(prevExpenses) : null}
          mmExpndLimAmt={overview.mmExpndLimAmt}
          onOpenLimit={() => setIsLimitOpen(true)}
        />
        <section aria-label="월간 달력" className={`${CARD} ${CARD_BODY}`}>
          <ExpenseCalendar
            ym={ym}
            cells={getCalendarCells(ym, monthExpenses)}
            selectedYmd={selectedYmd}
            onSelectDay={handleSelectDay}
            onEmptyDay={showPending}
          />
          {selectedItems.length > 0 && (
            <ExpenseDayDetail
              expndYmd={selectedYmd}
              items={selectedItems}
              totalAmt={sumAmt(selectedItems)}
              onEdit={showPending}
              onDelete={setDeletingExpense}
            />
          )}
        </section>
      </div>
      <div className="flex min-w-0 flex-col gap-5">
        <ExpenseCategoryChart stats={getCategoryStats(monthExpenses)} />
        <ExpensePetChart stats={getPetStats(monthExpenses, overview.pets)} />
        <ExpenseTopList
          expenses={getTopExpenses(monthExpenses, TOP_EXPENSE_COUNT)}
        />
        <button
          type="button"
          onClick={() => onViewAll(ym)}
          className={`${CARD} flex items-center justify-between px-6 py-4 font-semibold hover:border-brand-100`}
        >
          이번달 전체 내역 보기
          <ChevronRight className="size-5 text-subtle" aria-hidden="true" />
        </button>
      </div>
      {isLimitOpen && (
        <ExpenseLimitModal
          mmExpndLimAmt={overview.mmExpndLimAmt}
          onClose={() => setIsLimitOpen(false)}
        />
      )}
      {deletingExpense && (
        <ExpenseDeleteDialog
          expense={deletingExpense}
          onClose={() => setDeletingExpense(null)}
        />
      )}
    </div>
  );
}
