import { MapPin, Search } from 'lucide-react';
import { useState } from 'react';
import { BTN_PRIMARY, BTN_SECONDARY } from '@/components/buttonStyles';
import Modal from '@/components/Modal';
import { useSearchMissingPlaces } from '../missingQueries';
import MissingMap from './MissingMap';

/**
 * 장소 찾기 모달(전북 한정): 실종센터 목격 장소, 펫돌봄 돌봄 장소가 같이 쓴다
 * - 장소·동 이름으로 검색 → 결과 라디오(단일 선택) → 지도 미리보기(반경) → [확인 버튼]으로 부모에 넘긴다: onSelect(place)
 * - title·confirmLabel: 모달 제목과 확인 버튼 문구(기본은 실종센터 문구)
 * - 모달이라 글쓰기 폼의 다른 입력값은 그대로 유지된다. 취소하면 이전 선택을 바꾸지 않는다
 */
export default function PlaceSearchModal({
  title = '목격 장소 찾기',
  confirmLabel = '목격 장소로 설정',
  onSelect,
  onClose,
}) {
  const search = useSearchMissingPlaces();
  const [keyword, setKeyword] = useState('');
  const [selected, setSelected] = useState(null);
  const places = search.data;

  const handleSubmit = (event) => {
    event.preventDefault();
    setSelected(null);
    search.mutate(keyword.trim());
  };

  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className={BTN_SECONDARY}>
            취소
          </button>
          <button
            type="button"
            disabled={!selected}
            onClick={() => onSelect(selected)}
            className={BTN_PRIMARY}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="mb-3 text-sm text-muted">
        장소 · 동 이름으로 검색해서 골라 주세요
      </p>
      <form onSubmit={handleSubmit} role="search" className="flex gap-2">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">장소 검색</span>
          <Search
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-subtle"
          />
          <input
            type="search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="예: 서곡초, 효자공원, 인후동"
            className="block h-10 w-full rounded-md border border-input-line bg-white pr-3 pl-10 text-base placeholder:text-placeholder focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
          />
        </label>
        <button type="submit" className={`${BTN_PRIMARY} shrink-0`}>
          검색
        </button>
      </form>

      {places?.length > 0 && (
        <div
          role="radiogroup"
          aria-label="검색 결과"
          className="mt-3 flex max-h-48 flex-col overflow-y-auto rounded-md border border-line"
        >
          {places.map((place) => (
            <label
              key={place.plcSn}
              className="flex min-h-11 cursor-pointer items-center gap-2 border-t border-line px-3 text-ink first:border-t-0 hover:bg-surface-2 has-[:checked]:bg-brand-50 has-[:checked]:font-semibold has-[:checked]:text-brand-600"
            >
              <input
                type="radio"
                name="missing-place"
                value={place.plcSn}
                checked={selected?.plcSn === place.plcSn}
                onChange={() => setSelected(place)}
                className="sr-only"
              />
              <MapPin size={16} aria-hidden="true" className="shrink-0" />
              {place.wtnsPlcAddr.replace('전북 ', '')}
            </label>
          ))}
        </div>
      )}
      {places?.length === 0 && (
        <p className="mt-3 text-sm text-muted">
          검색 결과가 없어요. 장소나 동 이름을 다시 확인해 주세요.
        </p>
      )}
      {selected && (
        <div className="mt-3">
          <MissingMap place={selected} isPreview />
        </div>
      )}
    </Modal>
  );
}
