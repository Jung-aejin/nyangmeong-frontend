import { Cat, Dog } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '@/components/Badge';
import { PATHS } from '@/routes/paths';
import { CHRC_STTS, PET_REL, PET_SE } from '@/utils/petCodes';
import { formatAge, getVrtyName } from '@/utils/petFormat';

/** 캐릭터를 만든 동물의 얼굴 바탕색 (순서대로 돌려 쓴다) */
const TONES = [
  'bg-tone-blue-bg',
  'bg-tone-rose-bg',
  'bg-tone-amber-bg',
  'bg-tone-violet-bg',
  'bg-tone-green-bg',
];

export default function PetMiniCard({ pet, index }) {
  const Icon = pet.petSeCd === PET_SE.CAT ? Cat : Dog;
  const isDone = pet.chrcSttsCd === CHRC_STTS.DONE;
  const isError = pet.chrcSttsCd === CHRC_STTS.ERROR;

  return (
    <Link
      to={PATHS.MYPAGE_PETS}
      state={{ petSn: pet.petSn }}
      className="group flex min-w-0 flex-1 items-center gap-4 rounded-card border border-line bg-white p-4 shadow-[0_1px_2px_rgba(26,50,52,0.04)] hover:border-brand-100 hover:shadow-depth-sm"
    >
      <span
        className={`relative grid size-16 shrink-0 place-items-center rounded-full ${
          isDone
            ? `${TONES[index % TONES.length]} text-brand-500`
            : 'bg-surface-2 text-line-strong shadow-[inset_0_0_0_1px_var(--color-line-strong)]'
        }`}
      >
        {isDone && pet.chrcFaceUrl ? (
          <img
            src={pet.chrcFaceUrl}
            alt=""
            className="size-full rounded-full object-cover"
          />
        ) : (
          <Icon className={`size-7 ${isError ? 'opacity-55 grayscale' : ''}`} />
        )}
        {pet.rprsYn === 'Y' && (
          <span className="absolute -right-1.5 -bottom-1 inline-flex h-6 items-center rounded-full bg-brand-500 px-2.5 pt-[1.5px] text-[13px] leading-none font-semibold whitespace-nowrap text-white ring-2 ring-white">
            대표
          </span>
        )}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="flex flex-wrap items-center gap-2 text-lg font-bold group-hover:text-brand-600">
          {pet.petNm}
          {pet.petRelCd === PET_REL.CO_PARENT && <Badge>공동양육</Badge>}
          {isError && <Badge tone="amber">오류 확인 중</Badge>}
        </span>
        <span className="text-sm text-subtle">
          {getVrtyName(pet)} · {formatAge(pet.petBrdt)}
        </span>
      </span>
    </Link>
  );
}
