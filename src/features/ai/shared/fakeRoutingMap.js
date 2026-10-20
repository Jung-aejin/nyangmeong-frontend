import { PATHS } from '@/routes/paths';

/**
 * [가짜 라우팅 매핑]
 * - AI 서버 연결 전 라우팅 판정 대체, 연결하면 삭제
 * - 기능명세서 부록 매핑표 기반, 행 순서가 우선순위
 */
export const CHAT_MODAL_ACTION = 'CHAT_MODAL';

export const fakeRoutingMap = [
  {
    label: '종합 건강기록',
    path: PATHS.HEALTH,
    keywords: [
      '건강기록',
      '종합 건강기록',
      '건강 종합',
      '건강 이력',
      '우리 애 상태',
    ],
  },
  {
    label: '플레이스 병원',
    path: `${PATHS.PLACES}?category=hospital`,
    keywords: ['병원', '동물병원', '진료', '아파', '병원 찾아줘'],
  },
  { label: '플레이스', path: PATHS.PLACES, keywords: ['플레이스'] },
  {
    label: '펫이야기',
    path: PATHS.COMMUNITY,
    keywords: ['커뮤니티', '게시판', '펫이야기', '글 보고 싶어'],
  },
  {
    label: '마이페이지',
    path: PATHS.MYPAGE,
    keywords: ['마이페이지', '내 정보', '내 페이지'],
  },
  {
    label: '픽셀 캐릭터',
    path: PATHS.MYPAGE_CHARACTERS,
    keywords: ['캐릭터', '픽셀', '꾸미기', '아이템'],
  },
  {
    label: '공지사항',
    path: PATHS.NOTICES,
    keywords: ['고객센터', '문의', '공지', '공지사항'],
  },
  {
    label: '메인',
    path: PATHS.MAIN,
    keywords: [
      '메인',
      '홈',
      '처음으로',
      '대시보드',
      '통합대시보드',
      '건강 대시보드',
    ],
  },
  {
    label: '알림 설정',
    path: PATHS.SETTINGS_NOTIFICATIONS,
    keywords: ['설정', '알림 설정', '알림 꺼줘', '알림 켜줘', '수신 해제'],
  },
  {
    label: '채팅',
    action: CHAT_MODAL_ACTION,
    keywords: ['채팅', '메시지', '쪽지', '대화 확인'],
  },
  {
    label: '케어 캘린더',
    path: PATHS.HEALTH_CALENDAR,
    keywords: [
      '케어 캘린더',
      '캘린더',
      '일정 보여줘',
      '일정 등록',
      '접종 일정',
      '다음 접종',
      '예방접종 예정',
      '정기검진 일정',
      '병원 예약',
    ],
  },
  {
    label: '토탈 케어리스트',
    path: PATHS.HEALTH_CALENDAR,
    keywords: [
      '케어리스트',
      '토탈 케어리스트',
      '데일리케어',
      '일상관리',
      '정기관리',
      '투약 체크',
      '심장사상충',
      '구충',
    ],
  },
  {
    label: '건강 일지',
    path: PATHS.HEALTH_DIARY,
    keywords: [
      '건강 일지',
      '일상 기록',
      '오늘 기록',
      '체중',
      '식사량',
      '음수량',
      '배변',
      '산책 기록',
      '검진기록',
      '검진 이력',
      '진료 내역',
      '지속 관찰',
      '관찰 기록',
    ],
  },
  {
    label: '건강 일지 검진기록',
    path: PATHS.HEALTH_DIARY,
    keywords: [
      '병원 영수증',
      '약봉투',
      '진료비 영수증',
      '영수증으로 검진 등록',
    ],
  },
  {
    label: '처방 및 투약 이력',
    path: PATHS.HEALTH,
    keywords: ['처방약', '약', '복용 중인 약', '투약 이력'],
  },
  {
    label: '검사 결과',
    path: PATHS.HEALTH,
    keywords: [
      '검사 결과',
      '혈액검사 결과',
      '검사 수치',
      '수치 추이',
      '검사지',
    ],
  },
  {
    label: '플레이스 미용',
    path: `${PATHS.PLACES}?category=beauty`,
    keywords: ['미용', '애견미용', '미용실', '털 깎'],
  },
  {
    label: '플레이스 용품',
    path: `${PATHS.PLACES}?category=goods`,
    keywords: ['용품', '사료 파는 곳', '펫샵'],
  },
  {
    label: '플레이스 동반',
    path: `${PATHS.PLACES}?category=pet-friendly`,
    keywords: ['동반', '같이 갈 수 있는', '애견동반 카페'],
  },
  {
    label: '플레이스 호텔',
    path: `${PATHS.PLACES}?category=hotel`,
    keywords: ['호텔', '맡길 곳', '펫호텔'],
  },
  {
    label: '실종센터',
    path: PATHS.COMMUNITY_MISSING,
    keywords: ['실종', '잃어버렸어', '실종센터', '찾아주세요', '제보'],
  },
  {
    label: '펫뉴스',
    path: PATHS.COMMUNITY_NEWS,
    keywords: ['뉴스', '펫뉴스', '소식'],
  },
  {
    label: '우리동네 펫돌봄',
    path: PATHS.COMMUNITY_PETCARE,
    keywords: ['펫돌봄', '돌봄', '펫시터', '산책 도우미', '맡아주실 분'],
  },
  {
    label: '반려동물 등록',
    path: PATHS.MYPAGE_PETS,
    keywords: ['반려동물 등록', '프로필 등록', '우리 애 정보'],
  },
  /** paths.js에 없는 경로는 docs/routes.md 값 */
  {
    label: '공동양육',
    path: '/mypage/caregivers',
    keywords: ['공동양육', '같이 키우', '초대'],
  },
  {
    label: '포인트·케어미션',
    path: '/mypage/points',
    keywords: ['포인트', '케어미션', '미션'],
  },
  {
    label: '가계부',
    path: PATHS.MYPAGE_EXPENSES,
    keywords: ['가계부', '지출', '얼마 썼', '병원비', '한도', '가계부 영수증'],
  },
  {
    label: '가계부 전체 내역',
    path: PATHS.MYPAGE_EXPENSES_ALL,
    keywords: ['전체 내역', '지출 내역 다 보여줘'],
  },
  {
    label: '회원정보 수정',
    path: '/mypage/profile',
    keywords: ['회원정보', '비밀번호 변경', '닉네임 변경', '탈퇴'],
  },
  {
    label: '자주 묻는 질문',
    path: PATHS.FAQS,
    keywords: ['자주하는 질문', 'FAQ', '도움말'],
  },
];

/** 일정 등록 요청 판별 */
const REGISTER_VERB = /등록|잡아|추가|넣어/;
const DATE_EXPRESSION =
  /다음 ?주|이번 ?주|내일|모레|오늘|\d+월|\d+일|[월화수목금토일]요일|매주|매일|매달|매년|\d+시|오전|오후|마다/;

export const isRegisterRequest = (text) =>
  REGISTER_VERB.test(text) && DATE_EXPRESSION.test(text);

/** 최장 키워드 일치 행 선택 */
export const matchRoute = (text) => {
  let best = null;
  let bestLength = 0;
  for (const row of fakeRoutingMap) {
    for (const keyword of row.keywords) {
      if (text.includes(keyword) && keyword.length > bestLength) {
        best = row;
        bestLength = keyword.length;
      }
    }
  }
  return best;
};
