import { useCallback, useEffect, useRef, useState } from 'react';
import { Menu } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import chatIcon from '@/assets/icons/chat.svg';
import logo from '@/assets/nm_logo.svg';
import CountBadge from '@/components/CountBadge';
import { useChatModal } from '@/context/chatModal';
import { PATHS } from '@/routes/paths';
import GnbDropdown from './GnbDropdown';
import { GNB_MENUS } from './gnbMenus';
import NavDrawer from './NavDrawer';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown, { LogoutConfirm } from './ProfileDropdown';

const GNB_OPEN_DELAY = 200;
const GNB_CLOSE_DELAY = 300;

const iconButton =
  'relative flex h-[42px] w-[42px] items-center justify-center rounded-full text-[#3d4a4b] hover:bg-[#f4f6f6]';

export default function UserHeader() {
  /** 열린 드롭다운 하나: gnb | notification | profile | drawer | null */
  const [openMenu, setOpenMenu] = useState(null);
  /** drawer의 로그아웃 확인 모달 */
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const hamburgerRef = useRef(null);
  /** GNB 카드를 보여 줄 1차 메뉴 순번 */
  const [gnbIndex, setGnbIndex] = useState(0);
  const chatModal = useChatModal();

  const gnbRef = useRef(null);
  const gnbTimer = useRef(null);
  const skipGnbFocus = useRef(false);

  useEffect(() => () => clearTimeout(gnbTimer.current), []);

  const toggle = (name) =>
    setOpenMenu((current) => (current === name ? null : name));

  /** 지연 뒤 GNB 카드 열기·닫기 */
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
    /** ESC 포커스 복귀로 방금 닫은 패널이 다시 열리는 것 방지 */
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
      /** 카드가 열린 1차 메뉴로 포커스 복귀 */
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
    () =>
      setOpenMenu((current) => (current === 'notification' ? null : current)),
    [],
  );

  const closeProfile = useCallback(
    () => setOpenMenu((current) => (current === 'profile' ? null : current)),
    [],
  );

  const closeDrawer = useCallback(() => {
    setOpenMenu((current) => (current === 'drawer' ? null : current));
    hamburgerRef.current?.focus();
  }, []);

  const handleDrawerLogout = () => {
    setOpenMenu(null);
    setIsLogoutOpen(true);
  };

  const closeLogout = () => setIsLogoutOpen(false);

  const openChat = () => {
    setOpenMenu(null);
    chatModal.toggle();
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 border-b border-[#e2e7e7] bg-white">
        <div className="mx-auto grid h-full max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-8 max-[1100px]:flex max-[1100px]:gap-3 max-[760px]:px-4">
          <Link to={PATHS.MAIN} className="justify-self-start">
            <img src={logo} alt="냥멍케어" className="h-8 w-[121px]" />
          </Link>

          {/** 1100px 이하에서는 drawer가 대신함 */}
          <div
            ref={gnbRef}
            className="max-[1100px]:hidden"
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

          {/** 알림 패널을 묶음 오른쪽 끝에 맞추는 relative */}
          <div className="relative flex items-center gap-2 justify-self-end max-[1100px]:ml-auto max-[760px]:gap-1">
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
              <img
                src={chatIcon}
                alt=""
                aria-hidden="true"
                className="size-6"
              />
              {/** 안 읽은 채팅 수(KSJ 채팅 API 연결 전 0) */}
              <CountBadge count={0} className="absolute right-px top-[5px]" />
            </button>
            {/** 1100px 이하에서는 drawer의 회원 요약이 대신함 */}
            <div className="max-[1100px]:hidden">
              <ProfileDropdown
                isOpen={openMenu === 'profile'}
                onToggle={() => toggle('profile')}
                onClose={closeProfile}
                buttonClassName={iconButton}
              />
            </div>
            <button
              ref={hamburgerRef}
              type="button"
              className={`${iconButton} min-[1100px]:hidden`}
              aria-label="전체 메뉴 열기"
              aria-controls="nav-drawer"
              aria-expanded={openMenu === 'drawer'}
              onClick={() => toggle('drawer')}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>
      {/** header의 stacking context 밖: 플로팅 버튼·채팅 모달 위에 표시 */}
      {openMenu === 'drawer' && (
        <NavDrawer onClose={closeDrawer} onLogout={handleDrawerLogout} />
      )}
      {isLogoutOpen && <LogoutConfirm onClose={closeLogout} />}
    </>
  );
}
