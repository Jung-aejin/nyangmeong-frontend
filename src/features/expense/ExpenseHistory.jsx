import { useState } from 'react';
import { BTN_SECONDARY } from '@/components/buttonStyles';
import MonthNav from '@/components/MonthNav';
import MonthPicker from '@/components/MonthPicker';
import Pagination from '@/components/Pagination';
import { getCurrentYm, isYm, shiftYm } from '@/utils/yearMonth';
import ExpenseBulkDeleteDialog from './ExpenseBulkDeleteDialog';
import {
  EXPND_CLSF,
  FILTER_ALL,
  FILTER_SHARED,
  PAGE_SIZE,
  RANGE_MODE,
  SORT,
} from './expenseCodes';
import ExpenseEditModal from './ExpenseEditModal';
import ExpenseFilterBar from './ExpenseFilterBar';
import { formatWon, getPetFilterLabel } from './expenseFormat';
import ExpenseGroupList from './ExpenseGroupList';
import ExpenseRangeSelect from './ExpenseRangeSelect';
import ExpenseSelectBar from './ExpenseSelectBar';
import {
  filterExpenses,
  groupByDay,
  sortExpenses,
  sumAmt,
} from './expenseStats';
import { CARD } from './expenseStyles';
import { useExpenseOverview, useExpenses } from './queries';

/** 기간 순서 보정 */
const getSortedPeriod = (range) =>
  range.fromYm <= range.toYm
    ? { fromYm: range.fromYm, toYm: range.toYm }
    : { fromYm: range.toYm, toYm: range.fromYm };

const getQueryRange = (range, isEditing, ym) => {
  if (!isEditing || range.mode === RANGE_MODE.MONTH) {
    return { fromYm: ym, toYm: ym };
  }
  if (range.mode === RANGE_MODE.ALL) return { fromYm: null, toYm: null };
  return getSortedPeriod(range);
};

