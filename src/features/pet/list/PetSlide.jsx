import { Cat, ChevronLeft, ChevronRight, Dog, X } from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';
import { PET_REL, PET_SE } from '@/utils/petCodes';
import FamilySection from './FamilySection';
import {
  formatSpecies,
  formatWeight,
  getColrName,
  getGndrName,
  splitList,
} from '@/utils/petFormat';

/** 알레르기·기저질환 표시 개수 상한 */
const VISIBLE_LIST_COUNT = 2;

const NAV_BUTTON =
  'grid size-10 shrink-0 place-items-center rounded-full border border-line bg-white text-ink-2 hover:enabled:border-line-strong hover:enabled:text-ink disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-line-strong';
const CARD_BUTTON =
  'inline-flex h-10 items-center justify-center rounded-md border border-line bg-white px-4 font-semibold hover:bg-surface-2 hover:border-line-strong';

/** 좌우로 밀어서 넘기는 최소 이동 거리(px) */
const SWIPE_DISTANCE = 50;

/** action 자리: 카드 위 오른쪽 (등록 버튼) */
export default function PetSlide({
  pets,
  index,
  onMove,
  onEdit,
  onDelete,
  onUnlink,
  onInvite,
  action,
}) {
  const pet = pets[index];
  const touchStartX = useRef(null);

  /** 모바일: 카드를 좌우로 밀어 이전·다음 반려동물로 이동 */
  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (distance <= -SWIPE_DISTANCE && index < pets.length - 1) {
      onMove(index + 1);
    } else if (distance >= SWIPE_DISTANCE && index > 0) {
      onMove(index - 1);
    }
  };

  return (
    <section aria-label="반려동물 슬라이드">
      {action && <div className="mb-4 flex justify-end">{action}</div>}
      <div
        className="relative"
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0].clientX;
        }}
        onTouchEnd={handleTouchEnd}
      >
        <PetCard
          key={pet.petSn}
          pet={pet}
          onEdit={onEdit}
          onDelete={onDelete}
          onUnlink={onUnlink}
          onInvite={onInvite}
        >
          <nav
            aria-label="반려동물 선택"
            className="absolute inset-x-0 bottom-5 z-[1] flex justify-center gap-2"
          >
            {pets.map((dotPet, dotIndex) => (
              <button
                key={dotPet.petSn}
                type="button"
                onClick={() => onMove(dotIndex)}
                aria-label={`${dotIndex + 1}번째 반려동물`}
                aria-current={dotIndex === index ? 'true' : undefined}
                className={`h-2 rounded-full transition-[width] duration-200 ${dotIndex === index ? 'w-[22px] bg-brand-600' : 'w-2 bg-line-strong'}`}
              />
            ))}
          </nav>
        </PetCard>
        <button
          type="button"
          onClick={() => onMove(index - 1)}
          disabled={index === 0}
          aria-label="이전 반려동물"
          className={`${NAV_BUTTON} absolute top-1/2 -left-5 z-[2] -translate-y-1/2 shadow-depth-md disabled:shadow-none max-[760px]:hidden`}
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => onMove(index + 1)}
          disabled={index === pets.length - 1}
          aria-label="다음 반려동물"
          className={`${NAV_BUTTON} absolute top-1/2 -right-5 z-[2] -translate-y-1/2 shadow-depth-md enabled:border-brand-500 enabled:text-brand-600 hover:enabled:bg-brand-50 disabled:shadow-none max-[760px]:hidden`}
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </section>
  );
}

