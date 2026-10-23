import { Cat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BTN_PRIMARY } from '@/components/buttonStyles';
import { PATHS } from '@/routes/paths';

/** 주양육·공동양육 어느 쪽으로도 연결된 동물이 없을 때 (FN-MYP-010-22) */
export default function CharacterEmpty() {
  return (
    <section className="rounded-card border border-line bg-white shadow-sm">
      <div className="flex flex-col items-center gap-2.5 px-6 py-16 text-center text-muted">
        <span className="mb-2 grid size-32 place-items-center rounded-xl bg-brand-50 text-brand-500">
          <Cat className="size-16" aria-hidden="true" />
        </span>
        <p className="text-lg font-bold text-ink">
          내 반려동물의 픽셀 캐릭터를 만들어보세요
        </p>
        <p>반려동물을 등록하면 캐릭터를 만들 수 있어요</p>
        <Link to={PATHS.MYPAGE_PETS} className={`${BTN_PRIMARY} mt-3`}>
          반려동물 등록하기
        </Link>
      </div>
    </section>
  );
}
