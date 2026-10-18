// 알림 API(YAY)가 생기기 전까지 쓰는 가짜 응답이다. api.get()으로 바꾸고 실제 필드 이름에 맞춘다
// notiTypeCd 값은 AIMG02 코드값이 정해지기 전의 가짜다. mvmnPath는 docs/routes.md의 알림 클릭 이동 대상이다
// 개발 환경에서만 ?fakeUnread=0, ?fakeUnread=120으로 미읽음 수를, ?fakeNotifications=0으로 알림 0건을 확인할 수 있다
const fakeNotifications = [
  {
    inappNotiSn: 7,
    notiTypeCd: 'CARE_SCHDL',
    notiTypeCdNm: '케어 일정',
    notiTtl: '초코 심장사상충 예방일이 내일이에요',
    notiCn: '',
    mvmnPath: '/health/calendar',
    prslDt: null,
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

// notiTypeCd는 유형 코드 배열이다. 없으면 전체를 준다
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
