import { useMemo, useState } from 'react';
import { ChatModalContext } from './chatModal';

// 열림 상태만 가진다. 모달 화면은 SCR-COM-009에서 만든다
export default function ChatModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const value = useMemo(
    () => ({ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }),
    [isOpen],
  );

  return <ChatModalContext.Provider value={value}>{children}</ChatModalContext.Provider>;
}
