import { useCallback } from 'react';
import { PATHS } from '@/routes/paths';

// 이름을 고정해 두면 window.open이 새 창을 열지 않고 기존 채팅 창을 찾는다
const AI_WINDOW_NAME = 'nyangmeong-ai';

// 열려 있는 AI 창을 닫는다. 같은 이름으로 window.open을 부르면 기존 창을 다시 불러오지 않고 그대로 돌려준다.
// 창이 없으면 빈 창이 새로 열리므로 바로 닫는다
export function closeAiWindow() {
  window.open('', AI_WINDOW_NAME)?.close();
}

// open(firstMessage?)을 돌려준다. 창이 열려 있으면 true, 팝업이 막히면 false
export default function useAiWindow() {
  return useCallback((firstMessage) => {
    // 빈 URL: 이름이 같은 창을 그대로 쓰고 다시 불러오지 않는다
    const aiWindow = window.open('', AI_WINDOW_NAME);
    if (!aiWindow) return false;

    if (aiWindow.location.href === 'about:blank') {
      // 새로 열린 창: 채팅 페이지로 보낸다
      const query = firstMessage ? `?q=${encodeURIComponent(firstMessage)}` : '';
      aiWindow.location.href = `${PATHS.AI}${query}`;
    } else {
      aiWindow.focus();
    }
    return true;
  }, []);
}
