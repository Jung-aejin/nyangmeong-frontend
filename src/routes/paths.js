// 도메인별 구획 안에 추가한다. 맨 끝에 붙이면 병합할 때 충돌한다
export const PATHS = {
  // 공통
  HOME: '/',
  NOTICES: '/notices',
  FAQS: '/faqs',
  INQUIRIES: '/inquiries',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',

  // account
  LOGIN: '/login',

  // main
  MAIN: '/main',

  // ai
  AI: '/ai',

  // health
  HEALTH: '/health',
  HEALTH_DIARY: '/health/diary',
  HEALTH_CALENDAR: '/health/calendar',

  // place
  PLACES: '/places',

  // community
  COMMUNITY: '/community',
  COMMUNITY_MISSING: '/community/missing',
  COMMUNITY_NEWS: '/community/news',
  COMMUNITY_PETCARE: '/community/petcare',

  // mypage
  MYPAGE: '/mypage',
  MYPAGE_EXPENSES: '/mypage/expenses',
  MYPAGE_CHARACTERS: '/mypage/characters',

  // admin
  ADMIN: '/admin',
};
