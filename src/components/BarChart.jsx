const W = 480;
const H = 200;
const PAD = { top: 32, bottom: 34, right: 40 };

// 막대 위에 값을, 전체에 걸쳐 평균선을 그린다. 평균 글자 자리로 오른쪽 40px를 비운다
export default function BarChart({ values, labels, label }) {
  const max = Math.max(60, ...values);
  const baseY = H - PAD.bottom;
  const step = (W - PAD.right) / values.length;
  const barWidth = Math.min(step * 0.56, 56);
  const y = (v) => PAD.top + ((max - v) * (baseY - PAD.top)) / max;
  const average = values.reduce((sum, v) => sum + v, 0) / values.length;
  const lastIndex = values.length - 1;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={label}
      className="block h-auto w-full"
    >
      <path d={`M0 ${baseY}H${W}`} className="stroke-line" fill="none" />
      {values.map((v, i) => {
        const cx = step * i + step / 2;
        return (
          <g key={labels[i]}>
            <rect
              x={cx - barWidth / 2}
              y={y(v)}
              width={barWidth}
              height={baseY - y(v)}
              rx="3"
              className={i === lastIndex ? 'fill-brand-500' : 'fill-brand-100'}
            />
            <text
              x={cx}
              y={y(v) - 8}
              textAnchor="middle"
              className="fill-ink text-sm font-semibold"
            >
              {v}
            </text>
            <text
              x={cx}
              y={H - 8}
              textAnchor="middle"
              className="fill-subtle text-sm"
            >
              {labels[i]}
            </text>
          </g>
        );
      })}
      <path
        d={`M0 ${y(average)}H${W}`}
        className="stroke-brand-500"
        strokeDasharray="4 4"
        fill="none"
      />
      <text
        x={W}
        y={y(average) - 8}
        textAnchor="end"
        className="fill-brand-600 text-sm font-semibold"
      >
        평균
      </text>
    </svg>
  );
}
