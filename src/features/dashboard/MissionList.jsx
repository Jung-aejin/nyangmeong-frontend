import {
  Circle,
  CircleCheck,
  Droplets,
  Ellipsis,
  Footprints,
  Gamepad2,
  Pill,
  Toilet,
  Utensils,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

const MISSION_TYPE = {
  meal: { name: '식사', Icon: Utensils },
  water: { name: '음수', Icon: Droplets },
  walk: { name: '산책', Icon: Footprints },
  medicine: { name: '약 복용', Icon: Pill },
  poop: { name: '배변', Icon: Toilet },
  play: { name: '놀이', Icon: Gamepad2 },
  etc: { name: '기타', Icon: Ellipsis },
};

// 보기 전용이다. 체크는 건강기록에서 한다
export default function MissionList({ missions }) {
  return (
    <section
      aria-labelledby="main-missions"
      className="mt-6 rounded-card border border-line bg-white shadow-depth-sm"
    >
      <div className="flex items-center justify-between gap-3 px-6 pt-5">
        <h3 id="main-missions" className="text-lg font-bold">
          데일리 케어미션
        </h3>
        <Link
          to={`${PATHS.HEALTH_CALENDAR}#c-care`}
          className="text-sm text-muted hover:text-brand-600"
        >
          토탈 케어리스트 &gt;
        </Link>
      </div>
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3 px-6 py-8 max-[700px]:grid-cols-2 max-[700px]:px-4">
        {missions.map(({ type, text, isDone }) => {
          const { name, Icon } = MISSION_TYPE[type];
          const Mark = isDone ? CircleCheck : Circle;
          return (
            <li
              key={type}
              className="relative flex flex-col items-center justify-center gap-2 rounded-box bg-surface-2 px-2 pt-5 pb-4 text-center"
            >
              <Mark
                className={`absolute top-2 right-2 size-6 ${isDone ? 'text-tone-green-fg' : 'text-line-strong'}`}
                aria-hidden="true"
              />
              <span
                className={`grid size-16 place-items-center rounded-full ${isDone ? 'bg-brand-50 text-brand-600' : 'bg-surface-3 text-subtle'}`}
              >
                <Icon className="size-8" aria-hidden="true" />
              </span>
              <span className="block font-semibold">{name}</span>
              <span className="block text-sm leading-snug text-muted">
                {text}
                {isDone ? '' : ' (미완료)'}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
