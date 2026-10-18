// 알림 API(YAY)가 생기기 전까지 쓰는 가짜 응답이다. api.get()으로 바꾸고 실제 필드 이름에 맞춘다
// 개발 환경에서만 ?fakeUnread=0, ?fakeUnread=120으로 개수를 바꿔 배지 규칙을 확인할 수 있다
const FAKE_UNREAD_COUNT = 3;

const getFakeUnreadCount = () => {
  if (!import.meta.env.DEV) return FAKE_UNREAD_COUNT;
  const override = new URLSearchParams(window.location.search).get('fakeUnread');
  return override === null ? FAKE_UNREAD_COUNT : Number(override);
};

export const getUnreadCount = () => Promise.resolve({ unreadCount: getFakeUnreadCount() });
