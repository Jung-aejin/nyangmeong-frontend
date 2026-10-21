import { useEffect, useMemo, useState } from 'react';
import { OPEN_CHAT_MODAL_MESSAGE } from '@/constants/chatModal';
import { ChatModalContext } from './chatModal';

/** 열림 상태와 마지막으로 본 방 */
export default function ChatModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  /** 닫아도 유지: 다시 열 때 마지막 방 선택 */
  const [roomSn, setRoomSn] = useState(null);

  /** AI 대화창의 채팅 바로가기 요청 수신(FN-AIM-004) */
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== OPEN_CHAT_MODAL_MESSAGE) return;
      setIsOpen(true);
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      roomSn,
      /** 방 지정 시 해당 방, 아니면 마지막 방으로 열기 */
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

  return (
    <ChatModalContext.Provider value={value}>
      {children}
    </ChatModalContext.Provider>
  );
}
