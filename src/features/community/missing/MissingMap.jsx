import { ExternalLink, MapPin } from 'lucide-react';
import { useEffect, useRef } from 'react';
import useKakaoMap from '@/hooks/useKakaoMap';

const MAP_LEVEL = 4;
/** 개인정보 보호: 정확한 좌표 대신 반경 약 250m 원으로 보여 준다 */
const RADIUS_METER = 250;

/**
 * 목격 장소 지도: 카카오맵 SDK(@/hooks/useKakaoMap)로 반경 원 + 장소명 라벨, 키가 없거나 SDK 오류면 안내만
 * - 길찾기: 카카오맵 앱·웹으로 연결
 * - isPreview: 글쓰기 미리보기(링크 없이 높이를 낮춤)
 */
export default function MissingMap({ place, isPreview = false }) {
  const { kakao, isError } = useKakaoMap();
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!kakao || !place) return;
    const center = new kakao.maps.LatLng(place.wtnsPlcLat, place.wtnsPlcLot);
    if (!mapRef.current) {
      const map = new kakao.maps.Map(containerRef.current, {
        center,
        level: MAP_LEVEL,
        draggable: false,
        scrollwheel: false,
      });
      const circle = new kakao.maps.Circle({
        center,
        radius: RADIUS_METER,
        strokeWeight: 2,
        strokeColor: '#285a5c',
        strokeStyle: 'dashed',
        fillColor: '#285a5c',
        fillOpacity: 0.12,
      });
      circle.setMap(map);
      mapRef.current = { map, circle };
      return;
    }
    mapRef.current.map.setCenter(center);
    mapRef.current.circle.setPosition(center);
  }, [kakao, place]);

  let notice = null;
  if (isError) notice = '지도를 불러오지 못했어요';
  else if (!place) notice = '장소를 고르면 지도에 표시돼요';

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-line bg-surface-2 ${isPreview ? 'h-[180px]' : 'h-[240px]'}`}
    >
      <div
        ref={containerRef}
        className="size-full"
        role="img"
        aria-label={
          place ? `${place.wtnsPlcNm} 목격 장소 지도` : '목격 장소 지도'
        }
      />
      {notice && (
        <p className="absolute inset-0 grid place-items-center bg-surface-2 text-sm text-subtle">
          {notice}
        </p>
      )}
      {place && (
        <span className="absolute bottom-3 left-3 inline-flex h-7 items-center gap-1 rounded-full bg-white px-2.5 text-sm text-ink-2 shadow-[inset_0_0_0_1px_var(--color-line)]">
          <MapPin size={14} aria-hidden="true" className="text-brand-500" />
          {place.wtnsPlcNm}
        </span>
      )}
      {place && !isPreview && (
        <a
          href={`https://map.kakao.com/link/to/${encodeURIComponent(place.wtnsPlcNm)},${place.wtnsPlcLat},${place.wtnsPlcLot}`}
          target="_blank"
          rel="noreferrer"
          className="absolute right-3 bottom-3 inline-flex h-7 items-center gap-1 rounded-full bg-white px-2.5 text-sm font-medium text-brand-600 shadow-[inset_0_0_0_1px_var(--color-line)] hover:bg-brand-50"
        >
          길찾기
          <ExternalLink size={13} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}
