import { Cat, Dog } from 'lucide-react';
import { PET_SE } from './petCodes';
import {
  formatAge,
  formatWeight,
  getGndrName,
  getVrtyName,
  splitList,
} from './petFormat';

const TAG = 'rounded-full border border-line px-2 py-0.5 text-xs font-semibold';

export default function PetProfileCard({ pet }) {
  const Icon = pet.petSeCd === PET_SE.CAT ? Cat : Dog;
  const meta = [getVrtyName(pet), formatAge(pet.petBrdt), getGndrName(pet)]
    .filter(Boolean)
    .join(' · ');
  const allergyCount = splitList(pet.algyCn).length;
  const diseaseCount = splitList(pet.dssCn).length;

  return (
    <div className="flex items-start gap-4 p-5">
      {pet.chrcFaceUrl ? (
        <img
          src={pet.chrcFaceUrl}
          alt={`${pet.petNm} 캐릭터`}
          className="size-20 shrink-0 rounded-card object-cover"
        />
      ) : (
        <div className="grid size-20 shrink-0 place-items-center rounded-card bg-surface-2 text-line-strong">
          <Icon className="size-10" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xl leading-none font-bold">{pet.petNm}</p>
        <p className="mt-1 text-muted">{meta}</p>
        <div className="mt-2 flex flex-wrap gap-1 text-ink-2">
          {pet.petBdwg != null && (
            <span className={TAG}>{formatWeight(pet.petBdwg)}</span>
          )}
          {allergyCount > 0 && (
            <span className={TAG}>알레르기 {allergyCount}</span>
          )}
          {diseaseCount > 0 && (
            <span className={TAG}>기저질환 {diseaseCount}</span>
          )}
        </div>
      </div>
    </div>
  );
}
