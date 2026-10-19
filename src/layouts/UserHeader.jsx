import { useCallback, useEffect, useRef, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import logo from '@/assets/nm_logo.svg';
import CountBadge from '@/components/CountBadge';
import { useChatModal } from '@/context/chatModal';
import { PATHS } from '@/routes/paths';
import GnbDropdown from './GnbDropdown';
import { GNB_MENUS } from './gnbMenus';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';

const GNB_OPEN_DELAY = 200;
const GNB_CLOSE_DELAY = 300;

const iconButton =
  'relative flex h-[42px] w-[42px] items-center justify-center rounded-full text-[#3d4a4b] hover:bg-[#f4f6f6]';

export default function UserHeader() {
  // 드롭다운은 한 번에 하나만 열린다: 'gnb' | 'notification' | 'profile' | null
  const [openMenu, setOpenMenu] = useState(null);
  // GNB가 열려 있는 동안 카드를 보여 줄 1차 메뉴의 순번
  const [gnbIndex, setGnbIndex] = useState(0);
  const chatModal = useChatModal();

  const gnbRef = useRef(null);
  const gnbTimer = useRef(null);
  const skipGnbFocus = useRef(false);

  useEffect(() => () => clearTimeout(gnbTimer.current), []);

  const toggle = (name) =>
    setOpenMenu((current) => (current === name ? null : name));

  // 지연 뒤에 GNB 카드를 열거나 닫는다. 새 호출이 대기 중인 호출을 취소한다.
  // 카드가 이미 열려 있으면 메뉴 사이를 옮길 때 바로 바뀐다.
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
    // ESC로 포커스가 돌아온 것이 방금 닫은 패널을 다시 열면 안 된다
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
      // 카드가 열려 있는 1차 메뉴로 포커스를 돌려보낸다
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

  const closeNotification = useCallback(
    () => setOpenMenu((current) => (current === 'notification' ? null : current)),
    [],
  );

  const closeProfile = useCallback(
    () => setOpenMenu((current) => (current === 'profile' ? null : current)),
    [],
  );

  const openChat = () => {
    setOpenMenu(null);
    chatModal.toggle();
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

        {/* 알림 패널이 이 묶음의 오른쪽 끝에 맞춰지도록 relative를 준다 */}
        <div className="relative flex items-center gap-2 justify-self-end">
          <NotificationDropdown
            isOpen={openMenu === 'notification'}
            onToggle={() => toggle('notification')}
            onClose={closeNotification}
            buttonClassName={iconButton}
          />
          <button
            type="button"
            className={iconButton}
            aria-label="채팅"
            onClick={openChat}
          >
            <MessageCircle size={24} />
            {/* 안 읽은 채팅 수는 KSJ의 채팅 API에서 온다. 연결하기 전까지는 0이라 배지가 숨겨진다 */}
            <CountBadge count={0} className="absolute right-px top-[5px]" />
          </button>
          <ProfileDropdown
            isOpen={openMenu === 'profile'}
            onToggle={() => toggle('profile')}
            onClose={closeProfile}
            buttonClassName={`${iconButton} border border-[#e2e7e7]`}
          />
        </div>
      </div>
    </header>
  );
}
