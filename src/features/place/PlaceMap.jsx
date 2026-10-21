import { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  LocateFixed,
  MapPin,
  Minus,
  Plus,
  RefreshCw,
} from 'lucide-react';
import useKakaoMap from '@/hooks/useKakaoMap';
import PlaceOverlay from './PlaceOverlay';
import PlacePin from './PlacePin';
import PlacePopup from './PlacePopup';
import { SPOTS } from './placeData';

const HOME_CENTER = [35.832, 127.1385];
const INITIAL_LEVEL = 6;
const BOUNDS_PADDING = 80;

const floatCard = 'bg-white shadow-depth-md';
const toolButton =
  'grid size-11 place-items-center text-ink-2 hover:bg-surface-2 hover:text-ink';

// 지도 영역. 지도를 움직이면 '이 지역에서 다시 검색'이 뜬다. children은 모바일에서 지도 위에 얹는 검색창·칩이다
export default function PlaceMap({
  resultIds,
  favoriteIds,
  isOutside,
  selected,
  regionText,
  isMoved,
  isCollapsed,
  isSheetFull,
  onSelectPin,
  onClosePopup,
  onMoved,
  onResearch,
  onToggleCollapse,
  children,
}) {
  const { kakao, isError } = useKakaoMap();
  const containerRef = useRef(null);
  const homeBoundsRef = useRef(null);
  // 코드로 지도를 옮기는 중에는 zoom_changed를 사용자가 움직인 것으로 치지 않는다
  const isAutoMoveRef = useRef(false);
  const onMovedRef = useRef(onMoved);
  const [map, setMap] = useState(null);
  const [isSky, setIsSky] = useState(false);

  useEffect(() => {
    onMovedRef.current = onMoved;
  }, [onMoved]);

  const fitHome = (target = map) => {
    isAutoMoveRef.current = true;
    target.setBounds(
      homeBoundsRef.current,
      BOUNDS_PADDING,
      BOUNDS_PADDING,
      BOUNDS_PADDING,
      BOUNDS_PADDING,
    );
  };

  useEffect(() => {
    if (!kakao) return;
    const bounds = new kakao.maps.LatLngBounds();
    Object.values(SPOTS).forEach(([lat, lng]) =>
      bounds.extend(new kakao.maps.LatLng(lat, lng)),
    );
    homeBoundsRef.current = bounds;

    const kakaoMap = new kakao.maps.Map(containerRef.current, {
      center: new kakao.maps.LatLng(...HOME_CENTER),
      level: INITIAL_LEVEL,
    });
    fitHome(kakaoMap);
    kakao.maps.event.addListener(kakaoMap, 'idle', () => {
      isAutoMoveRef.current = false;
    });
    kakao.maps.event.addListener(kakaoMap, 'dragend', () =>
      onMovedRef.current(),
    );
    kakao.maps.event.addListener(kakaoMap, 'zoom_changed', () => {
      if (!isAutoMoveRef.current) onMovedRef.current();
    });
    setMap(kakaoMap);

    // 목록을 접거나 펼쳐 지도 칸 크기가 바뀌면 타일을 다시 맞춘다
    const observer = new ResizeObserver(() => kakaoMap.relayout());
    observer.observe(containerRef.current);
    return () => observer.disconnect();
    // 지도는 SDK가 준비됐을 때 한 번만 만든다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kakao]);

  useEffect(() => {
    if (!map) return;
    map.setMapTypeId(
      isSky ? kakao.maps.MapTypeId.HYBRID : kakao.maps.MapTypeId.ROADMAP,
    );
  }, [map, kakao, isSky]);

  useEffect(() => {
    if (!map || !selected) return;
    const [lat, lng] = SPOTS[selected];
    map.panTo(new kakao.maps.LatLng(lat, lng));
  }, [map, kakao, selected]);

  const zoom = (direction) => {
    map?.setLevel(map.getLevel() - direction, { animate: true });
  };

  const strayFavoriteIds = favoriteIds.filter(
    (id) => !isOutside(id) && !resultIds.includes(id),
  );

  return (
    <div className="relative min-w-0 overflow-hidden bg-[#f1f2ed] max-md:absolute max-md:inset-0">
      <div ref={containerRef} className="absolute inset-0 isolate" />
      {!map && (
        <p className="absolute inset-0 grid place-items-center text-sm text-muted">
          {isError ? '지도를 불러오지 못했어요' : '지도를 불러오는 중이에요'}
        </p>
      )}
      {map &&
        resultIds.map((id, index) => (
          <PlaceOverlay
            key={id}
            kakao={kakao}
            map={map}
            position={SPOTS[id]}
            zIndex={selected === id ? 3 : 1}
          >
            <PlacePin
              id={id}
              label={String.fromCharCode(65 + index)}
              isSelected={selected === id}
              onSelect={onSelectPin}
            />
          </PlaceOverlay>
        ))}
      {map &&
        strayFavoriteIds.map((id) => (
          <PlaceOverlay
            key={id}
            kakao={kakao}
            map={map}
            position={SPOTS[id]}
            zIndex={selected === id ? 3 : 1}
          >
            <PlacePin
              id={id}
              isSelected={selected === id}
              onSelect={onSelectPin}
            />
          </PlaceOverlay>
        ))}

      <button
        type="button"
        onClick={onToggleCollapse}
        aria-label={isCollapsed ? '목록 펼치기' : '목록 접기'}
        className="absolute left-0 top-1/2 z-[4] -mt-7 hidden h-14 w-6 place-items-center rounded-r-md border border-l-0 border-line bg-white text-muted shadow-sm hover:text-ink md:grid"
      >
        <ChevronLeft
          className={`size-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
        />
      </button>

      {children}

      <div className="pointer-events-none absolute inset-x-4 top-4 z-[2] flex items-start justify-between gap-3 max-md:top-[116px]">
        <span
          className={`pointer-events-auto inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold text-ink ${floatCard}`}
        >
          <MapPin className="size-[18px] text-brand-500" />
          {regionText}
        </span>
        <div
          role="group"
          aria-label="지도 종류"
          className={`pointer-events-auto flex rounded-md p-[3px] max-md:hidden ${floatCard}`}
        >
          {[
            ['일반 지도', false],
            ['스카이뷰', true],
          ].map(([text, sky]) => (
            <button
              key={text}
              type="button"
              aria-pressed={isSky === sky}
              onClick={() => setIsSky(sky)}
              className={`h-[34px] rounded-sm px-3.5 text-sm ${
                isSky === sky
                  ? 'bg-brand-500 font-semibold text-white'
                  : 'font-medium text-muted'
              }`}
            >
              {text}
            </button>
          ))}
        </div>
      </div>

      {isMoved && (
        <button
          type="button"
          onClick={onResearch}
          className={`absolute left-1/2 top-[72px] z-[2] inline-flex h-11 -translate-x-1/2 items-center gap-1.5 rounded-md px-5 font-semibold text-brand-600 max-md:top-[164px] ${floatCard}`}
        >
          <RefreshCw className="size-5" />이 지역에서 다시 검색
        </button>
      )}

      <div
        className={`absolute right-4 top-1/2 z-[2] flex -translate-y-1/2 flex-col gap-2 max-md:bottom-[calc(var(--sheet-peek)+16px)] max-md:top-auto max-md:translate-y-0 ${
          isSheetFull ? 'max-md:hidden' : ''
        }`}
      >
        <div className={`overflow-hidden rounded-card ${floatCard}`}>
          <button
            type="button"
            aria-label="처음 위치로"
            onClick={() => map && fitHome()}
            className={toolButton}
          >
            <LocateFixed className="size-[22px]" />
          </button>
        </div>
        <div
          className={`flex flex-col divide-y divide-line-soft overflow-hidden rounded-card max-md:hidden ${floatCard}`}
        >
          <button
            type="button"
            aria-label="지도 확대"
            onClick={() => zoom(1)}
            className={toolButton}
          >
            <Plus className="size-[22px]" />
          </button>
          <button
            type="button"
            aria-label="지도 축소"
            onClick={() => zoom(-1)}
            className={toolButton}
          >
            <Minus className="size-[22px]" />
          </button>
        </div>
      </div>

      <p className="absolute bottom-[13px] left-[90px] z-[2] rounded-sm bg-white/85 px-2 py-0.5 text-sm text-subtle max-md:hidden">
        업체는 설명용 예시예요
      </p>

      {selected && (
        <div className={isSheetFull ? 'max-md:hidden' : ''}>
          <PlacePopup id={selected} onClose={onClosePopup} />
        </div>
      )}
    </div>
  );
}
