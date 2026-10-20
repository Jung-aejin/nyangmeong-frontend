import { ArrowDown, ArrowUp } from 'lucide-react';

// 증감 한 칸. 변화가 없으면(0) 화살표와 수치를 그리지 않는다
function Delta({ label, delta, unit }) {
  const Arrow = delta > 0 ? ArrowUp : ArrowDown;
  const amount = Math.abs(Math.round(delta * 10) / 10);

  return (
    <p className="flex items-center gap-2 text-sm">
      <span className="text-subtle">{label}</span>
      <b className="inline-flex h-[26px] items-center gap-0.5 rounded-full bg-surface-2 px-2.5 font-semibold text-ink-2">
        {delta === 0 ? (
          '변화 없음'
        ) : (
          <>
            <Arrow className="size-4" aria-hidden="true" />
            <span className="sr-only">{delta > 0 ? '증가 ' : '감소 '}</span>
            {amount}
            {unit}
          </>
        )}
      </b>
    </p>
  );
}

// 머리(제목 | 기간) → 요약(큰 숫자 | 증감) → 그래프
export default function HealthWidget({
  title,
  period,
  value,
  unit,
  delta,
  deltaLabel,
  deltaUnit,
  children,
}) {
  return (
    <section className="flex flex-col rounded-card border border-line bg-white px-8 py-5 shadow-depth-sm max-[700px]:p-4">
      <div className="flex min-h-8 items-center justify-between gap-2">
        <h3 className="font-semibold">{title}</h3>
        <span className="shrink-0 text-sm text-subtle">{period}</span>
      </div>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
        <p className="flex items-baseline gap-1">
          <b className="text-[32px] leading-none font-bold tracking-[-0.02em]">
            {value}
          </b>
          <span className="text-muted">{unit}</span>
        </p>
        <Delta label={deltaLabel} delta={delta} unit={deltaUnit} />
      </div>
      <div className="mt-auto pt-3">{children}</div>
    </section>
  );
}
