/**
 * [1:1 문의 가짜 응답]
 * - 문의 API(KSJ 백엔드) 연결 전: api.get()·post()·put()으로 교체
 * - otoInqrySn 외 키(inqryTyNm·inqryTtl·inqryCn·atchFiles·ansCn·ansDt·crtDt): Swagger 전 가정
 * - 목록·상세·작성·수정이 같은 배열을 보고, 새로 고치면 처음 12건으로 돌아간다
 * - 첨부 이미지는 업로드하지 않고 미리보기 주소(blob:)를 그대로 저장한다
 * - 처음 열 때 주소에 ?fakeEmpty가 있으면 빈 배열로 시작한다(0건 확인용, 연결 때 지운다)
 */
export const INQUIRY_TYPES = [
  '건강기록 문의',
  '픽셀 캐릭터',
  '플레이스',
  '커뮤니티',
  '포인트·결제·가계부',
  '계정·로그인',
  '기타',
];

export const INQUIRY_STATUS = { OPEN: '미답변', DONE: '답변 완료' };

const REPLY = {
  ansCn:
    '안녕하세요, 냥멍케어 고객센터입니다.\n펫돌봄 예약 변경으로 불편을 겪으셨군요.\n\n펫돌봄은 보호자와 돌보미가 채팅으로 직접 일정을 정하는 방식이라, 예약 변경 · 취소에 대한 별도의 배상 규정은 없어요.\n변경이 어려우시면 채팅에서 기존 일정 유지를 요청하시거나, 매칭을 취소하고 다른 돌보미를 찾으실 수 있어요.\n\n상대 이용자가 반복적으로 약속을 어기는 경우에는 게시글의 [신고하기]로 알려 주시면 확인 후 조치할게요.\n감사합니다.',
  ansDt: '2026-09-19 10:05',
};

/** 첨부 이미지 가짜: 회색 바탕 이미지 */
const SEED_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="296" height="296"><rect width="296" height="296" fill="#eef1f1"/><rect x="100" y="108" width="96" height="80" rx="8" fill="none" stroke="#b9c4c4" stroke-width="6"/></svg>',
)}`;

const designInquiries = [
  [
    '커뮤니티',
    '펫돌봄 거래 중 예약 변경에 대한 문의',
    '2026-09-18 14:32',
    false,
  ],
  [
    '픽셀 캐릭터',
    '픽셀 캐릭터 생성 오류 - 꼬리 위치 오류',
    '2026-09-15 09:20',
    true,
  ],
  ['계정·로그인', '계정 연동 관련 문의', '2026-09-10 18:41', true],
  [
    '포인트·결제·가계부',
    '케어미션 포인트 적립 누락 문의',
    '2026-09-05 11:03',
    true,
  ],
  [
    '건강기록 문의',
    '건강 일지 체중 기록이 저장되지 않아요',
    '2026-08-28 20:15',
    true,
  ],
  ['플레이스', '동물병원 영업시간 정보 수정 요청', '2026-08-20 13:50', true],
  ['기타', '알림 받는 시간을 바꿀 수 있나요?', '2026-08-11 08:30', true],
];

/** 2쪽을 채우는 자리 채움 */
const fillerInquiries = Array.from({ length: 5 }, (_, index) => [
  INQUIRY_TYPES[index % INQUIRY_TYPES.length],
  `문의드려요 ${index + 8}`,
  `2026-07-${String(20 - index * 3).padStart(2, '0')} 10:00`,
  index % 2 === 0,
]);

const seedInquiries = () =>
  [...designInquiries, ...fillerInquiries]
    .map(([inqryTyNm, inqryTtl, crtDt, isDone], index) => ({
      otoInqrySn: 12 - index,
      inqryTyNm,
      inqryTtl,
      inqryCn: `${inqryTtl}에 대한 문의 내용이에요.\n확인 부탁드려요.`,
      atchFiles: [],
      ...(isDone ? REPLY : { ansCn: null, ansDt: null }),
      crtDt,
    }))
    .map((item, index) =>
      index === 0
        ? {
            ...item,
            atchFiles: [
              {
                id: 'seed-1',
                name: 'reservation_capture.png',
                url: SEED_IMAGE,
              },
            ],
            inqryCn:
              '안녕하세요. 펫돌봄 예약 건에 대해 문의드립니다.\n2026년 9월 20일 예약으로 진행하던 중, 상대 이용자가 갑자기 예약을 변경하려고 합니다.\n이미 일정을 맞춰두었는데, 이에 대한 규정이 무엇인지 알고 싶습니다.\n또한 예약 변경으로 인한 피해 배상 방법이 있는지도 궁금합니다.',
          }
        : item,
    );

let fakeInquiries = window.location.search.includes('fakeEmpty')
  ? []
  : seedInquiries();

const isAnswered = (item) => Boolean(item.ansCn);

const nowText = () => {
  const date = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/** status: '' 전체, INQUIRY_STATUS 값. 접수일 최신순 */
export const getInquiries = ({ page = 1, size = 10, status = '' } = {}) => {
  const sorted = [...fakeInquiries].sort((a, b) =>
    b.crtDt.localeCompare(a.crtDt),
  );
  const matched = sorted.filter(
    (item) => !status || isAnswered(item) === (status === INQUIRY_STATUS.DONE),
  );
  const totalPages = Math.ceil(matched.length / size);
  return Promise.resolve({
    content: matched.slice((page - 1) * size, page * size),
    page,
    size,
    totalElements: matched.length,
    totalPages,
    hasNext: page < totalPages,
    /** 상태 필터와 관계없는 전체 건수: 0건이면 작성 화면으로 보낸다 */
    totalAll: fakeInquiries.length,
  });
};

export const getInquiry = (otoInqrySn) => {
  const target = fakeInquiries.find((item) => item.otoInqrySn === otoInqrySn);
  return target
    ? Promise.resolve({ ...target })
    : Promise.reject(new Error('문의를 찾지 못했어요'));
};

export const createInquiry = ({ inqryTyNm, inqryTtl, inqryCn, atchFiles }) => {
  const otoInqrySn =
    Math.max(0, ...fakeInquiries.map((item) => item.otoInqrySn)) + 1;
  const created = {
    otoInqrySn,
    inqryTyNm,
    inqryTtl,
    inqryCn,
    atchFiles,
    ansCn: null,
    ansDt: null,
    crtDt: nowText(),
  };
  fakeInquiries = [created, ...fakeInquiries];
  return Promise.resolve({ otoInqrySn });
};

export const updateInquiry = ({
  otoInqrySn,
  inqryTyNm,
  inqryTtl,
  inqryCn,
  atchFiles,
}) => {
  const target = fakeInquiries.find((item) => item.otoInqrySn === otoInqrySn);
  if (!target) return Promise.reject(new Error('문의를 찾지 못했어요'));
  if (isAnswered(target)) {
    return Promise.reject(new Error('답변이 등록된 문의는 수정할 수 없어요'));
  }
  Object.assign(target, { inqryTyNm, inqryTtl, inqryCn, atchFiles });
  return Promise.resolve({ otoInqrySn });
};
