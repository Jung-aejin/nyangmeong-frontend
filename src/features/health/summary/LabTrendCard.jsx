import { useSyncExternalStore } from 'react';
import Card from '@/components/Card';
import Icon from '@/components/Icon';
import { formatDate } from '@/utils/formatDate';
import LineChart from '../diary/LineChart';
import { SELECT_ARROW_STYLE, SELECT_CLASS } from '../diary/formStyles';
import { CardTitle, SummaryEmpty } from './SummaryParts';
import { formatRange, getFunctionTagName } from './summaryUtils';

/**
 * [검사 수치 추이] (FN-HLT-011-07)
 * - 선택 항목의 시계열 선그래프, 참고범위는 배경 영역으로만 표기하고 이탈 판정 없음
 * - 기록이 1건이면 그래프 대신 값·참고범위만, 안내 문구는 항상 표시
 * - 모바일(640px 미만)은 머리 오른쪽에 "최근 n회", 항목 선택창은 본문 맨 위 전체 폭 (추가 요청)
 * - 모바일 그래프는 오른쪽 최대·최소 라벨 없이 왼쪽 눈금을 상한·하한으로 (추가 요청)
 */
export default function LabTrendCard({
  trends,
  itemNames,
  selectedNm,
  onSelect,
}) {
  const trend = trends[selectedNm];
  const sub =
    trend && (trend.points.length >= 2 ? `최근 ${trend.points.length}회` : '기록 1건');
  const itemSelect = (className) => (
    <select
      aria-label="검사 항목 선택"
      value={selectedNm}
      className={`${SELECT_CLASS} ${className}`}
      style={SELECT_ARROW_STYLE}
      onChange={(event) => onSelect(event.target.value)}
    >
      {itemNames.map((name) => (
        <option key={name} value={name}>
          [{getFunctionTagName(trends[name].fnctTagCd)}] {name}
        </option>
      ))}
    </select>
  );

  return (
    <Card
      title={<CardTitle icon="trending_up">검사 수치 추이</CardTitle>}
      sub={sub && <span className="max-sm:hidden">{sub}</span>}
      action={
        trend && (
          <>
            {itemSelect('w-auto! min-w-36 max-sm:hidden')}
            <span className="shrink-0 text-sm/[1.6] font-medium whitespace-nowrap text-subtle sm:hidden">
              {sub}
            </span>
          </>
        )
      }
      className="h-full"
    >
      {trend && <div className="mb-4 sm:hidden">{itemSelect('w-full')}</div>}
      {trend ? (
        <TrendBody trend={trend} />
      ) : (
        <SummaryEmpty
          icon="trending_up"
          description="검진상세에서 검사 수치를 넣으면 변화를 볼 수 있어요"
        />
      )}
    </Card>
  );
}

/** Tailwind sm 미만(640px)인지. 그래프는 SVG라 클래스로 나눌 수 없어 화면 폭을 직접 본다 */
const MOBILE_QUERY = '(max-width: 639.98px)';
const subscribeMobile = (onChange) => {
  const media = window.matchMedia(MOBILE_QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};
const getIsMobile = () => window.matchMedia(MOBILE_QUERY).matches;

function TrendBody({ trend }) {
  const { points, unitNm, refMinVal, refMaxVal } = trend;
  const isMobile = useSyncExternalStore(subscribeMobile, getIsMobile);
  const hasBand = refMinVal != null && refMaxVal != null;
  const range = formatRange(refMinVal, refMaxVal, '~');

  return (
    <>
      {points.length >= 2 ? (
        <LineChart
          points={points.map((point) => ({
            label: formatDate(point.ckupYmd),
            value: point.rsltVal,
          }))}
          band={hasBand ? [refMinVal, refMaxVal] : undefined}
          bandLabelSide={isMobile ? 'left' : 'right'}
          formatValue={(value) => `${value} ${unitNm}`}
          ariaLabel={`${trend.inspItmNm} 수치 변화 선그래프 · 참고범위 ${range} · ${points
            .map((point) => `${formatDate(point.ckupYmd)} ${point.rsltVal}`)
            .join(' → ')} ${unitNm}`}
        />
      ) : (
        <div className="flex flex-col items-center gap-1 rounded-xl bg-surface-2 px-4 py-6">
          <span className="text-sm/[1.6] text-subtle">
            {formatDate(points[0].ckupYmd)}
          </span>
          <span className="text-lg/[1.6] font-bold">
            {points[0].rsltVal} {unitNm}
          </span>
          <span className="text-sm/[1.6] text-subtle">참고범위 {range}</span>
        </div>
      )}
      <p className="mt-4 flex items-start gap-1.5 text-subtle">
        <Icon name="info" className="text-xl" />
        <span>
          참고범위는 검사 기관·장비마다 다를 수 있어요. 수치의 의미는 담당
          수의사와 상담하세요.
        </span>
      </p>
    </>
  );
}
