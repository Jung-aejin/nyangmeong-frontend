import { useId } from 'react';
import useElementWidth from './useElementWidth';

/** 색은 시안 nyangmung-chart.css 값 */
const COLORS = {
  brand: '#285a5c',
  brandInk: '#1e4a4c',
  brandLine: '#cde0e0',
  ok: '#2f6f57',
  danger: '#b4473a',
  area: '#d9e8de',
  range: '#9fc9b0',
  lineSoft: '#edf1f1',
  line: '#e2e7e7',
  subtle: '#667374',
  white: '#fff',
};

/** 단조 3차 보간의 점별 기울기 */
const getSlopes = (points) => {
  const count = points.length;
  const diffs = [];
  for (let i = 0; i < count - 1; i += 1) {
    diffs.push(
      (points[i + 1][1] - points[i][1]) / (points[i + 1][0] - points[i][0]),
    );
  }
  const slopes = [diffs[0]];
  for (let i = 1; i < count - 1; i += 1) {
    slopes.push(
      diffs[i - 1] * diffs[i] <= 0 ? 0 : (diffs[i - 1] + diffs[i]) / 2,
    );
  }
  slopes.push(diffs[count - 2]);
  return slopes;
};

/** 구간 i → i+1의 곡선 경로. 점이 2개면 직선 */
const getSegmentPath = (points, slopes, i) => {
  const [x0, y0] = points[i];
  const [x1, y1] = points[i + 1];
  if (points.length === 2) return `M${x0} ${y0}L${x1} ${y1}`;
  const handle = (x1 - x0) / 3;
  return `M${x0} ${y0}C${x0 + handle} ${y0 + slopes[i] * handle} ${x1 - handle} ${y1 - slopes[i + 1] * handle} ${x1} ${y1}`;
};

/** 전체 곡선 경로 */
const getCurvePath = (points, slopes) => {
  if (points.length < 3) {
    return `M${points.map(([x, y]) => `${x} ${y}`).join('L')}`;
  }
  let path = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    path += getSegmentPath(points, slopes, i).replace(/^M[^C]*/, '');
  }
  return path;
};

/**
 * [곡선 선그래프]
 * - 시안 nyangmung-chart.js의 nmCurveChart와 같은 모양: 곡선 + 연한 그라데이션, 범위는 점선 + 오른쪽 라벨, 최근 값은 말풍선
 * - points: [{ label, value }] 2개 이상, band: [최소, 최대], goal: 목표, formatValue: 말풍선 값, formatTag: 범위 라벨 값
 */
export default function LineChart({
  points,
  band,
  goal,
  formatValue,
  formatTag = String,
  height,
  ariaLabel,
}) {
  const [ref, width] = useElementWidth();

  return (
    <div ref={ref} className="w-full">
      {width > 0 && (
        <Chart
          width={width}
          height={height ?? (width < 600 ? 230 : 260)}
          points={points}
          band={band}
          goal={goal}
          formatValue={formatValue}
          formatTag={formatTag}
          ariaLabel={ariaLabel}
        />
      )}
    </div>
  );
}

