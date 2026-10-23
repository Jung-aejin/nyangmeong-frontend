import { createContext, useContext } from 'react';

export const ChatModalContext = createContext(null);

export const useChatModal = () => useContext(ChatModalContext);
