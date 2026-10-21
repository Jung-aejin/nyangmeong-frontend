import { Outlet } from 'react-router-dom';
import ChatModalProvider from '@/context/ChatModalProvider';
import ChatModal from './ChatModal';
import UserHeader from './UserHeader';

export default function PlaceLayout() {
  return (
    <ChatModalProvider>
      <div className="flex h-dvh flex-col overflow-hidden bg-white">
        <UserHeader />
        <main className="min-h-0 flex-1">
          <Outlet />
        </main>
        <ChatModal />
      </div>
    </ChatModalProvider>
  );
}
