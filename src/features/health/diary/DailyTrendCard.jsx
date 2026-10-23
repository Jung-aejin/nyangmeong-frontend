import { useState } from 'react';
import Card from '@/components/Card';
import { BTN_SECONDARY } from '@/components/buttonStyles';
import { formatMonthDayDot } from '@/utils/formatDate';
import {
  RECORD_TYPES,
  STOOL,
  WALK,
  WEIGHT,
  findRecordType,
  findStoolState,
} from '../diaryTypes';
import BarChart from './BarChart';
import CountBars from './CountBars';
import EmptyBox from './EmptyBox';
import LineChart from './LineChart';
import {
  RECENT_RECORD_COUNT,
  formatAmount,
  getStoolCounts,
  getTrendPoints,
  pickType,
} from './recordUtils';

/**
 * [건강기록 변화 카드]
 * - 지표 탭 5종 단일 선택, 최근 14개 기록 기준 그래프 (FN-HLT-002-09·10)
 * - 0건·1건은 그래프 대신 안내
 */
export default function DailyTrendCard({ pet, records, onAddRecord }) {
  const [typeCd, setTypeCd] = useState(WEIGHT);
  const type = findRecordType(typeCd);

  return (
    <Card
      title="건강기록 변화"
      sub={<span className="text-sm">최근 {RECENT_RECORD_COUNT}개 기록</span>}
      className="min-w-0"
    >
      <div
        role="radiogroup"
        aria-label="지표 선택"
        className="mb-4 flex flex-wrap gap-2"
      >
        {RECORD_TYPES.map((item) => {
          const isSelected = item.cd === typeCd;
          return (
            <button
              key={item.cd}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`inline-flex h-9 items-center rounded-full border px-3.5 ${
                isSelected
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-line bg-white text-ink-2 hover:border-line-strong hover:text-ink'
              }`}
              onClick={() => setTypeCd(item.cd)}
            >
              {item.tabNm}
            </button>
          );
        })}
      </div>

      <TrendBody
        pet={pet}
        records={records}
        type={type}
        onAddRecord={onAddRecord}
      />
    </Card>
  );
}

function TrendBody({ pet, records, type, onAddRecord }) {
  const emptyBox = (
    <EmptyBox
      icon="monitoring"
      title={`아직 ${type.nm} 기록이 없어요`}
      description="오늘 기록을 남기면 변화가 그래프로 보여요"
      action={
        <button
          type="button"
          className={`${BTN_SECONDARY} mt-2 h-8! px-3!`}
          onClick={() => onAddRecord(type.cd)}
        >
          오늘 기록추가
        </button>
      }
    />
  );

  if (type.cd === STOOL) {
    const { recordCount, counts } = getStoolCounts(records);
    if (recordCount === 0) return emptyBox;
    if (recordCount === 1) {
      const [only] = pickType(records, STOOL);
      return (
        <OneRecord
          ymd={only.rcdYmd}
          value={findStoolState(only.stlSttsCd).nm}
        />
      );
    }
    return <CountBars counts={counts} total={recordCount} />;
  }

  const { recordCount, points } = getTrendPoints(records, type.cd);
  if (recordCount === 0) return emptyBox;
  if (points.length === 1) {
    return (
      <OneRecord
        ymd={points[0].ymd}
        value={formatAmount(type.cd, points[0].value)}
      />
    );
  }

  const chartPoints = points.map((point) => ({
    label: formatMonthDayDot(point.ymd),
    value: point.value,
  }));
  const summary = points
    .map((point) => formatAmount(type.cd, point.value))
    .join(' → ');

  if (type.cd === WALK) {
    return (
      <BarChart
        points={chartPoints}
        formatValue={(value) => formatAmount(WALK, value)}
        ariaLabel={`산책 시간 막대그래프 · ${summary} · 점선은 하루 평균`}
      />
    );
  }

  const isWeight = type.cd === WEIGHT;
  return (
    <LineChart
      points={chartPoints}
      band={isWeight ? [pet.nrmlWghtMinVal, pet.nrmlWghtMaxVal] : undefined}
      goal={isWeight ? pet.goalWghtVal : undefined}
      formatValue={(value) => formatAmount(type.cd, value)}
      formatTag={(value) => value.toFixed(1)}
      ariaLabel={`${type.nm} 변화 선그래프 · ${summary}`}
    />
  );
}

function OneRecord({ ymd, value }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-[10px] bg-surface-2 px-4 py-6">
      <span className="text-sm/[1.6] text-subtle tabular-nums">
        {formatMonthDayDot(ymd)} 기록
      </span>
      <span className="text-lg/[1.6] font-bold text-ink tabular-nums">
        {value}
      </span>
      <span className="text-sm/[1.6] text-subtle">
        기록이 2개 이상 쌓이면 그래프로 보여요
      </span>
    </div>
  );
}
