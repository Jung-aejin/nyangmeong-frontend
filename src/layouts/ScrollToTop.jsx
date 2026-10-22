import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/** 기록(history 항목)별 마지막 스크롤 위치 */
const scrollPositions = new Map();

/**
 * [경로 이동 시 스크롤]
 * - 경로가 바뀌는 이동 -> 맨 위, 뒤로·앞으로 가기(POP) -> 그 기록의 위치로 복원
 * - 쿼리스트링만 바뀌는 이동(쪽 번호·검색)은 제외
 * - 브라우저 자동 복원은 짧은 상세 화면에서 이미 0으로 줄어든 뒤라 쓰지 않음
 */
export default function ScrollToTop() {
  const { pathname, key } = useLocation();
  const navigationType = useNavigationType();
  /** 직전 경로: 같은 경로에서 쿼리만 바뀐 이동 제외용 */
  const prevPathname = useRef(pathname);

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
  }, []);

  /** 지금 기록의 스크롤 위치 저장: 화면이 바뀌기 전에 리스너를 갈아 끼움 */
  useLayoutEffect(() => {
    const savePosition = () => scrollPositions.set(key, window.scrollY);
    window.addEventListener('scroll', savePosition, { passive: true });
    return () => window.removeEventListener('scroll', savePosition);
  }, [key]);

  useEffect(() => {
    const isPathChanged = prevPathname.current !== pathname;
    prevPathname.current = pathname;
    if (navigationType === 'POP') {
      window.scrollTo(0, scrollPositions.get(key) ?? 0);
      return;
    }
    if (isPathChanged) window.scrollTo(0, 0);
  }, [key, pathname, navigationType]);

  return null;
}
