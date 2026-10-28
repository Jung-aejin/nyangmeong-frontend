import {
  ChevronRight,
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
import Reveal from '@/components/Reveal';
import { PATHS } from '@/routes/paths';
import { GLASS_CARD } from './dashStyles';

const MISSION_TYPE = {
  meal: { name: '식사', Icon: Utensils },
  water: { name: '음수', Icon: Droplets },
  walk: { name: '산책', Icon: Footprints },
  medicine: { name: '약 복용', Icon: Pill },
  poop: { name: '배변', Icon: Toilet },
  play: { name: '놀이', Icon: Gamepad2 },
  etc: { name: '기타', Icon: Ellipsis },
};

export default function MissionList({ missions }) {
  return (
    <Reveal
      as="section"
      aria-labelledby="main-missions"
      className={`${GLASS_CARD} mt-6`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-line-soft px-[22px] py-[18px]">
        <h3 id="main-missions" className="text-lg font-bold tracking-[-0.01em]">
          데일리 케어미션
        </h3>
        <Link
          to={`${PATHS.HEALTH_CALENDAR}#c-care`}
          className="inline-flex items-center gap-0.5 text-sm font-semibold text-brand-600 hover:underline hover:underline-offset-[3px]"
        >
          토탈 케어리스트
          <ChevronRight className="size-[18px]" aria-hidden="true" />
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
                className={`absolute top-2 right-2 size-6 ${isDone ? 'text-ok' : 'text-line-strong'}`}
                aria-hidden="true"
              />
              <span
                className={`grid size-16 shrink-0 place-items-center rounded-full ${isDone ? 'bg-brand-50 text-brand-600' : 'bg-surface-3 text-subtle'}`}
              >
                <Icon
                  className="size-10"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </span>
              <span className="grow">
                <span className="block font-semibold">{name}</span>
                <span className="mt-1 block text-sm leading-[1.4] text-muted">
                  {text}
                  {isDone ? '' : ' (미완료)'}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </Reveal>
  );
}
