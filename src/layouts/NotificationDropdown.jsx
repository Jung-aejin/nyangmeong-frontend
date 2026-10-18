import { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CountBadge from '@/components/CountBadge';
import { useChatModal } from '@/context/chatModal';
import NotificationItem from '@/features/notification/NotificationItem';
import { NOTI_TABS, NOTI_TYPE } from '@/features/notification/notiTabs';
import {
  useNotifications,
  useReadNotification,
  useUnreadCount,
} from '@/features/notification/queries';

// 열려 있을 때만 마운트해서, 페이지를 열 때마다 알림 목록 요청이 나가지 않게 한다. 탭도 열 때마다 처음으로 돌아온다
function NotificationPanel({ unreadCount, onClose }) {
  const [tab, setTab] = useState(NOTI_TABS[0]);
  const { data } = useNotifications(tab);
  const readNotification = useReadNotification();
  const navigate = useNavigate();
  const chatModal = useChatModal();

  // 읽음 처리가 성공한 뒤에 이동한다. 이미 읽은 알림은 읽음 요청 없이 바로 이동한다
  const handleItemClick = (notification) => {
    const go = () => {
      onClose();
      // 펫돌봄 거래 상태는 화면 이동 없이 채팅 모달을 띄운다. 어떤 방을 열지는 SCR-COM-009에서 연결한다
      if (notification.notiTypeCd === NOTI_TYPE.MTCH_DLNG) {
        chatModal.open();
      } else {
        navigate(notification.mvmnPath);
      }
    };

    if (notification.prslDt !== null) {
      go();
      return;
    }
    readNotification.mutate(notification.inappNotiSn, { onSuccess: go });
  };

  return (
    <div className="absolute right-0 top-[61px] z-40 w-[380px] overflow-hidden rounded-[14px] border border-[#e2e7e7] bg-white shadow-lg">
      <div className="flex items-center justify-between px-[18px] pb-2 pt-3.5">
        <h2 className="text-base font-bold leading-[26px] text-[#1a3234]">
          알림
        </h2>
        <p className="text-base font-medium leading-[26px] text-[#566465]">
          미읽음 <span className="font-bold text-[#f44b21]">{unreadCount}</span>
        </p>
      </div>
      <div className="flex gap-1.5 border-b border-[#edf1f1] px-[18px] pb-3">
        {NOTI_TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            aria-pressed={item.key === tab.key}
            className={`h-[30px] rounded-full border px-3 text-sm ${
              item.key === tab.key
                ? 'border-[#285a5c] bg-[#285a5c] text-white'
                : 'border-[#e2e7e7] bg-white text-[#3d4a4b] hover:bg-[#f4f6f6]'
            }`}
            onClick={() => setTab(item)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {data?.content.length === 0 && (
        <p className="px-[18px] py-10 text-center text-base text-[#667374]">
          새 알림이 없어요
        </p>
      )}
      {data?.content.map((notification) => (
        <NotificationItem
          key={notification.inappNotiSn}
          notification={notification}
          onClick={handleItemClick}
        />
      ))}
    </div>
  );
}

export default function NotificationDropdown({
  isOpen,
  onToggle,
  onClose,
  buttonClassName,
}) {
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const { data: unread } = useUnreadCount();

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

  // 이 root에는 position을 주지 않는다. 패널이 헤더 오른쪽 묶음의 오른쪽 끝에 맞춰져야 한다
  return (
    <div ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className={`${buttonClassName} ${isOpen ? 'bg-[#ebf0f0]' : ''}`}
        aria-label="알림"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <Bell size={24} />
        <CountBadge
          count={unread?.unreadCount}
          className="absolute right-px top-[5px]"
        />
      </button>
      {isOpen && (
        <NotificationPanel
          unreadCount={unread?.unreadCount ?? 0}
          onClose={onClose}
        />
      )}
    </div>
  );
}
