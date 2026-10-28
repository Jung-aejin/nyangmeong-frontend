import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// 카카오 지도의 좌표 위에 React 요소를 올린다. 요소의 아래 가운데가 좌표에 놓인다
export default function PlaceOverlay({
  kakao,
  map,
  position: [lat, lng],
  zIndex,
  children,
}) {
  const [element] = useState(() => document.createElement('div'));

  useEffect(() => {
    const overlay = new kakao.maps.CustomOverlay({
      content: element,
      position: new kakao.maps.LatLng(lat, lng),
      xAnchor: 0.5,
      yAnchor: 1,
      zIndex,
      // 핀을 눌러도 지도 클릭으로 번지지 않게 한다
      clickable: true,
    });
    overlay.setMap(map);
    return () => overlay.setMap(null);
  }, [kakao, map, element, lat, lng, zIndex]);

  return createPortal(children, element);
}
