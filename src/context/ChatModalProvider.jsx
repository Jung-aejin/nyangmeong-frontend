import { useMemo, useState } from 'react';
import { ChatModalContext } from './chatModal';

// Open state only. The modal itself is built in SCR-COM-009
export default function ChatModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const value = useMemo(
    () => ({ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }),
    [isOpen],
  );

  return <ChatModalContext.Provider value={value}>{children}</ChatModalContext.Provider>;
}
