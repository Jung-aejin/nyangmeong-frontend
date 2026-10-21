import { Lightbulb } from 'lucide-react';
import { BTN_SECONDARY } from '@/components/buttonStyles';
import { CARD, CARD_HEAD, CARD_TITLE } from '../shared/pointStyles';

const STEPS = [
  { title: '케어미션 완료', desc: '미션마다 1~20P가 쌓여요' },
  { title: '검진기록 등록', desc: '검진기록을 등록하면 20P가 쌓여요' },
  { title: '자정에 자동 정산', desc: '미완료 미션은 진행률만큼 정산돼요' },
  { title: '아이템 상점에서 사용', desc: '픽셀 캐릭터를 꾸밀 수 있어요' },
];

export default function PointGuide({ onGoCharacter }) {
  return (
    <section aria-labelledby="point-guide-title" className={CARD}>
      <div className={CARD_HEAD}>
        <h2 id="point-guide-title" className={CARD_TITLE}>
          <Lightbulb className="size-5 text-brand-500" aria-hidden="true" />
          포인트는 이렇게 모여요
        </h2>
        <button type="button" onClick={onGoCharacter} className={BTN_SECONDARY}>
          픽셀 캐릭터로 이동
        </button>
      </div>
      <ol className="grid gap-5 px-6 py-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex items-start gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-box bg-brand-500 text-sm font-bold text-white">
              {String(index + 1).padStart(2, '0')}
            </span>
            <p className="text-sm text-muted">
              <b className="block text-base text-ink">{step.title}</b>
              {step.desc}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
