import { useEffect, useRef, useState } from 'react';

/** 취소 가능 유예 시간 */
export const ROUTE_GRACE_SECONDS = 3;

/** 이동 유예 카운트다운 */
export default function useRouteCountdown({ isActive, onElapsed }) {
  const [secondsLeft, setSecondsLeft] = useState(ROUTE_GRACE_SECONDS);
  const onElapsedRef = useRef(onElapsed);

  useEffect(() => {
    onElapsedRef.current = onElapsed;
  });

  useEffect(() => {
    if (!isActive) return undefined;
    let left = ROUTE_GRACE_SECONDS;
    const timer = setInterval(() => {
      left -= 1;
      setSecondsLeft(left);
      if (left <= 0) {
        clearInterval(timer);
        onElapsedRef.current();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isActive]);

  return secondsLeft;
}
