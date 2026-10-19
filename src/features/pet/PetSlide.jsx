import { Cat, ChevronLeft, ChevronRight, Dog, X } from 'lucide-react';
import { useState } from 'react';
import { PET_REL, PET_SE } from './petCodes';
import {
  formatAge,
  formatWeight,
  getColrName,
  getGndrName,
  getPetSeName,
  getVrtyName,
  splitList,
} from './petFormat';

// 알레르기·기저질환은 이 개수까지만 보이고 나머지는 [외 N개]로 접는다
const VISIBLE_LIST_COUNT = 2;

export default function PetSlide({
  pets,
  index,
  onMove,
  onEdit,
  onDelete,
  onUnlink,
}) {
  const pet = pets[index];

  return (
    <div>
      <div className="mb-3 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => onMove(index - 1)}
          disabled={index === 0}
          aria-label="이전 반려동물"
          className="rounded-full border p-1 disabled:opacity-30"
        >
          <ChevronLeft className="size-5" />
        </button>
        <span className="text-sm text-gray-600">
          반려동물 {index + 1} / {pets.length}
        </span>
        <button
          type="button"
          onClick={() => onMove(index + 1)}
          disabled={index === pets.length - 1}
          aria-label="다음 반려동물"
          className="rounded-full border p-1 disabled:opacity-30"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
      <PetCard
        key={pet.petSn}
        pet={pet}
        onEdit={onEdit}
        onDelete={onDelete}
        onUnlink={onUnlink}
      />
    </div>
  );
}

function PetCard({ pet, onEdit, onDelete, onUnlink }) {
  const isCoParent = pet.petRelCd === PET_REL.CO_PARENT;
  const gndrText = `${getGndrName(pet)}${pet.nutrYn === 'Y' ? ' (중성화)' : ''}`;

  return (
    <div className="grid gap-6 rounded-xl border p-6 md:grid-cols-[220px_1fr]">
      <div className="flex flex-col items-center gap-3 text-center">
        <PetFace pet={pet} />
        <p className="text-lg font-bold">{pet.petNm}</p>
        <div className="flex gap-1">
          {pet.rprsYn === 'Y' && <Badge className="bg-yellow-100">대표</Badge>}
          <Badge className={isCoParent ? 'bg-purple-100' : 'bg-blue-100'}>
            {isCoParent ? '공동양육' : '주양육'}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">
          {[
            getVrtyName(pet),
            formatAge(pet.petBrdt),
            getGndrName(pet),
            formatWeight(pet.petBdwg),
          ]
            .filter(Boolean)
            .join(' · ')}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(pet)}
            className="rounded-lg border px-3 py-1 text-sm"
          >
            수정
          </button>
          {isCoParent ? (
            <button
              type="button"
              onClick={() => onUnlink(pet)}
              className="rounded-lg border px-3 py-1 text-sm"
            >
              연동 해제
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onDelete(pet)}
              className="rounded-lg border px-3 py-1 text-sm text-red-600"
            >
              삭제
            </button>
          )}
        </div>
      </div>
      <div className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
        <dl className="space-y-3">
          <InfoRow label="종">{getPetSeName(pet)}</InfoRow>
          <InfoRow label="성별">{gndrText}</InfoRow>
          <InfoRow label="체중">{formatWeight(pet.petBdwg)}</InfoRow>
          <InfoRow label="털색">{getColrName(pet)}</InfoRow>
        </dl>
        <dl className="space-y-3">
          <InfoRow label="인식 번호">{pet.chipNo}</InfoRow>
          <InfoRow label="특징">{pet.chrcCn}</InfoRow>
          <ListRow label="알레르기" value={pet.algyCn} />
          <ListRow label="기저질환" value={pet.dssCn} />
        </dl>
      </div>
    </div>
  );
}

function PetFace({ pet }) {
  if (pet.chrcFaceUrl) {
    return (
      <img
        src={pet.chrcFaceUrl}
        alt={`${pet.petNm} 캐릭터`}
        className="size-28 rounded-full object-cover"
      />
    );
  }
  // 캐릭터 이미지 API(LJS)가 나오기 전과 캐릭터가 없는 동물은 종별 기본 얼굴을 쓴다
  const Icon = pet.petSeCd === PET_SE.CAT ? Cat : Dog;
  return (
    <div className="flex size-28 items-center justify-center rounded-full bg-gray-100">
      <Icon className="size-14 text-gray-500" />
    </div>
  );
}

function Badge({ className, children }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${className}`}
    >
      {children}
    </span>
  );
}

function InfoRow({ label, children }) {
  if (!children) return null;
  return (
    <div className="flex gap-3">
      <dt className="w-16 shrink-0 text-gray-500">{label}</dt>
      <dd className="break-all">{children}</dd>
    </div>
  );
}

function ListRow({ label, value }) {
  const [isOpen, setIsOpen] = useState(false);
  const items = splitList(value);
  if (items.length === 0) return null;

  const hiddenCount = items.length - VISIBLE_LIST_COUNT;

  return (
    <div className="flex gap-3">
      <dt className="w-16 shrink-0 text-gray-500">{label}</dt>
      <dd>
        {hiddenCount > 0 ? (
          <>
            {items.slice(0, VISIBLE_LIST_COUNT).join(', ')}{' '}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="text-blue-600 underline"
            >
              외 {hiddenCount}개
            </button>
          </>
        ) : (
          items.join(', ')
        )}
        {isOpen && (
          <ListLayer
            title={`${label} (${items.length})`}
            items={items}
            onClose={() => setIsOpen(false)}
          />
        )}
      </dd>
    </div>
  );
}

function ListLayer({ title, items, onClose }) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-xs rounded-xl bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold">{title}</h3>
          <button type="button" onClick={onClose} aria-label="닫기">
            <X className="size-5" />
          </button>
        </div>
        <ul className="list-disc space-y-1 pl-5">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
