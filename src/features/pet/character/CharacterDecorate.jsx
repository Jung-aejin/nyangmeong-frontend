import { X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BTN_PRIMARY, BTN_SECONDARY } from '@/components/buttonStyles';
import { showToast } from '@/components/toastStore';
import { PATHS } from '@/routes/paths';
import { useCharacterItems, useUpdateCharacterWear } from '../queries';
import { ITEM_PART } from '../shared/petCodes';
import ItemStorage from './ItemStorage';
import WearPreview from './WearPreview';

const SLOT_NAMES = {
  [ITEM_PART.HEAD]: '머리',
  [ITEM_PART.FACE]: '얼굴',
  [ITEM_PART.NECK]: '목',
  [ITEM_PART.CLOTHES]: '의상',
  [ITEM_PART.BAG]: '가방',
};

/** 서버 아이템 목록 → { 부위: 착용 중인 아이템 } */
const toWorn = (items) =>
  Object.fromEntries(
    items
      .filter((item) => item.wearYn === 'Y')
      .map((item) => [item.itemPartCd, item]),
  );

/**
 * [꾸미기] (FN-MYP-010-13~16·24)
 * - draft: 저장 전 착용 상태. null이면 서버에 저장된 상태 그대로
 * - [되돌리기]는 draft를 버려 진입 시점(저장된) 상태로, [장착]은 draft를 저장
 */
export default function CharacterDecorate({ pet }) {
  const { data: items = [], isPending } = useCharacterItems(pet.petSn);
  const { mutate: saveWear, isPending: isSaving } = useUpdateCharacterWear();
  const [draft, setDraft] = useState(null);

  const worn = draft ?? toWorn(items);

  const toggle = (item) => {
    const next = { ...worn };
    /** 같은 아이템을 다시 누르면 해제, 같은 부위의 다른 아이템이면 교체 */
    if (next[item.itemPartCd]?.itemSn === item.itemSn) {
      delete next[item.itemPartCd];
    } else {
      next[item.itemPartCd] = item;
    }
    setDraft(next);
  };

  const release = (part) => {
    const next = { ...worn };
    delete next[part];
    setDraft(next);
  };

  const handleSave = () => {
    saveWear(
      {
        petSn: pet.petSn,
        itemSns: Object.values(worn).map((item) => item.itemSn),
      },
      {
        onSuccess: () => {
          setDraft(null);
          showToast('착용 상태를 저장했어요');
        },
        onError: () =>
          showToast('저장하지 못했어요. 잠시 뒤 다시 시도해 주세요'),
      },
    );
  };

  const slot = (part) => (
    <Slot
      name={SLOT_NAMES[part]}
      item={worn[part]}
      onRelease={() => release(part)}
    />
  );

  if (isPending) return null;

  return (
    <>
      <div className="flex justify-end">
        {pet.inqryRcptYn === 'Y' ? (
          <button type="button" disabled className={BTN_SECONDARY}>
            문의 접수됨
          </button>
        ) : (
          <Link
            to={PATHS.INQUIRY_NEW}
            state={{
              inquiryType: 'PIXEL_CHARACTER',
              petSn: pet.petSn,
              imageUrl: pet.chrcImgUrl,
            }}
            className={BTN_SECONDARY}
          >
            오류 문의
          </Link>
        )}
      </div>
      <div className="mt-4 grid items-start gap-4 min-[1101px]:grid-cols-[minmax(0,1fr)_minmax(360px,420px)]">
        <section
          aria-label="착용 미리보기"
          className="rounded-card border border-line bg-white shadow-sm"
        >
          <div className="grid grid-cols-[72px_minmax(0,300px)_72px] items-center justify-center gap-3 px-4 pt-8 pb-4 min-[600px]:grid-cols-[96px_minmax(0,300px)_96px] min-[600px]:gap-5 min-[600px]:px-6">
            <div className="flex flex-col gap-5">
              {slot(ITEM_PART.HEAD)}
              {slot(ITEM_PART.FACE)}
            </div>
            <WearPreview pet={pet} worn={worn} />
            <div className="flex flex-col gap-5">
              {slot(ITEM_PART.CLOTHES)}
              {slot(ITEM_PART.BAG)}
            </div>
          </div>
          <div className="flex justify-center px-6 pb-6">
            <div className="w-[72px] min-[600px]:w-24">
              {slot(ITEM_PART.NECK)}
            </div>
          </div>
        </section>
        <section
          aria-labelledby="inv-title"
          className="rounded-card border border-line bg-white shadow-sm"
        >
          <div className="flex items-center justify-between gap-3 border-b border-line-soft px-5 py-4">
            <h2 id="inv-title" className="text-lg font-bold">
              보관함
            </h2>
            <button
              type="button"
              onClick={() => showToast('아이템 상점은 준비 중이에요')}
              className={BTN_PRIMARY}
            >
              아이템 상점
            </button>
          </div>
          <div className="p-5">
            <ItemStorage items={items} worn={worn} onToggle={toggle} />
          </div>
        </section>
      </div>
      <div className="mt-5 flex justify-end gap-2 border-t border-line pt-5">
        <button
          type="button"
          onClick={() => setDraft(null)}
          disabled={draft === null || isSaving}
          className={BTN_SECONDARY}
        >
          되돌리기
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={draft === null || isSaving}
          className={BTN_PRIMARY}
        >
          장착
        </button>
      </div>
    </>
  );
}

function Slot({ name, item, onRelease }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`relative grid h-20 w-full place-items-center rounded-lg px-1 text-center text-sm ${
          item
            ? 'bg-surface-2 font-semibold text-ink-2'
            : 'border border-dashed border-line-strong bg-white font-normal text-placeholder'
        }`}
      >
        {item ? item.itemNm : '비어있음'}
        {item && (
          <button
            type="button"
            onClick={onRelease}
            aria-label={`${name} ${item.itemNm} 해제`}
            className="absolute top-0 right-0 grid size-7 place-items-center rounded-md text-subtle hover:text-ink"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      <span className="text-sm text-subtle">{name}</span>
    </div>
  );
}