function Chart({
  width,
  height,
  points,
  band,
  goal,
  formatValue,
  formatTag,
  ariaLabel,
}) {
  const gradientId = useId();
  const values = points.map((point) => point.value);
  const count = values.length;
  const isSmall = width < 600;
  const hasTag = band != null || goal != null;
  const left = isSmall ? 40 : 56;
  const right = hasTag ? (isSmall ? 76 : 92) : isSmall ? 12 : 24;
  const top = 52;
  const bottom = 34;
  const pad = isSmall ? 16 : 28;

  const refs = [...values, ...(band ?? []), ...(goal != null ? [goal] : [])];
  const minRef = Math.min(...refs);
  const maxRef = Math.max(...refs);
  const margin = (maxRef - minRef) * (band ? 0.3 : 0.6) || 1;
  const min = minRef - margin;
  const max = maxRef + margin;

  const getX = (i) =>
    left + pad + (i * (width - left - right - 2 * pad)) / (count - 1);
  const getY = (value) =>
    top + ((max - value) * (height - top - bottom)) / (max - min);
  const isOut = (value) => band != null && (value < band[0] || value > band[1]);

  const coords = values.map((value, i) => [getX(i), getY(value)]);
  const slopes = getSlopes(coords);
  const curve = getCurvePath(coords, slopes);
  const [lastX, lastY] = coords[count - 1];
  const lastValue = values[count - 1];
  const lastLabel = formatValue(lastValue);
  const tipWidth = Math.max(52, lastLabel.length * 9 + 24);
  const tipX = Math.min(lastX, width - right - tipWidth / 2 + 4);
  const tipY = lastY - 48;
  const tagWidth = right - 12;

  const rangeLine = (value, text, isGoal) => (
    <g key={text}>
      <path
        d={`M${left} ${getY(value)}H${width - right}`}
        fill="none"
        stroke={isGoal ? COLORS.brand : COLORS.range}
        strokeWidth="1.5"
        strokeDasharray={isGoal ? '2 4' : '6 5'}
      />
      <rect
        x={width - right + 8}
        y={getY(value) - 11}
        width={tagWidth}
        height={22}
        rx={11}
        fill={COLORS.white}
        stroke={COLORS.line}
      />
      <text
        x={width - right + 8 + tagWidth / 2}
        y={getY(value) + 5}
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill={isGoal ? COLORS.brandInk : COLORS.ok}
      >
        {text}
      </text>
    </g>
  );

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      role="img"
      aria-label={ariaLabel}
      className="block h-auto"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={COLORS.area} stopOpacity="0.7" />
          <stop offset="1" stopColor={COLORS.area} stopOpacity="0" />
        </linearGradient>
      </defs>

      {band &&
        [band[1], band[0]].map((value) => (
          <g key={value}>
            <path
              d={`M${left} ${getY(value)}H${width - right}`}
              stroke={COLORS.lineSoft}
              strokeWidth="1"
            />
            <text
              x={left - 10}
              y={getY(value) + 5}
              textAnchor="end"
              fontSize="14"
              fill={COLORS.subtle}
            >
              {formatTag(value)}
            </text>
          </g>
        ))}
      <path
        d={`M${left} ${height - bottom}H${width - right}`}
        stroke={COLORS.line}
        strokeWidth="1"
      />

      {band && rangeLine(band[1], `최대 ${formatTag(band[1])}`)}
      {band && rangeLine(band[0], `최소 ${formatTag(band[0])}`)}
      {goal != null && rangeLine(goal, `목표 ${formatTag(goal)}`, true)}

      <path
        d={`${curve}L${lastX} ${height - bottom}L${coords[0][0]} ${height - bottom}Z`}
        fill={`url(#${gradientId})`}
      />
      <path
        d={curve}
        fill="none"
        stroke={COLORS.brand}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {band &&
        values
          .slice(0, -1)
          .map((value, i) =>
            isOut(value) || isOut(values[i + 1]) ? (
              <path
                key={points[i].label + i}
                d={getSegmentPath(coords, slopes, i)}
                fill="none"
                stroke={COLORS.danger}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null,
          )}

      <path
        d={`M${lastX} ${lastY + 10}V${height - bottom}`}
        stroke={COLORS.brandLine}
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
      {coords.slice(0, -1).map(([x, y], i) => (
        <circle
          key={points[i].label + i}
          cx={x}
          cy={y}
          r="4.5"
          fill={COLORS.white}
          stroke={isOut(values[i]) ? COLORS.danger : COLORS.brand}
          strokeWidth="2.5"
        />
      ))}
      <circle cx={lastX} cy={lastY} r="11" fill={COLORS.brand} opacity="0.15" />
      <circle
        cx={lastX}
        cy={lastY}
        r="6"
        fill={isOut(lastValue) ? COLORS.danger : COLORS.brand}
        stroke={COLORS.white}
        strokeWidth="3"
      />

      <g style={{ filter: 'drop-shadow(0 4px 8px rgba(30,74,76,.14))' }}>
        <rect
          x={tipX - tipWidth / 2}
          y={tipY}
          width={tipWidth}
          height={30}
          rx={15}
          fill={COLORS.white}
          stroke={COLORS.brand}
          strokeWidth="1.5"
        />
        <path
          d={`M${lastX - 5} ${tipY + 30}L${lastX} ${tipY + 36}L${lastX + 5} ${tipY + 30}Z`}
          fill={COLORS.brand}
        />
        <text
          x={tipX}
          y={tipY + 20}
          textAnchor="middle"
          fontSize="15"
          fontWeight="700"
          fill={COLORS.brandInk}
        >
          {lastLabel}
        </text>
      </g>

      {points.map((point, i) => (
        <text
          key={point.label + i}
          x={coords[i][0]}
          y={height - 8}
          textAnchor="middle"
          fontSize="14"
          fill={COLORS.subtle}
        >
          {point.label}
        </text>
      ))}
    </svg>
  );
}
