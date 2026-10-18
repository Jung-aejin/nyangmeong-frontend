import { useState } from 'react';
import { Bell, MessageCircle, User } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import logo from '@/assets/nm_logo.svg';
import CountBadge from '@/components/CountBadge';
import { useChatModal } from '@/context/chatModal';
import { useUnreadCount } from '@/features/notification/queries';
import { PATHS } from '@/routes/paths';

const GNB_MENUS = [
  { label: '건강기록', to: { pathname: PATHS.HEALTH } },
  { label: '플레이스', to: { pathname: PATHS.PLACES, search: '?cat=hospital' } },
  { label: '커뮤니티', to: { pathname: PATHS.COMMUNITY } },
];

const iconButton =
  'relative flex h-[42px] w-[42px] items-center justify-center rounded-full text-[#3d4a4b] hover:bg-[#f4f6f6]';

export default function UserHeader() {
  // Only one dropdown is open at a time: 'gnb' | 'notification' | 'profile' | null
  const [openMenu, setOpenMenu] = useState(null);
  const chatModal = useChatModal();
  const { data: unread } = useUnreadCount();

  const toggle = (name) => setOpenMenu((current) => (current === name ? null : name));

  const openChat = () => {
    setOpenMenu(null);
    chatModal.open();
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[#e2e7e7] bg-white">
      <div className="mx-auto grid h-full max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-8">
        <Link to={PATHS.MAIN} className="justify-self-start">
          <img src={logo} alt="냥멍케어" className="h-8 w-[121px]" />
        </Link>

        <nav className="flex gap-1" onMouseEnter={() => setOpenMenu('gnb')}>
          {GNB_MENUS.map((menu) => (
            <NavLink
              key={menu.label}
              to={menu.to}
              className={({ isActive }) =>
                `relative rounded-lg px-4 py-2 text-base ${
                  isActive ? 'font-bold text-[#1a3234]' : 'font-normal text-[#3d4a4b]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {menu.label}
                  {isActive && (
                    <span className="absolute inset-x-4 -bottom-1 h-0.5 rounded-sm bg-[#285a5c]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 justify-self-end">
          <button
            type="button"
            className={iconButton}
            aria-label="알림"
            onClick={() => toggle('notification')}
          >
            <Bell size={24} />
            <CountBadge count={unread?.unreadCount} className="absolute right-px top-[5px]" />
          </button>
          <button type="button" className={iconButton} aria-label="채팅" onClick={openChat}>
            <MessageCircle size={24} />
            {/* Unread count comes from KSJ's chat API; 0 hides the badge until it is wired */}
            <CountBadge count={0} className="absolute right-px top-[5px]" />
          </button>
          <button
            type="button"
            className={`${iconButton} border border-[#e2e7e7]`}
            aria-label="프로필"
            onClick={() => toggle('profile')}
          >
            <User size={24} />
          </button>
        </div>
      </div>

      {openMenu && (
        <div
          className="absolute inset-x-0 top-16 border-b border-[#e2e7e7] bg-white shadow-sm"
          role="menu"
          data-menu={openMenu}
          onMouseLeave={() => openMenu === 'gnb' && setOpenMenu(null)}
        >
          <div className="mx-auto h-24 max-w-[1440px] px-8 py-4 text-sm text-[#566465]">
            {openMenu}
          </div>
        </div>
      )}
    </header>
  );
}
