// Fake response until the notification API (YAY) exists. Replace with api.get() and match the real field name
// In dev only, ?fakeUnread=0 or ?fakeUnread=120 overrides the count to check the badge rules
const FAKE_UNREAD_COUNT = 3;

const getFakeUnreadCount = () => {
  if (!import.meta.env.DEV) return FAKE_UNREAD_COUNT;
  const override = new URLSearchParams(window.location.search).get('fakeUnread');
  return override === null ? FAKE_UNREAD_COUNT : Number(override);
};

export const getUnreadCount = () => Promise.resolve({ unreadCount: getFakeUnreadCount() });
