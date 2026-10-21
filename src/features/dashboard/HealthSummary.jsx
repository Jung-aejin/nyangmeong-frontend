import { CalendarDays, FlaskConical, Pill } from 'lucide-react';
import { LAB_RANGE } from './dashboardSample';

function Stat({ icon, label, value, unit, sub }) {
  return (
    <div className="flex flex-col gap-1 p-5 max-[700px]:border-t max-[700px]:border-line first:max-[700px]:border-t-0 min-[701px]:border-l min-[701px]:border-line first:min-[701px]:border-l-0">
      <span className="flex items-center gap-1 text-sm text-muted">
        {icon}
        {label}
      </span>
      <span className="text-2xl font-bold">
        {value}
        <small className="ml-0.5 text-sm font-normal text-muted">{unit}</small>
      </span>
      <span className="text-sm text-subtle">{sub}</span>
    </div>
  );
}

// 프로필 옆 요약 3칸: 최근 검진 · 검사 수치(CREA) · 현재 처방
export default function HealthSummary({ exam, lab, rx }) {
  return (
    <div className="grid grid-cols-3 max-[700px]:grid-cols-1">
      <Stat
        icon={<CalendarDays className="size-4" aria-hidden="true" />}
        label="최근 검진"
        value={exam.dayCount}
        unit="일 전"
        sub={exam.text}
      />
      <Stat
        icon={<FlaskConical className="size-4" aria-hidden="true" />}
        label="검사 수치 · CREA"
        value={lab.value}
        unit="mg/dL"
        sub={`참고범위 ${LAB_RANGE[0]}~${LAB_RANGE[1]}`}
      />
      <Stat
        icon={<Pill className="size-4" aria-hidden="true" />}
        label="현재 처방"
        value={rx.count}
        unit="건"
        sub={rx.text}
      />
    </div>
  );
}
