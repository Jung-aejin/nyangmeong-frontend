/**
 * [주소 공유 모달]
 * - 장소 검색·선택 → 지도 핀 → 상세 주소(선택, 30자) → 받는 사람 확인 후 전송 (FN-CMU-005-05)
 * - 화면설계서 SCR-CMU-005-02_주소공유모달 기준(시안 HTML에는 없음)
 */
import { useState } from 'react';
import Icon from '@/components/Icon';
import Modal from '@/components/Modal';
import Skeleton from '@/components/Skeleton';
import { BTN_PRIMARY, BTN_SECONDARY } from '@/components/buttonStyles';
import { useChatPlaces } from '../queries';
import PlaceMapPreview from './PlaceMapPreview';

export const DETAIL_ADDR_MAX_LENGTH = 30;

export default function AddressShareModal({
  ctptMbrNcnm,
  isPending,
  onClose,
  onSend,
}) {
  const [keyword, setKeyword] = useState('');
  const [searched, setSearched] = useState('');
  const [selectedSn, setSelectedSn] = useState(null);
  const [detail, setDetail] = useState('');
  const { data: places, isPending: isSearching } = useChatPlaces(searched);
  const selected = places?.find((place) => place.placeSn === selectedSn);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearched(keyword.trim());
    setSelectedSn(null);
  };

  return (
    <Modal
      title="주소 공유"
      isPending={isPending}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            className={BTN_SECONDARY}
            disabled={isPending}
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="button"
            className={BTN_PRIMARY}
            disabled={!selected || isPending}
            onClick={() =>
              onSend({ shrnAddr: selected.addr, detail: detail.trim() })
            }
          >
            주소 보내기
          </button>
        </>
      }
    >
      <p className="text-sm text-muted">
        만날 장소나 돌봄 장소를 검색해서 골라 주세요
      </p>

      <form className="mt-3 flex gap-2" onSubmit={handleSearch}>
        <input
          aria-label="장소 검색"
          placeholder="예: 늘봄아파트, 서곡공원, 효자동"
          className="h-11 min-w-0 flex-1 rounded-md border border-input-line px-3.5 outline-none focus:border-brand-500"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
        <button type="submit" className={`${BTN_SECONDARY} h-11`}>
          검색
        </button>
      </form>

      <p className="mt-4 mb-1.5 text-sm font-semibold text-ink">
        {searched === ''
          ? '돌봄 글 동네 근처 장소'
          : `검색 결과 ${places?.length ?? 0}곳`}
      </p>
      {isSearching && (
        <div aria-busy="true" className="py-3">
          <Skeleton lines={3} />
        </div>
      )}
      {places?.length === 0 && (
        <p className="py-3 text-sm text-subtle">
          검색 결과가 없어요. 장소나 동 이름을 다시 확인해 주세요
        </p>
      )}
      {places?.length > 0 && (
        <ul role="radiogroup" aria-label="장소 목록" className="flex flex-col">
          {places.map((place) => (
            <li key={place.placeSn}>
              <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-ink-2">
                <input
                  type="radio"
                  name="share-place"
                  className="size-5 accent-brand-500"
                  checked={place.placeSn === selectedSn}
                  onChange={() => setSelectedSn(place.placeSn)}
                />
                {place.addr}
              </label>
            </li>
          ))}
        </ul>
      )}

      <PlaceMapPreview place={selected} />

      <label className="mt-4 block text-sm font-semibold text-ink">
        상세 주소 (선택)
        <span className="mt-1.5 flex h-11 items-center rounded-md border border-input-line px-3.5 focus-within:border-brand-500">
          <input
            maxLength={DETAIL_ADDR_MAX_LENGTH}
            placeholder="예: 103동 앞, 1층 현관"
            className="min-w-0 flex-1 bg-transparent font-normal outline-none"
            value={detail}
            onChange={(event) => setDetail(event.target.value)}
          />
          <span className="shrink-0 pl-2 text-xs font-normal text-placeholder">
            {detail.length} / {DETAIL_ADDR_MAX_LENGTH}
          </span>
        </span>
      </label>

      <p className="mt-3 flex items-center gap-1.5 text-sm text-subtle">
        <Icon name="lock" className="text-lg" />
        {ctptMbrNcnm}님에게만 보여요 · 이 채팅방 밖에는 공개되지 않아요
      </p>
    </Modal>
  );
}
