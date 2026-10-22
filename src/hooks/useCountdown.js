import { useEffect, useState } from 'react';

const pad = (value) => String(value).padStart(2, '0');

// 만료 시각(ms)까지 남은 시간을 1초마다 센다. expiresAt이 0이면 멈춘다
export default function useCountdown(expiresAt) {
  const [now, setNow] = useState(() => Date.now());

  // 만료 시각이 바뀌면 바로 한 번 맞추고, 이후 1초마다 센다
  useEffect(() => {
    if (!expiresAt) return undefined;
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [expiresAt]);

  const seconds = expiresAt
    ? Math.max(0, Math.ceil((expiresAt - now) / 1000))
    : 0;

  return {
    seconds,
    text: `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`,
    isExpired: Boolean(expiresAt) && seconds === 0,
  };
}
