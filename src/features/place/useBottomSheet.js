import { useEffect, useState } from 'react';

const PEEK_HEIGHT = 148;
const MIN_DRAG_HEIGHT = 120;
const TOP_GAP = 56;
const DRAG_THRESHOLD = 6;
const SHEETS = ['peek', 'half', 'full'];
const NEXT_SHEET = { peek: 'half', half: 'full', full: 'peek' };

const isMobile = () => window.matchMedia('(max-width: 767px)').matches;

// 모바일 바텀시트. peek(목록 머리만) → half → full 세 단계이고 손잡이를 끌거나 눌러 바꾼다
export default function useBottomSheet() {
  const [container, setContainer] = useState(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [sheet, setSheet] = useState('peek');
  const [dragHeight, setDragHeight] = useState(null);

  useEffect(() => {
    if (!container) return;
    const observer = new ResizeObserver(() =>
      setContainerHeight(container.clientHeight),
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [container]);

  const heightOf = (name) => {
    if (name === 'full') return containerHeight - TOP_GAP;
    if (name === 'half') return Math.round(containerHeight * 0.5);
    return PEEK_HEIGHT;
  };

  // 손잡이는 끌지 않고 떼면 단계를 넘기고(isHandle), 목록 머리 글자는 끌기만 한다
  const startDrag = (event, isHandle) => {
    if (!isMobile()) return;
    const startY = event.clientY;
    const startHeight = heightOf(sheet);
    const fullHeight = heightOf('full');
    let height = startHeight;
    let didDrag = false;

    const handleMove = (moveEvent) => {
      const delta = startY - moveEvent.clientY;
      if (Math.abs(delta) > DRAG_THRESHOLD) didDrag = true;
      if (!didDrag) return;
      height = Math.max(
        MIN_DRAG_HEIGHT,
        Math.min(fullHeight, startHeight + delta),
      );
      setDragHeight(height);
    };

    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      if (didDrag) {
        setSheet(
          SHEETS.reduce((nearest, name) =>
            Math.abs(heightOf(name) - height) <
            Math.abs(heightOf(nearest) - height)
              ? name
              : nearest,
          ),
        );
      } else if (isHandle) {
        setSheet(NEXT_SHEET[sheet]);
      }
      setDragHeight(null);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  // 포인터 없이 키보드로 누른 경우(detail 0)만 처리한다. 포인터는 startDrag가 맡는다
  const handleHandleClick = (event) => {
    if (event.detail === 0) setSheet(NEXT_SHEET[sheet]);
  };

  return {
    attachContainer: setContainer,
    sheet,
    setSheet,
    isFull: sheet === 'full',
    isDragging: dragHeight !== null,
    sheetY: dragHeight ?? heightOf(sheet),
    peekY: sheet === 'peek' ? PEEK_HEIGHT : heightOf(sheet),
    startDrag,
    handleHandleClick,
  };
}
