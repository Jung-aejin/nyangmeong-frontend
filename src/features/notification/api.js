/**
 * [알림 가짜 API]
 * - 알림 API(LJS 백엔드) 전까지 사용, api.get()으로 교체
 * - notiTypeCd는 AIMG02 확정 전 가짜 값, mvmnPath는 docs/routes.md 기준
 * - ?fakeUnread=0·120, ?fakeNotifications=0은 개발 환경 전용
 */
const fakeNotifications = [
  {
    inappNotiSn: 8,
    notiTypeCd: 'CARE_SCHDL',
    notiTypeCdNm: '케어 일정',
    notiTtl: '초코 예방접종 일정이 D-1 남았어요',
    notiCn: '',
    mvmnPath: '/health/calendar',
    prslDt: null,
  },
  {
    inappNotiSn: 7,
    notiTypeCd: 'CARE_SCHDL',
    notiTypeCdNm: '케어 일정',
    notiTtl: '보리 정기검진 일정이 오늘이에요',
    notiCn: '',
    mvmnPath: '/health/calendar',
    prslDt: '2026-10-19T09:00:00',
  },
  {
    inappNotiSn: 6,
    notiTypeCd: 'MTCH_DLNG',
    notiTypeCdNm: '펫돌봄',
    notiTtl: '이서연님이 매칭을 요청했어요',
    notiCn: '',
    mvmnPath: '/chat?otoChatRoomSn=1',
    prslDt: null,
  },
  {
    inappNotiSn: 5,
    notiTypeCd: 'JNT_BRUP',
    notiTypeCdNm: '공동양육',
    notiTtl: '이서연님이 뭉치의 공동양육자로 초대했어요',
    notiCn: '',
    mvmnPath: '/mypage/caregivers',
    prslDt: null,
  },
  {
    inappNotiSn: 4,
    notiTypeCd: 'CHRCTR',
    notiTypeCdNm: '캐릭터',
    notiTtl: '초코의 픽셀캐릭터가 완성됐어요',
    notiCn: '',
    mvmnPath: '/mypage/characters',
    prslDt: '2026-10-18T09:00:00',
  },
  {
    inappNotiSn: 3,
    notiTypeCd: 'INQRY_ANSWR',
    notiTypeCdNm: '문의 답변',
    notiTtl: '1:1 문의에 답변이 등록됐어요',
    notiCn: '',
    mvmnPath: '/inquiries/1',
    prslDt: '2026-10-17T09:00:00',
  },
  {
    inappNotiSn: 2,
    notiTypeCd: 'LOST_EXPRY',
    notiTypeCdNm: '실종 만료',
    notiTtl: '보리 제보 글이 7일 뒤 자동 삭제돼요',
    notiCn: '',
    mvmnPath: '/community/missing',
    prslDt: '2026-10-17T09:00:00',
  },
  {
    inappNotiSn: 1,
    notiTypeCd: 'NTC',
    notiTypeCdNm: '공지',
    notiTtl: '9/20 서버 점검 안내',
    notiCn: '',
    mvmnPath: '/notices/1',
    prslDt: '2026-10-16T09:00:00',
  },
];

const getQueryParam = (name) =>
  import.meta.env.DEV
    ? new URLSearchParams(window.location.search).get(name)
    : null;

const getFakeList = () =>
  getQueryParam('fakeNotifications') === '0' ? [] : fakeNotifications;

const getFakeUnreadCount = () => {
  const override = getQueryParam('fakeUnread');
  if (override !== null) return Number(override);
  return getFakeList().filter((item) => item.prslDt === null).length;
};

export const getUnreadCount = () =>
  Promise.resolve({ unreadCount: getFakeUnreadCount() });

/** notiTypeCd 유형 코드 배열 필터 */
export const getNotifications = ({ notiTypeCd, size = 5 }) => {
  const list = getFakeList().filter(
    (item) => !notiTypeCd || notiTypeCd.includes(item.notiTypeCd),
  );
  return Promise.resolve({
    content: list.slice(0, size).map((item) => ({ ...item })),
  });
};

export const readNotification = (inappNotiSn) => {
  const target = fakeNotifications.find(
    (item) => item.inappNotiSn === inappNotiSn,
  );
  if (target) target.prslDt = new Date().toISOString();
  return Promise.resolve();
};

/** 알림 설정 가짜 응답 (기본값 FN-COM-008-13, 개발 환경 ?fakeLimitSet=0·?fakeSaveError=1) */
const fakeSettings = {
  acntEml: 'jin****@gmail.com',
  emlNotiRcptnYn: true,
  inappNotiRcptnYn: true,
  careSchdlNotiRcptnYn: true,
  thdyBfhdNotiYn: false,
  d1BfhdNotiYn: true,
  d3BfhdNotiYn: false,
  d7BfhdNotiYn: false,
  mtchDlngNotiRcptnYn: true,
  cmntNotiRcptnYn: true,
  lostExpryNotiRcptnYn: true,
  expndLimNotiRcptnYn: false,
};

/** 설정 응답 (expndLimSetYn은 서버 계산값) */
const getFakeSettingsResponse = () => ({
  ...fakeSettings,
  expndLimSetYn: getQueryParam('fakeLimitSet') !== '0',
});

export const getNotificationSettings = () =>
  Promise.resolve(getFakeSettingsResponse());

export const saveNotificationSettings = (body) => {
  if (getQueryParam('fakeSaveError') === '1') {
    return Promise.reject(new Error('fake save error'));
  }
  Object.keys(fakeSettings).forEach((key) => {
    if (key in body) fakeSettings[key] = body[key];
  });
  return Promise.resolve(getFakeSettingsResponse());
};
