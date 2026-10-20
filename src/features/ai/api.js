import { IS_DEV } from '@/api/env';
import { PATHS } from '@/routes/paths';
import { isRegisterRequest, matchRoute } from './fakeRoutingMap';

/**
 * [가짜 대화 API]
 * - Python AI 서버 연결 전 임시 응답, 연결 시 api.get()·api.delete()로 교체
 * - 필드 이름은 ERD 컬럼명 기반 추정, 연결 때 Swagger로 확인
 */

/** n일 전 일시(타임존 없는 형태) */
const daysAgo = (days, hour) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(hour)}:00:00`;
};

const fakeVaccineMessages = [
  {
    aiCnvrsMsgSn: 1,
    aiCnvrsMsgRoleCd: 'USER',
    aiCnvrsMsgCn: '강아지 예방접종 순서 알려줘',
    aiCnvrsMsgCmptnYn: 'Y',
  },
  {
    aiCnvrsMsgSn: 2,
    aiCnvrsMsgRoleCd: 'AI',
    aiCnvrsMsgCn:
      '생후 6~8주부터 종합백신(DHPPL) 1차를 시작으로 2~4주 간격으로 5차까지 맞히고, 코로나 장염·켄넬코프·인플루엔자·광견병을 순서대로 이어서 접종해요. 기초 접종이 끝나면 1년에 한 번 추가 접종을 권장해요.\n\n※ 참고 정보이며 의료 진단이 아닙니다.',
    aiCnvrsMsgCmptnYn: 'Y',
  },
];

let fakeConversations = [
  {
    aiCnvrsRoomSn: 1,
    aiCnvrsRoomCnvrsTtl: '예방접종 순서 문의',
    petSn: 1,
    petNm: '초코',
    crtDt: daysAgo(0, 9),
    messages: fakeVaccineMessages,
  },
  {
    aiCnvrsRoomSn: 2,
    aiCnvrsRoomCnvrsTtl: '강아지 예방접종 순서 알려줘',
    petSn: 1,
    petNm: '초코',
    crtDt: daysAgo(1, 15),
    messages: fakeVaccineMessages,
  },
  {
    aiCnvrsRoomSn: 3,
    aiCnvrsRoomCnvrsTtl: '산책 시간 얼마나 해야 해?',
    petSn: null,
    petNm: null,
    crtDt: daysAgo(1, 11),
    messages: [
      {
        aiCnvrsMsgSn: 3,
        aiCnvrsMsgRoleCd: 'USER',
        aiCnvrsMsgCn: '산책 시간 얼마나 해야 해?',
        aiCnvrsMsgCmptnYn: 'Y',
      },
      {
        aiCnvrsMsgSn: 4,
        aiCnvrsMsgRoleCd: 'AI',
        aiCnvrsMsgCn:
          '견종과 나이에 따라 달라서 하루 30분에서 1시간 정도가 일반적이에요.\n\n※ 참고 정보이며 의료 진단이 아닙니다.',
        aiCnvrsMsgCmptnYn: 'Y',
      },
    ],
  },
  {
    aiCnvrsRoomSn: 4,
    aiCnvrsRoomCnvrsTtl: '다음 주 화요일 오후 3시에 메이플 동물병원 예약',
    petSn: 1,
    petNm: '초코',
    crtDt: daysAgo(4, 14),
    messages: [
      {
        aiCnvrsMsgSn: 5,
        aiCnvrsMsgRoleCd: 'USER',
        aiCnvrsMsgCn: '다음 주 화요일 오후 3시에 메이플 동물병원 예약',
        aiCnvrsMsgCmptnYn: 'Y',
      },
    ],
  },
  {
    aiCnvrsRoomSn: 5,
    aiCnvrsRoomCnvrsTtl: '사료 바꿀 때 주의점',
    petSn: 2,
    petNm: '뭉치',
    crtDt: daysAgo(12, 10),
    messages: [
      {
        aiCnvrsMsgSn: 6,
        aiCnvrsMsgRoleCd: 'USER',
        aiCnvrsMsgCn: '사료 바꿀 때 주의점 알려줘',
        aiCnvrsMsgCmptnYn: 'Y',
      },
      {
        aiCnvrsMsgSn: 7,
        aiCnvrsMsgRoleCd: 'AI',
        aiCnvrsMsgCn:
          '7~10일에 걸쳐 새 사료 비율을 조금씩 늘려 가며 섞어 주세요.\n\n※ 참고 정보이며 의료 진단이 아닙니다.',
        aiCnvrsMsgCmptnYn: 'Y',
      },
    ],
  },
];

/** 대화 목록 */
export const getConversations = ({ petSn } = {}) => {
  const rooms = fakeConversations
    .filter((room) => petSn == null || room.petSn === petSn)
    .sort((a, b) => b.crtDt.localeCompare(a.crtDt))
    .map((room) => ({
      aiCnvrsRoomSn: room.aiCnvrsRoomSn,
      aiCnvrsRoomCnvrsTtl: room.aiCnvrsRoomCnvrsTtl,
      petSn: room.petSn,
      petNm: room.petNm,
      crtDt: room.crtDt,
    }));
  return Promise.resolve(rooms);
};

/** 대화 상세 */
export const getConversation = (aiCnvrsRoomSn) => {
  const room = fakeConversations.find(
    (item) => item.aiCnvrsRoomSn === aiCnvrsRoomSn,
  );
  return room ? Promise.resolve(room) : Promise.reject(new Error('not found'));
};

/** 대화 삭제 */
export const deleteConversation = (aiCnvrsRoomSn) => {
  fakeConversations = fakeConversations.filter(
    (room) => room.aiCnvrsRoomSn !== aiCnvrsRoomSn,
  );
  return Promise.resolve();
};

let nextFakeRoomSn = 100;
let nextFakeMsgSn = 100;

/** 메시지 전송 */
export const sendMessage = ({ aiCnvrsRoomSn, petSn, petNm, aiCnvrsMsgCn }) => {
  const message = {
    aiCnvrsMsgSn: nextFakeMsgSn++,
    aiCnvrsMsgRoleCd: 'USER',
    aiCnvrsMsgCn,
    aiCnvrsMsgCmptnYn: 'Y',
  };

  let room = fakeConversations.find(
    (item) => item.aiCnvrsRoomSn === aiCnvrsRoomSn,
  );
  if (!room) {
    room = {
      aiCnvrsRoomSn: nextFakeRoomSn++,
      aiCnvrsRoomCnvrsTtl: aiCnvrsMsgCn.slice(0, 200),
      petSn: petSn ?? null,
      petNm: petNm ?? null,
      crtDt: daysAgo(0, new Date().getHours()),
      messages: [],
    };
    fakeConversations = [room, ...fakeConversations];
  }
  room.messages = [...room.messages, message];

  if (isRegisterRequest(aiCnvrsMsgCn)) {
    return Promise.resolve({
      aiCnvrsRoomSn: room.aiCnvrsRoomSn,
      intent: 'REGISTER',
    });
  }

  const route = matchRoute(aiCnvrsMsgCn);
  if (route) {
    /** 이동 안내 문구의 AI 메시지 저장 */
    const guide = {
      aiCnvrsMsgSn: nextFakeMsgSn++,
      aiCnvrsMsgRoleCd: 'AI',
      aiCnvrsMsgCn: `${route.label} 화면으로 이동할게요.`,
      aiCnvrsMsgCmptnYn: 'Y',
    };
    room.messages = [...room.messages, guide];
    return Promise.resolve({
      aiCnvrsRoomSn: room.aiCnvrsRoomSn,
      intent: 'ROUTE',
      aiCnvrsMsgSn: guide.aiCnvrsMsgSn,
      route: { label: route.label, path: route.path, action: route.action },
    });
  }

  return Promise.resolve({
    aiCnvrsRoomSn: room.aiCnvrsRoomSn,
    intent: 'SEARCH',
  });
};

const HEALTH_PATTERN = /접종|병원|아파|건강|약|사료/;
const HEALTH_NOTE =
  '※ 참고 정보이며 의료 진단이 아닙니다. 이상 징후가 있다면 수의사와 상담하세요.';
const FAKE_ANSWER =
  '생후 6~8주부터 종합백신(DHPPL) 1차를 시작으로 2~4주 간격으로 5차까지 맞히고, 코로나 장염·켄넬코프·인플루엔자·광견병을 순서대로 이어서 접종해요. 기초 접종이 끝나면 1년에 한 번 추가 접종을 권장해요.';
const CHUNK_SIZE = 3;
const CHUNK_DELAY_MS = 40;

/** 개발 환경 전용 실패 상황 쿼리 */
const fakeFlag = (name) =>
  IS_DEV ? new URLSearchParams(window.location.search).get(name) : null;

/** 첫 요청에만 실패 상황 적용: 재시도 성공 확인용 */
const usedFakeFlags = new Set();
const fakeFlagOnce = (name) => {
  if (usedFakeFlags.has(name)) return null;
  const value = fakeFlag(name);
  if (value !== null) usedFakeFlags.add(name);
  return value;
};

const wait = (ms, signal) =>
  new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      resolve();
    });
  });

/** 답변 스트리밍 */
export const streamAnswer = async ({
  aiCnvrsRoomSn,
  question,
  replaceMsgSn,
  onToken,
  signal,
}) => {
  const room = fakeConversations.find(
    (item) => item.aiCnvrsRoomSn === aiCnvrsRoomSn,
  );
  if (!room) throw new Error('not found');

  await wait(
    Number(fakeFlagOnce('fakeAiFirstDelay') ?? 0) * 1000 || 600,
    signal,
  );
  if (signal?.aborted) return { aiCnvrsMsgSn: null };
  if (fakeFlagOnce('fakeAiError')) throw new Error('AI error');

  const isHealth = HEALTH_PATTERN.test(question);
  const answer = isHealth
    ? FAKE_ANSWER
    : '그 내용은 아직 잘 몰라요. 다른 질문을 해 주세요.';
  const limit = fakeFlagOnce('fakeAiCut')
    ? Math.floor(answer.length / 2)
    : answer.length;

  let received = '';
  while (received.length < limit && !signal?.aborted) {
    const chunk = answer.slice(
      received.length,
      Math.min(received.length + CHUNK_SIZE, limit),
    );
    received += chunk;
    onToken(chunk);
    await wait(CHUNK_DELAY_MS, signal);
  }

  const isComplete = received.length === answer.length;
  /** 미완료 저장 제외 대상 */
  if (received === '') return { aiCnvrsMsgSn: null };

  const message = {
    aiCnvrsMsgSn: nextFakeMsgSn++,
    aiCnvrsMsgRoleCd: 'AI',
    aiCnvrsMsgCn:
      isComplete && isHealth
        ? `${answer}

${HEALTH_NOTE}`
        : received,
    aiCnvrsMsgCmptnYn: isComplete ? 'Y' : 'N',
  };
  room.messages = [
    ...room.messages.filter((item) => item.aiCnvrsMsgSn !== replaceMsgSn),
    message,
  ];

  const hasShortcut = isComplete && isHealth && !fakeFlag('fakeAiNoShortcut');
  return {
    aiCnvrsMsgSn: message.aiCnvrsMsgSn,
    aiCnvrsMsgCmptnYn: message.aiCnvrsMsgCmptnYn,
    aiCnvrsMsgCn: message.aiCnvrsMsgCn,
    rltdShrtcts: hasShortcut
      ? [
          {
            label: '케어 캘린더에서 접종 일정 보기',
            path: PATHS.HEALTH_CALENDAR,
          },
        ]
      : [],
  };
};