/** initialYm: 진입 시 보던 달 */
export default function ExpenseHistory({ initialYm }) {
  const [maxYm] = useState(getCurrentYm);
  const [ym, setYm] = useState(() =>
    isYm(initialYm) && initialYm <= maxYm ? initialYm : maxYm,
  );
  const [petFilter, setPetFilter] = useState(FILTER_ALL);
  const [categoryFilter, setCategoryFilter] = useState(FILTER_ALL);
  const [sort, setSort] = useState(SORT.LATEST);
  const [page, setPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [range, setRange] = useState({
    mode: RANGE_MODE.MONTH,
    fromYm: ym,
    toYm: ym,
  });
  const [selected, setSelected] = useState(() => new Set());
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const { data: overview } = useExpenseOverview();
  const { data: expenses = [], isPlaceholderData } = useExpenses(
    getQueryRange(range, isEditing, ym),
  );

  if (!overview) return null;

  const filtered = sortExpenses(
    filterExpenses(expenses, { petFilter, categoryFilter }),
    sort,
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const selectedItems = filtered.filter((expense) =>
    selected.has(expense.expndSn),
  );
  const isPageAllSelected =
    pageItems.length > 0 &&
    pageItems.every((expense) => selected.has(expense.expndSn));
  const isResultAllSelected =
    filtered.length > 0 && selectedItems.length === filtered.length;

  /** 기간 지정 선택 가능 달 */
  const rangeMonths = [...new Set([...overview.expndMonths, ym])].sort();
  const scope =
    range.mode === RANGE_MODE.ALL
      ? {
          fromYm: rangeMonths[0],
          toYm: rangeMonths[rangeMonths.length - 1],
        }
      : getQueryRange(range, true, ym);
  const petOption = overview.pets.find(
    (pet) => String(pet.petSn) === petFilter,
  );
  const petLabel =
    petFilter === FILTER_ALL
      ? '전체 반려동물'
      : petFilter === FILTER_SHARED
        ? '공용'
        : getPetFilterLabel(petOption);
  const categoryLabel =
    categoryFilter === FILTER_ALL
      ? '전체 카테고리'
      : EXPND_CLSF[categoryFilter].name;

  /** 조회 조건 변경 시 1페이지·편집 종료 */
  const resetView = () => {
    setPage(1);
    setIsEditing(false);
    setSelected(new Set());
  };
  const handleChangeMonth = (nextYm) => {
    setYm(nextYm);
    resetView();
  };
  const handleChangePet = (value) => {
    setPetFilter(value);
    resetView();
  };
  const handleChangeCategory = (value) => {
    setCategoryFilter(value);
    resetView();
  };
  const handleChangeSort = (value) => {
    setSort(value);
    resetView();
  };
  const handleStartEdit = () => {
    setRange({ mode: RANGE_MODE.MONTH, fromYm: ym, toYm: ym });
    setSelected(new Set());
    setPage(1);
    setIsEditing(true);
  };
  const handleChangeRange = (nextRange) => {
    setRange(nextRange);
    setSelected(new Set());
    setPage(1);
  };
  const handleToggle = (expndSn) => {
    const next = new Set(selected);
    if (next.has(expndSn)) next.delete(expndSn);
    else next.add(expndSn);
    setSelected(next);
  };
  const handleTogglePage = () => {
    const next = new Set(selected);
    pageItems.forEach((expense) => {
      if (isPageAllSelected) next.delete(expense.expndSn);
      else next.add(expense.expndSn);
    });
    setSelected(next);
  };
  const handleToggleResult = () =>
    setSelected(
      isResultAllSelected
        ? new Set()
        : new Set(filtered.map((expense) => expense.expndSn)),
    );
  const handleDeleted = () => {
    setSelected(new Set());
    setIsBulkOpen(false);
  };

  return (
    <div
      className={`flex flex-col gap-5 ${isPlaceholderData ? 'opacity-60' : ''}`}
    >
      {isEditing ? (
        <ExpenseRangeSelect
          baseYm={ym}
          range={range}
          months={rangeMonths}
          onChange={handleChangeRange}
          onCancel={resetView}
        />
      ) : (
        <section
          aria-label="조회 기간"
          className={`${CARD} flex flex-wrap items-center justify-between gap-3 px-6 py-4`}
        >
          <MonthNav
            onPrev={() => handleChangeMonth(shiftYm(ym, -1))}
            onNext={() => handleChangeMonth(shiftYm(ym, 1))}
            isNextDisabled={ym >= maxYm}
          >
            <MonthPicker
              ym={ym}
              maxYm={maxYm}
              enabledYms={overview.expndMonths}
              onSelect={handleChangeMonth}
            />
          </MonthNav>
          <p className="flex items-baseline gap-2">
            <b className="text-page leading-[1.35] font-bold">
              {formatWon(sumAmt(expenses))}
            </b>
            <span className="text-subtle">{expenses.length}건</span>
          </p>
        </section>
      )}
      <ExpenseFilterBar
        pets={overview.pets}
        petFilter={petFilter}
        categoryFilter={categoryFilter}
        sort={sort}
        hasSort={!isEditing}
        onChangePet={handleChangePet}
        onChangeCategory={handleChangeCategory}
        onChangeSort={handleChangeSort}
      >
        {!isEditing && (
          <button
            type="button"
            onClick={handleStartEdit}
            className={BTN_SECONDARY}
          >
            편집
          </button>
        )}
      </ExpenseFilterBar>
      <section aria-label="지출 내역" className={`${CARD} overflow-hidden`}>
        {isEditing && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-2 px-4 py-3">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={isPageAllSelected}
                onChange={handleTogglePage}
                disabled={pageItems.length === 0}
                className="size-5 cursor-pointer accent-brand-500"
              />
              <span>
                전체 선택{' '}
                <span className="text-subtle">
                  (이 페이지 {pageItems.length}건)
                </span>
              </span>
            </label>
            <button
              type="button"
              onClick={handleToggleResult}
              disabled={filtered.length === 0}
              className="font-semibold text-brand-600 hover:underline disabled:text-line-strong disabled:no-underline"
            >
              {isResultAllSelected
                ? '선택 모두 해제'
                : `조회 결과 ${filtered.length}건 모두 선택`}
            </button>
          </div>
        )}
        {pageItems.length === 0 ? (
          <p className="px-4 py-10 text-center text-subtle">
            조회된 지출이 없어요
          </p>
        ) : (
          <ExpenseGroupList
            groups={groupByDay(pageItems)}
            isEditing={isEditing}
            selected={selected}
            onToggle={handleToggle}
            onEditItem={setEditingExpense}
          />
        )}
      </section>
      <Pagination page={currentPage} pageCount={pageCount} onChange={setPage} />
      {!isEditing && (
        <p className="text-center text-sm text-subtle">
          항목을 누르면 바로 수정할 수 있어요
        </p>
      )}
      {isEditing && (
        <ExpenseSelectBar
          count={selectedItems.length}
          totalAmt={sumAmt(selectedItems)}
          onDelete={() => setIsBulkOpen(true)}
        />
      )}
      {editingExpense && (
        <ExpenseEditModal
          expense={editingExpense}
          pets={overview.pets}
          onSaved={() => setEditingExpense(null)}
          onClose={() => setEditingExpense(null)}
        />
      )}
      {isBulkOpen && (
        <ExpenseBulkDeleteDialog
          expndSns={selectedItems.map((expense) => expense.expndSn)}
          totalAmt={sumAmt(selectedItems)}
          fromYm={scope.fromYm}
          toYm={scope.toYm}
          filterLabel={`${petLabel} · ${categoryLabel}`}
          onDeleted={handleDeleted}
          onClose={() => setIsBulkOpen(false)}
        />
      )}
    </div>
  );
}
