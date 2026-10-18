import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmModal from '@/components/ConfirmModal';
import { useChatModal } from '@/context/chatModal';
import { useLogout, useMemberSummary } from '@/features/member/queries';
import { closeAiWindow } from '@/hooks/useAiWindow';
import { PATHS } from '@/routes/paths';

const MENU_LINKS = [
  { label: '마이페이지', to: PATHS.MYPAGE },
  { label: '고객센터', to: PATHS.NOTICES },
  { label: '설정', to: PATHS.SETTINGS_NOTIFICATIONS },
];

const itemClass =
  'flex h-11 w-full items-center rounded-lg px-3 text-left text-base text-[#1a3234] hover:bg-[#f4f6f6]';

// 열려 있을 때만 마운트해서, 페이지를 열 때마다 회원 요약 요청이 나가지 않게 한다
function ProfileMenuPanel({ onClose, onLogout }) {
  const { data: summary } = useMemberSummary();

  return (
    <div
      role="menu"
      className="absolute right-0 top-[61px] z-40 w-60 rounded-[14px] border border-[#e2e7e7] bg-white p-2 shadow-lg"
    >
      {/* 요약을 불러오는 동안에도 상자 크기가 변하지 않게 min-h를 둔다 */}
      <div className="mb-1 min-h-[71px] border-b border-[#edf1f1] px-3 pb-2 pt-3.5">
        <p className="text-base font-bold leading-[26px] text-[#1a3234]">
          {summary?.mbrNcnm}
        </p>
        <p className="text-sm leading-[23px] text-[#667374]">
          {summary?.maskedAcntEml}
        </p>
      </div>
      {MENU_LINKS.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          role="menuitem"
          className={itemClass}
          onClick={onClose}
        >
          {item.label}
        </Link>
      ))}
      <button
        type="button"
        role="menuitem"
        className={itemClass}
        onClick={onLogout}
      >
        로그아웃
      </button>
    </div>
  );
}

export default function ProfileDropdown({
  isOpen,
  onToggle,
  onClose,
  buttonClassName,
}) {
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const chatModal = useChatModal();
  const logout = useLogout();

  // 토글 버튼이 rootRef 안에 있어서, 버튼 클릭이 바깥 클릭으로 처리되어 닫았다가 바로 다시 열리는 일이 없다
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleMouseDown = (event) => {
      if (!rootRef.current.contains(event.target)) onClose();
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        buttonRef.current.focus();
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // 모달이 닫힌 뒤에 포커스를 프로필 아이콘으로 돌려준다. 핸들러에서 바로 focus()를 부르면 이어지는 언마운트에서
  // ConfirmModal의 dialog.close()가 포커스를 이미 사라진 로그아웃 메뉴 항목으로 되돌려 body로 간다.
  // 자식의 정리(cleanup)가 부모의 effect보다 먼저 돌기 때문에 이 effect는 close() 뒤에 실행된다
  const wasConfirmOpenRef = useRef(false);
  useEffect(() => {
    if (wasConfirmOpenRef.current && !isConfirmOpen) buttonRef.current.focus();
    wasConfirmOpenRef.current = isConfirmOpen;
  }, [isConfirmOpen]);

  const handleLogoutClick = () => {
    onClose();
    setIsConfirmOpen(true);
  };

  const handleLogoutCancel = () => {
    logout.reset();
    setIsConfirmOpen(false);
  };

  const handleLogoutConfirm = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        closeAiWindow();
        chatModal.close();
        // 다음 로그인 때 이전 회원의 캐시가 보이지 않게 비운다
        queryClient.clear();
        setIsConfirmOpen(false);
        navigate(PATHS.HOME);
      },
    });
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        className={buttonClassName}
        aria-label="프로필"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <User size={24} />
      </button>
      {isOpen && (
        <ProfileMenuPanel onClose={onClose} onLogout={handleLogoutClick} />
      )}
      {isConfirmOpen && (
        <ConfirmModal
          title="로그아웃하시겠어요?"
          confirmLabel="로그아웃"
          errorMessage={
            logout.isError
              ? '로그아웃하지 못했어요. 잠시 후 다시 시도해 주세요.'
              : undefined
          }
          isPending={logout.isPending}
          onConfirm={handleLogoutConfirm}
          onCancel={handleLogoutCancel}
        />
      )}
    </div>
  );
}
