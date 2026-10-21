import { useCallback } from 'react';
import { PATHS } from '@/routes/paths';

/** 고정된 창 이름: window.open이 기존 채팅 창 재사용 */
const CHAT_WINDOW_NAME = 'nyangmeong-chat';

/** 채팅 창 크기: 디자인의 채팅 박스(1040x780) */
const CHAT_WINDOW_WIDTH = 1040;
const CHAT_WINDOW_HEIGHT = 780;

/** 탭이 아닌 별도 창 옵션: 본창 가운데 */
const getPopupFeatures = () => {
  const width = Math.min(CHAT_WINDOW_WIDTH, window.screen.availWidth);
  const height = Math.min(CHAT_WINDOW_HEIGHT, window.screen.availHeight);
  const left = Math.round(window.screenX + (window.outerWidth - width) / 2);
  const top = Math.round(window.screenY + (window.outerHeight - height) / 2);
  return `popup,width=${width},height=${height},left=${left},top=${top}`;
};

/** 열린 채팅 창 닫기 */
export function closeChatWindow() {
  window.open('', CHAT_WINDOW_NAME)?.close();
}

/**
 * open({ otoChatRoomSn?, pstSn? }) 반환, 창 열림 true·팝업 차단 false
 * - 클릭 핸들러에서 바로 호출: 요청을 기다린 뒤 부르면 팝업 차단
 */
export default function useChatWindow() {
  return useCallback(({ otoChatRoomSn, pstSn } = {}) => {
    /** 빈 URL: 기존 창 재사용, 창 옵션은 새로 열 때만 적용 */
    const chatWindow = window.open('', CHAT_WINDOW_NAME, getPopupFeatures());
    if (!chatWindow) return false;

    const params = new URLSearchParams();
    if (otoChatRoomSn != null) params.set('otoChatRoomSn', otoChatRoomSn);
    if (pstSn != null) params.set('pstSn', pstSn);
    const query = params.toString();

    /** 새 창이거나 방 지정이면 이동, 아니면 보던 방 그대로 */
    if (chatWindow.location.href === 'about:blank' || query) {
      chatWindow.location.href = query ? `${PATHS.CHAT}?${query}` : PATHS.CHAT;
    }
    chatWindow.focus();
    return true;
  }, []);
}
