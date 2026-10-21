import { useEffect, useRef, useState } from 'react';

/** 요소의 가로 폭(px) 추적. 첫 측정 전에는 0 */
export default function useElementWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.round(entry.contentRect.width)),
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, width];
}
