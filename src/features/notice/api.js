/**
 * [공지 가짜 응답]
 * - 공지 API(KSJ 백엔드) 연결 전: api.get()으로 교체
 * - ntcMttrSn 외 키(ntcMttrTtl·ntcMttrCn·fixYn·crtDt·vwCnt): Swagger 전 가정
 * - 고정 공지: 일반 공지 41건과 별도로 첫 쪽 맨 위, 쪽 크기 포함 여부는 연결 때 확인
 */
const fakePinned = {
  ntcMttrSn: 42,
  ntcMttrTtl: '8월 정기 점검 안내 (8/15 02:00~04:00)',
  ntcMttrCn:
    '안녕하세요, 냥멍케어입니다.\n서비스 안정화를 위한 정기 점검이 아래와 같이 진행될 예정입니다.\n\n· 점검 일시 : 2026년 8월 15일(토) 02:00 ~ 04:00 (2시간)\n· 점검 내용 : 서버 안정화 및 보안 패치\n· 점검 시간 동안 앱 및 웹 서비스 이용이 일시 중단됩니다.\n\n이용에 불편을 드려 죄송하며, 더 나은 서비스로 보답하겠습니다.\n감사합니다.',
  fixYn: true,
  crtDt: '2026-08-08',
  vwCnt: 512,
};

const figmaNotices = [
  ['실종센터 이용 가이드라인 안내', '2026-08-05'],
  ['커뮤니티 이용 수칙 개정 안내', '2026-07-28'],
  ['개인정보처리방침 개정 사전 안내', '2026-07-20'],
  ['앱 신규 버전(v2.3) 출시 안내', '2026-07-12'],
  ['여름철 반려동물 안전 수칙 안내', '2026-07-02'],
  ['펫돌봄 게시판 오픈 안내', '2026-06-20'],
  ['위치기반서비스 이용약관 개정 안내', '2026-06-10'],
  ['안전한 계정 사용을 위한 비밀번호 변경 권장 안내', '2026-05-28'],
  ['케어미션 포인트 적립 기준 변경 안내', '2026-05-15'],
  ['5월 정기 점검 완료 안내', '2026-05-09'],
];

const fakeRegulars = Array.from({ length: 41 }, (_, index) => {
  const ntcMttrSn = 41 - index;
  const [ntcMttrTtl, crtDt] = figmaNotices[index] ?? [
    `냥멍케어 서비스 안내 ${ntcMttrSn}`,
    `2026-04-${String(Math.max(1, 40 - index)).padStart(2, '0')}`,
  ];
  return {
    ntcMttrSn,
    ntcMttrTtl,
    ntcMttrCn: `${ntcMttrTtl}에 대한 본문이에요.\n냥멍케어를 이용해 주셔서 감사합니다.`,
    fixYn: false,
    crtDt,
    vwCnt: 100 + ntcMttrSn,
  };
});

const fakeNotices = [fakePinned, ...fakeRegulars];

/** 제목·내용 일치 */
const matchesKeyword = (item, keyword) =>
  item.ntcMttrTtl.includes(keyword) || item.ntcMttrCn.includes(keyword);

export const getNotices = ({ page = 1, size = 10, keyword = '' } = {}) => {
  const trimmed = keyword.trim();
  const matched = fakeNotices.filter((item) => matchesKeyword(item, trimmed));
  const pinned = matched.filter((item) => item.fixYn);
  const regulars = matched.filter((item) => !item.fixYn);
  const totalPages = Math.ceil(regulars.length / size);
  return Promise.resolve({
    content: [
      ...(page === 1 ? pinned : []),
      ...regulars.slice((page - 1) * size, page * size),
    ],
    page,
    size,
    totalElements: regulars.length,
    totalPages,
    hasNext: page < totalPages,
  });
};

export const getNotice = (ntcMttrSn) => {
  const target = fakeNotices.find((item) => item.ntcMttrSn === ntcMttrSn);
  return target
    ? Promise.resolve({ ...target })
    : Promise.reject(new Error('공지를 찾지 못했어요'));
};
