import { ArrowDown, ArrowUp } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { GLASS_CARD } from './dashStyles';

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

export default function HealthWidget({
  title,
  period,
  value,
  unit,
  delta,
  deltaLabel,
  deltaUnit,
  motion,
  children,
}) {
  return (
    <Reveal
      as="section"
      {...motion}
      className={`${GLASS_CARD} flex flex-col px-8 py-5 hover:-translate-y-1 hover:border-brand-100 max-[700px]:p-4`}
    >
      <div className="flex min-h-8 items-center justify-between gap-2">
        <h3 className="font-semibold">{title}</h3>
        <span className="shrink-0 text-sm text-subtle">{period}</span>
      </div>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
        <p className="flex items-baseline gap-1">
          <b className="text-[34px] leading-none font-bold tracking-[-0.02em]">
            {value}
          </b>
          <span className="text-muted">{unit}</span>
        </p>
        <Delta label={deltaLabel} delta={delta} unit={deltaUnit} />
      </div>
      <div className="mt-auto pt-3">{children}</div>
    </Reveal>
  );
}
