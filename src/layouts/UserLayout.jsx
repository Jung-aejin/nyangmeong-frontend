import { Outlet } from 'react-router-dom';
import ChatModalProvider from '@/context/ChatModalProvider';
import ChatModal from './ChatModal';
import FloatingButtons from './FloatingButtons';
import UserFooter from './UserFooter';
import UserHeader from './UserHeader';

export default function UserLayout() {
  return (
    <ChatModalProvider>
      <div className="flex min-h-screen flex-col bg-[#faf8f5]">
        <UserHeader />
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-8 py-6 max-[760px]:px-4">
          <Outlet />
        </main>
        <UserFooter />
        <FloatingButtons />
        <ChatModal />
      </div>
    </ChatModalProvider>
  );
}
