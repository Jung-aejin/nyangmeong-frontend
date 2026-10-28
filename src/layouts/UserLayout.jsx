import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import { findBottomNavMenu } from './bottomNavMenus';
import FloatingButtons from './FloatingButtons';
import ScrollToTop from './ScrollToTop';
import UserFooter from './UserFooter';
import UserHeader from './UserHeader';

export default function UserLayout() {
  const { pathname } = useLocation();
  const bottomNavMenu = findBottomNavMenu(pathname);

  return (
    <div className="flex min-h-screen flex-col bg-[#faf8f5]">
      <ScrollToTop />
      <UserHeader />
      {/** 바텀 네비 화면: 본문 끝이 네비·AI 버튼에 가리지 않게 여백 */}
      <main
        className={`mx-auto w-full max-w-[1440px] flex-1 px-8 pb-[160px] pt-6 max-[760px]:px-4 ${
          bottomNavMenu
            ? 'max-[760px]:pb-[calc(144px+env(safe-area-inset-bottom))]'
            : 'max-[760px]:pb-20'
        }`}
      >
        <Outlet />
      </main>
      <UserFooter className={bottomNavMenu ? 'max-[760px]:hidden' : ''} />
      {bottomNavMenu && <BottomNav menu={bottomNavMenu} />}
      <FloatingButtons hasBottomNav={Boolean(bottomNavMenu)} />
    </div>
  );
}
