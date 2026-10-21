import { Plus, Receipt, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import MonthNav from '@/components/MonthNav';
import { formatYm, getCurrentYm, shiftYm } from '@/utils/yearMonth';
import { usePointHistory } from '../queries';
import { PNT_HST_TY } from '../shared/pointCodes';
import { formatSignedPoint } from '../shared/pointFormat';
import { CARD, CARD_HEAD, CARD_TITLE } from '../shared/pointStyles';

export default function PointHistory() {
  const maxYm = getCurrentYm();
  const [ym, setYm] = useState(maxYm);
  const { data } = usePointHistory(ym);

  if (!data) return null;

  return (
    <section
      id="point-history"
      aria-labelledby="point-history-title"
      className={`${CARD} flex flex-col`}
    >
      <div className={CARD_HEAD}>
        <h2 id="point-history-title" className={CARD_TITLE}>
          <Receipt className="size-5 text-brand-500" aria-hidden="true" />
          포인트 내역
        </h2>
        <MonthNav
          onPrev={() => setYm(shiftYm(ym, -1))}
          onNext={() => setYm(shiftYm(ym, 1))}
          isNextDisabled={ym >= maxYm}
        >
          <b className="min-w-28 text-center">{formatYm(ym)}</b>
        </MonthNav>
      </div>
      <div className="grid grid-cols-2 border-b border-line-soft text-muted">
        <div className="flex items-center justify-between px-6 py-3">
          <span>적립</span>
          <b className="text-brand-600">{formatSignedPoint(data.earnTotAmt)}</b>
        </div>
        <div className="flex items-center justify-between border-l border-line-soft px-6 py-3">
          <span>사용</span>
          <b className="text-ink">{formatSignedPoint(data.useTotAmt)}</b>
        </div>
      </div>
      {/* 목록 높이는 고정하고 넘치면 영역 안에서 스크롤 */}
      <ul
        tabIndex={0}
        aria-label={`${formatYm(ym)} 포인트 내역`}
        className="h-80 overflow-y-auto px-6 pt-1"
      >
        {data.items.length === 0 && (
          <li className="py-10 text-center text-subtle">
            이 달의 내역이 없어요
          </li>
        )}
        {data.items.map((item) => {
          const isUse = item.pntHstTyCd === PNT_HST_TY.USE;
          const Icon = isUse ? ShoppingBag : Plus;
          return (
            <li
              key={item.pntHstSn}
              className="flex items-center gap-3 border-t border-line-soft py-3 first:border-t-0"
            >
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-full border ${isUse ? 'border-line bg-surface-2 text-muted' : 'border-brand-100 bg-brand-50 text-brand-500'}`}
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1 font-semibold">
                {item.pntHstNm}
              </span>
              <b className={isUse ? 'text-ink-2' : 'text-brand-600'}>
                {formatSignedPoint(item.pntAmt)}
              </b>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
