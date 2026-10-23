import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ToastContainer from '@/components/ToastContainer';
import ChatModalProvider from '@/context/ChatModalProvider';
import ChatModal from '@/layouts/ChatModal';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/** 채팅 모달: UserLayout·PlaceLayout 헤더가 같이 쓰도록 앱 전체 */}
        <ChatModalProvider>
          <App />
          <ChatModal />
        </ChatModalProvider>
      </BrowserRouter>
      <ToastContainer />
    </QueryClientProvider>
  </StrictMode>,
);
