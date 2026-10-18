import { useMemo, useState } from 'react';
import { ChatModalContext } from './chatModal';

// 열림 상태와 마지막으로 본 방만 가진다. 모달 안쪽 화면은 KSJ가 만든다
export default function ChatModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  // 닫아도 지우지 않는다. 다시 열 때 마지막으로 본 방이 선택된다
  const [roomSn, setRoomSn] = useState(null);

  const value = useMemo(
    () => ({
      isOpen,
      roomSn,
      // 방을 주면 그 방으로, 안 주면 마지막으로 본 방으로 연다. 이미 열려 있으면 방만 바뀐다
      open: (nextRoomSn) => {
        if (nextRoomSn !== undefined) setRoomSn(nextRoomSn);
        setIsOpen(true);
      },
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((current) => !current),
      selectRoom: setRoomSn,
    }),
    [isOpen, roomSn],
  );

  return <ChatModalContext.Provider value={value}>{children}</ChatModalContext.Provider>;
}
