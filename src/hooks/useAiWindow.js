import { useCallback } from 'react';
import { PATHS } from '@/routes/paths';

// Fixed name lets window.open find the existing chat window instead of opening another
const AI_WINDOW_NAME = 'nyangmeong-ai';

// Returns open(firstMessage?) -> true if the window is open, false if the popup was blocked
export default function useAiWindow() {
  return useCallback((firstMessage) => {
    // Empty URL: reuse the named window as-is, never reload it
    const aiWindow = window.open('', AI_WINDOW_NAME);
    if (!aiWindow) return false;

    if (aiWindow.location.href === 'about:blank') {
      // Newly opened window: send it to the chat page
      const query = firstMessage ? `?q=${encodeURIComponent(firstMessage)}` : '';
      aiWindow.location.href = `${PATHS.AI}${query}`;
    } else {
      aiWindow.focus();
    }
    return true;
  }, []);
}
