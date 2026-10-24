import { useSyncExternalStore } from 'react';

/** CSS 미디어 쿼리 일치 여부 (화면 크기 변화에 맞춰 갱신) */
export default function useMediaQuery(query) {
  return useSyncExternalStore(
    (notify) => {
      const media = window.matchMedia(query);
      media.addEventListener('change', notify);
      return () => media.removeEventListener('change', notify);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
