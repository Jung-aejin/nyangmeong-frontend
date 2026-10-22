/**
 * [고른 장소의 지도 핀]
 * - 카카오맵 SDK(@/hooks/useKakaoMap), 키가 없거나 SDK 오류면 안내만
 */
import { useEffect, useRef } from 'react';
import useKakaoMap from '@/hooks/useKakaoMap';

const MAP_LEVEL = 3;

export default function PlaceMapPreview({ place }) {
  const { kakao, isError } = useKakaoMap();
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!kakao || !place) return;
    const position = new kakao.maps.LatLng(place.lat, place.lng);
    if (!mapRef.current) {
      const map = new kakao.maps.Map(containerRef.current, {
        center: position,
        level: MAP_LEVEL,
      });
      mapRef.current = {
        map,
        marker: new kakao.maps.Marker({ position, map }),
      };
      return;
    }
    mapRef.current.map.setCenter(position);
    mapRef.current.marker.setPosition(position);
  }, [kakao, place]);

  let notice = null;
  if (isError) notice = '지도를 불러오지 못했어요';
  else if (!place) notice = '장소를 고르면 지도에 표시돼요';

  return (
    <div className="relative mt-3 h-40 overflow-hidden rounded-box border border-line bg-surface-2">
      <div
        ref={containerRef}
        className="size-full"
        role="img"
        aria-label={place ? `${place.plcNm} 위치 지도` : '선택한 장소 지도'}
      />
      {notice && (
        <p className="absolute inset-0 grid place-items-center bg-surface-2 text-sm text-subtle">
          {notice}
        </p>
      )}
    </div>
  );
}
