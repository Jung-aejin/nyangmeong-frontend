import { useEffect, useRef, useState } from 'react';
import { Bell, MessageCircle, User } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import logo from '@/assets/nm_logo.svg';
import CountBadge from '@/components/CountBadge';
import { useChatModal } from '@/context/chatModal';
import { useUnreadCount } from '@/features/notification/queries';
import { PATHS } from '@/routes/paths';
import GnbDropdown from './GnbDropdown';
import { GNB_MENUS } from './gnbMenus';

const GNB_OPEN_DELAY = 200;
const GNB_CLOSE_DELAY = 300;

const iconButton =
  'relative flex h-[42px] w-[42px] items-center justify-center rounded-full text-[#3d4a4b] hover:bg-[#f4f6f6]';

export default function UserHeader() {
  // Only one dropdown is open at a time: 'gnb' | 'notification' | 'profile' | null
  const [openMenu, setOpenMenu] = useState(null);
  // Which 1st-level menu's card is shown while the GNB is open
  const [gnbIndex, setGnbIndex] = useState(0);
  const chatModal = useChatModal();
  const { data: unread } = useUnreadCount();

  const gnbRef = useRef(null);
  const gnbTimer = useRef(null);
  const skipGnbFocus = useRef(false);

  useEffect(() => () => clearTimeout(gnbTimer.current), []);

  const toggle = (name) =>
    setOpenMenu((current) => (current === name ? null : name));

  // Open or close the GNB card after a delay; a newer call cancels the pending one.
  // Moving between menus while the card is already open switches at once.
  const scheduleGnb = (open, delay, index) => {
    clearTimeout(gnbTimer.current);
    gnbTimer.current = setTimeout(
      () => {
        if (open) {
          setGnbIndex(index);
          setOpenMenu('gnb');
        } else {
          setOpenMenu((current) => (current === 'gnb' ? null : current));
        }
      },
      open && openMenu === 'gnb' ? 0 : delay,
    );
  };

  const closeGnb = () => {
    clearTimeout(gnbTimer.current);
    setOpenMenu((current) => (current === 'gnb' ? null : current));
  };

  const handleGnbFocus = (event) => {
    // Focus moved back by ESC must not reopen the panel it just closed
    if (skipGnbFocus.current) {
      skipGnbFocus.current = false;
      return;
    }
    clearTimeout(gnbTimer.current);
    const index = event.target.closest('[data-gnb-menu]')?.dataset.gnbMenu;
    if (index !== undefined) setGnbIndex(Number(index));
    setOpenMenu('gnb');
  };

  const handleGnbBlur = (event) => {
    if (!gnbRef.current.contains(event.relatedTarget)) closeGnb();
  };

  const handleGnbKeyDown = (event) => {
    if (event.key === 'Escape') {
      // Return focus to the 1st-level menu whose card is open
      const menuLink = gnbRef.current.querySelector(
        `[data-gnb-menu="${gnbIndex}"] > a`,
      );
      closeGnb();
      if (menuLink && document.activeElement !== menuLink) {
        skipGnbFocus.current = true;
        menuLink.focus();
      }
      return;
    }
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[
      event.key
    ];
    if (!step) return;
    event.preventDefault();
    const links = [...gnbRef.current.querySelectorAll('a')];
    links[links.indexOf(document.activeElement) + step]?.focus();
  };

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

        <div
          ref={gnbRef}
          onFocus={handleGnbFocus}
          onBlur={handleGnbBlur}
          onKeyDown={handleGnbKeyDown}
        >
          <nav className="flex h-16 items-center gap-1">
            {GNB_MENUS.map((menu, index) => (
              <div
                key={menu.label}
                data-gnb-menu={index}
                className="relative flex h-full items-center"
                onMouseEnter={() => scheduleGnb(true, GNB_OPEN_DELAY, index)}
                onMouseLeave={() => scheduleGnb(false, GNB_CLOSE_DELAY)}
              >
                <NavLink
                  to={menu.to}
                  onClick={closeGnb}
                  className={({ isActive }) =>
                    `relative rounded-lg px-4 py-2 text-base hover:bg-[#ebf0f0] ${
                      openMenu === 'gnb' && gnbIndex === index
                        ? 'bg-[#ebf0f0]'
                        : ''
                    } ${
                      isActive
                        ? 'font-bold text-[#1a3234]'
                        : 'font-normal text-[#3d4a4b]'
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
                {openMenu === 'gnb' && gnbIndex === index && (
                  <GnbDropdown items={menu.items} onNavigate={closeGnb} />
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 justify-self-end">
          <button
            type="button"
            className={iconButton}
            aria-label="알림"
            onClick={() => toggle('notification')}
          >
            <Bell size={24} />
            <CountBadge
              count={unread?.unreadCount}
              className="absolute right-px top-[5px]"
            />
          </button>
          <button
            type="button"
            className={iconButton}
            aria-label="채팅"
            onClick={openChat}
          >
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

      {openMenu && openMenu !== 'gnb' && (
        <div
          className="absolute inset-x-0 top-16 border-b border-[#e2e7e7] bg-white shadow-sm"
          role="menu"
          data-menu={openMenu}
        >
          <div className="mx-auto h-24 max-w-[1440px] px-8 py-4 text-sm text-[#566465]">
            {openMenu}
          </div>
        </div>
      )}
    </header>
  );
}