function PetCard({ pet, onEdit, onDelete, onUnlink, onInvite, children }) {
  const isCoParent = pet.petRelCd === PET_REL.CO_PARENT;
  const gndrText = `${getGndrName(pet)}${pet.nutrYn === 'Y' ? '(중성화 완료)' : ''}`;

  return (
    <article
      aria-labelledby="pet-name"
      className="relative grid gap-5 rounded-modal border border-line bg-white p-5 pb-16 shadow-depth-sm min-[761px]:grid-cols-[180px_minmax(0,1fr)] min-[761px]:gap-x-8 min-[761px]:gap-y-6 min-[761px]:px-8 min-[761px]:pt-6 min-[1101px]:grid-cols-[220px_minmax(0,1fr)] min-[1101px]:gap-x-14 min-[1101px]:px-12 min-[1101px]:pt-12"
    >
      <div className="flex flex-row items-end justify-between gap-5 min-[761px]:flex-col min-[761px]:items-center min-[761px]:justify-center">
        <PetFace pet={pet} />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(pet)}
            className={CARD_BUTTON}
          >
            수정
          </button>
          {isCoParent ? (
            <button
              type="button"
              onClick={() => onUnlink(pet)}
              className={CARD_BUTTON}
            >
              연동 해제
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onDelete(pet)}
              className={`${CARD_BUTTON} text-danger`}
            >
              삭제
            </button>
          )}
        </div>
      </div>
      <div className="flex min-w-0 flex-col">
        <h2
          id="pet-name"
          className="flex flex-wrap items-center gap-3 pb-4 text-xl font-bold tracking-[-0.02em] min-[761px]:text-page"
        >
          {pet.petNm}
          <span className="inline-flex flex-wrap gap-1 align-middle">
            {pet.rprsYn === 'Y' && (
              <Badge className="bg-brand-500 text-white">대표</Badge>
            )}
            {isCoParent ? (
              <Badge className="bg-tone-gray-bg text-tone-gray-fg">
                공동양육
              </Badge>
            ) : (
              <Badge className="bg-tone-green-bg text-tone-green-fg">
                주양육
              </Badge>
            )}
          </span>
        </h2>
        <div className="grid grid-cols-1 gap-x-12 min-[1281px]:grid-cols-[300px_minmax(0,1fr)]">
          <InfoGroup className="max-[1280px]:[&>div:last-child]:border-b">
            <InfoRow label="종">{formatSpecies(pet)}</InfoRow>
            <InfoRow label="성별">{gndrText}</InfoRow>
            <InfoRow label="체중">{formatWeight(pet.petBdwg)}</InfoRow>
            <InfoRow label="털색">{getColrName(pet)}</InfoRow>
          </InfoGroup>
          <InfoGroup className="max-[1280px]:border-t-0">
            <InfoRow label="인식 번호">{pet.chipNo}</InfoRow>
            <ChrcRow value={pet.chrcCn} />
            <ListRow label="알레르기" value={pet.algyCn} />
            <ListRow label="기저질환" value={pet.dssCn} />
          </InfoGroup>
        </div>
      </div>
      <FamilySection pet={pet} onInvite={onInvite} />
      {children}
    </article>
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
  /** 캐릭터 없을 때 종별 기본 얼굴 */
  const Icon = pet.petSeCd === PET_SE.CAT ? Cat : Dog;
  return (
    <div className="grid size-28 shrink-0 place-items-center rounded-full bg-surface-2 text-line-strong shadow-[inset_0_0_0_1px_var(--color-line-strong)]">
      <Icon className="size-14" />
    </div>
  );
}

function Badge({ className, children }) {
  return (
    <span
      className={`inline-flex h-6 items-center rounded-full px-2.5 pt-[1.5px] text-badge leading-none font-semibold whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  );
}

function InfoGroup({ className = '', children }) {
  return (
    <dl
      className={`m-0 grid min-w-0 grid-cols-[max-content_minmax(0,1fr)] content-start border-t border-line-strong ${className}`}
    >
      {children}
    </dl>
  );
}

const ROW =
  'col-span-full grid grid-cols-subgrid items-baseline gap-x-6 border-b border-line-soft py-4 last:border-b-0';
const DT = 'min-w-20 text-subtle';

function InfoRow({ label, children }) {
  return (
    <div className={ROW}>
      <dt className={DT}>{label}</dt>
      {children && (
        <dd className="m-0 font-semibold [overflow-wrap:anywhere]">
          {children}
        </dd>
      )}
    </div>
  );
}

/** 한 줄 초과 특징 말줄임·[더보기] */
function ChrcRow({ value }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false);
  const textRef = useRef(null);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return undefined;
    const check = () => setIsOverflow(el.scrollWidth > el.clientWidth);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div className={ROW}>
      <dt className={DT}>특징</dt>
      {value && (
        <dd className="relative m-0 flex min-w-0 items-baseline gap-2 font-semibold">
          <span ref={textRef} className="min-w-0 truncate">
            {value}
          </span>
          {isOverflow && (
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="shrink-0 font-semibold text-brand-600 underline underline-offset-3"
            >
              더보기
            </button>
          )}
          {isOpen && (
            <ListLayer
              title="특징"
              text={value}
              onClose={() => setIsOpen(false)}
            />
          )}
        </dd>
      )}
    </div>
  );
}

function ListRow({ label, value }) {
  const [isOpen, setIsOpen] = useState(false);
  const items = splitList(value);
  const hiddenCount = items.length - VISIBLE_LIST_COUNT;

  return (
    <div className={ROW}>
      <dt className={DT}>{label}</dt>
      {items.length > 0 && (
        <dd className="relative m-0 font-semibold [overflow-wrap:anywhere]">
          {hiddenCount > 0 ? (
            <>
              {items.slice(0, VISIBLE_LIST_COUNT).join(', ')}{' '}
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="font-semibold text-brand-600 underline underline-offset-3"
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
      )}
    </div>
  );
}

/** 바깥 클릭 닫힘용 투명 막 */
function ListLayer({ title, items, text, onClose }) {
  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div
        role="dialog"
        aria-label={`${title} 전체 ${text ? '내용' : '목록'}`}
        className="absolute top-[calc(100%+8px)] right-0 z-20 w-60 max-w-[calc(100vw-32px)] rounded-box border border-line bg-white py-2 font-normal shadow-depth-sm"
      >
        <div className="flex items-center justify-between border-b border-line-soft pt-1 pr-2 pb-2 pl-4 font-semibold">
          <span>{title}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="grid size-8 place-items-center rounded-box text-muted hover:bg-surface-3 hover:text-ink"
          >
            <X className="size-4" />
          </button>
        </div>
        {text ? (
          <p className="max-h-60 overflow-y-auto px-4 py-3 whitespace-pre-wrap [overflow-wrap:anywhere]">
            {text}
          </p>
        ) : (
          <ul>
            {items.map((item) => (
              <li key={item} className="px-4 py-2">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
