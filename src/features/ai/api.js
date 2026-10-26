import { IS_DEV } from '@/api/env';
import { PATHS } from '@/routes/paths';
import { FALLBACK_MESSAGE } from './shared/fallbackCount';
import { fakePets } from './chat/fakePets';
import {
  describeCard,
  findMissingCardFields,
  getCardTitle,
  interpretRegister,
  REVISE_PATTERN,
} from './shared/fakeRegisterParser';
import { isRegisterRequest, matchRoute } from './shared/fakeRoutingMap';

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
export const getConversations = async ({ petSn } = {}) => {
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
  return rooms;
};

/** 대화 상세 */
export const getConversation = async (aiCnvrsRoomSn) => {
  const room = fakeConversations.find(
    (item) => item.aiCnvrsRoomSn === aiCnvrsRoomSn,
  );
  if (!room) throw new Error('not found');
  return room;
};

/** 대화 삭제 */
export const deleteConversation = async (aiCnvrsRoomSn) => {
  fakeConversations = fakeConversations.filter(
    (room) => room.aiCnvrsRoomSn !== aiCnvrsRoomSn,
  );
};

/** 새로고침 뒤에도 sessionStorage 키와 겹치지 않는 가짜 대화 번호 */
let nextFakeRoomSn = Date.now();
let nextFakeMsgSn = 100;

/** 대화별 되묻는 중인 등록 초안 */
const fakeDrafts = new Map();
/** 대화별 확정·취소 전인 가장 최근 미리보기 카드 */
const fakePendingCards = new Map();
/** 같은 이름 케어 항목 안내 확인용 기존 항목 */
const fakeCareItems = [{ petSn: 1, careArtclNm: '산책' }];

/** AI 메시지 저장 */
const saveAiMessage = (room, aiCnvrsMsgCn) => {
  const message = {
    aiCnvrsMsgSn: nextFakeMsgSn++,
    aiCnvrsMsgRoleCd: 'AI',
    aiCnvrsMsgCn,
    aiCnvrsMsgCmptnYn: 'Y',
  };
  room.messages = [...room.messages, message];
  return message;
};

/** 메시지 전송 */
export const sendMessage = async ({
  aiCnvrsRoomSn,
  petSn,
  petNm,
  aiCnvrsMsgCn,
}) => {
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

  const roomSn = room.aiCnvrsRoomSn;
  const answeringDraft = fakeDrafts.get(roomSn);
  const pendingCard = fakePendingCards.get(roomSn);
  const isRevision =
    !answeringDraft &&
    Boolean(pendingCard) &&
    REVISE_PATTERN.test(aiCnvrsMsgCn);
  if (answeringDraft || isRevision || isRegisterRequest(aiCnvrsMsgCn)) {
    const result = interpretRegister({
      text: aiCnvrsMsgCn,
      draft: answeringDraft ?? (isRevision ? pendingCard.draft : undefined),
      isRevision,
      pets: fakePets,
      petSn: petSn ?? room.petSn,
      careItems: fakeCareItems,
    });

    if (result.type === 'ASK') {
      fakeDrafts.set(roomSn, result.draft);
      const ask = saveAiMessage(room, result.message);
      return {
        aiCnvrsRoomSn: roomSn,
        intent: 'REGISTER',
        aiCnvrsMsgSn: ask.aiCnvrsMsgSn,
        petChoices: result.petChoices,
      };
    }

    /** 카드 메시지는 요약 텍스트로 저장, 결과는 확정·취소 때 교체 */
    fakeDrafts.delete(roomSn);
    const preview = saveAiMessage(
      room,
      `${getCardTitle(result.card)} ${describeCard(result.card)}`,
    );
    fakePendingCards.set(roomSn, {
      aiCnvrsMsgSn: preview.aiCnvrsMsgSn,
      draft: result.draft,
      card: result.card,
    });
    return {
      aiCnvrsRoomSn: roomSn,
      intent: 'REGISTER',
      aiCnvrsMsgSn: preview.aiCnvrsMsgSn,
      card: result.card,
    };
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
    return {
      aiCnvrsRoomSn: room.aiCnvrsRoomSn,
      intent: 'ROUTE',
      aiCnvrsMsgSn: guide.aiCnvrsMsgSn,
      route: { label: route.label, path: route.path, action: route.action },
    };
  }

  if (isUnmatchable(aiCnvrsMsgCn)) {
    /** 실패 안내 문구의 AI 메시지 저장 */
    const notice = {
      aiCnvrsMsgSn: nextFakeMsgSn++,
      aiCnvrsMsgRoleCd: 'AI',
      aiCnvrsMsgCn: FALLBACK_MESSAGE,
      aiCnvrsMsgCmptnYn: 'Y',
    };
    room.messages = [...room.messages, notice];
    return {
      aiCnvrsRoomSn: room.aiCnvrsRoomSn,
      intent: 'FALLBACK',
      aiCnvrsMsgSn: notice.aiCnvrsMsgSn,
    };
  }

  return {
    aiCnvrsRoomSn: room.aiCnvrsRoomSn,
    intent: 'SEARCH',
  };
};

/** 가장 최근 카드만 확정·취소 가능 */
const getPendingCard = (aiCnvrsRoomSn, aiCnvrsMsgSn) => {
  const pending = fakePendingCards.get(aiCnvrsRoomSn);
  if (!pending || pending.aiCnvrsMsgSn !== aiCnvrsMsgSn) {
    throw new Error('not latest card');
  }
  return pending;
};

/** 카드 메시지를 결과 문구로 교체 */
const settleCard = (aiCnvrsRoomSn, pending, aiCnvrsMsgCn) => {
  const room = fakeConversations.find(
    (item) => item.aiCnvrsRoomSn === aiCnvrsRoomSn,
  );
  room.messages = room.messages.map((message) =>
    message.aiCnvrsMsgSn === pending.aiCnvrsMsgSn
      ? { ...message, aiCnvrsMsgCn }
      : message,
  );
  fakePendingCards.delete(aiCnvrsRoomSn);
  return { aiCnvrsMsgSn: pending.aiCnvrsMsgSn, aiCnvrsMsgCn };
};

/** 등록 확정 */
export const confirmRegister = async ({ aiCnvrsRoomSn, aiCnvrsMsgSn }) => {
  await wait(300);
  if (fakeFlagOnce('fakeRegisterError')) throw new Error('register error');
  const pending = getPendingCard(aiCnvrsRoomSn, aiCnvrsMsgSn);
  /** 저장 직전 필수 칸 재검증 */
  if (findMissingCardFields(pending.card).length > 0) {
    throw new Error('invalid card');
  }
  if (pending.card.cardTypeCd === 'CARE') {
    fakeCareItems.push({
      petSn: pending.card.petSn,
      careArtclNm: pending.card.careArtclNm,
    });
  }
  return settleCard(
    aiCnvrsRoomSn,
    pending,
    `✔ 등록됨 — ${describeCard(pending.card)}`,
  );
};

/** 등록 취소 */
export const cancelRegister = async ({ aiCnvrsRoomSn, aiCnvrsMsgSn }) => {
  await wait(150);
  const pending = getPendingCard(aiCnvrsRoomSn, aiCnvrsMsgSn);
  return settleCard(aiCnvrsRoomSn, pending, '취소됨 — 등록하지 않았어요.');
};

/** 한글·영문 단어가 없는 입력은 매칭 실패, 개발 환경은 쿼리로 강제 */
const isUnmatchable = (text) =>
  Boolean(fakeFlag('fakeAiFallback')) || !/[가-힣A-Za-z]/.test(text);

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

/** 가짜 응답 대기: signal이 중단되면 AbortError */
const waitAbortable = (ms, signal) =>
  new Promise((resolve, reject) => {
    const abort = () => reject(new DOMException('중단', 'AbortError'));
    if (signal.aborted) return abort();
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      abort();
    };
    signal.addEventListener('abort', onAbort, { once: true });
  });

/**
 * 검진 영수증 인식 (POST /receipts/recognize/checkup 추정)
 * 가짜 응답: 파일 이름의 slow(20초)·error(오류)·fail(추출 0건)에 따른 상황
 * 연결 때 Swagger로 경로·필드 확인
 */
export const recognizeCheckupReceipt = async ({ file, petSn, signal }) => {
  await waitAbortable(file.name.includes('slow') ? 20000 : 2000, signal);
  if (file.name.includes('error')) throw new Error('일시 오류');
  const rcptSn = Date.now();
  if (file.name.includes('fail')) return { rcptSn, petSn, items: [] };
  if (file.name.includes('partial')) {
    return {
      rcptSn,
      petSn,
      items: [{ ckupNm: '종합검진', ckupYmd: null, ckupAmt: null }],
    };
  }
  return {
    rcptSn,
    petSn,
    items: [{ ckupNm: '종합검진', ckupYmd: '2026-09-26', ckupAmt: 85000 }],
  };
};

/** 본창이 읽을 가짜 분석 결과: 창마다 메모리가 달라 localStorage 사용 */
const fakeChatReceiptKey = (rcptSn) => `fakeChatReceipt:${rcptSn}`;

const saveFakeChatReceipt = (result) => {
  try {
    localStorage.setItem(
      fakeChatReceiptKey(result.rcptSn),
      JSON.stringify(result),
    );
  } catch {
    /** 저장소를 못 쓰면 본창 조회 실패로 처리 */
  }
};

/**
 * 대화창 영수증 인식 결과 조회 (Spring 영수증 결과 조회 예정, 경로 미정)
 * 건강 일지 결과 확인 모달(SCR-HLT-002)이 받는 { rcptSn, petSn, items } 모양
 */
export const getChatReceiptResult = async (rcptSn) => {
  await wait(200);
  let saved = null;
  try {
    saved = localStorage.getItem(fakeChatReceiptKey(rcptSn));
  } catch {
    saved = null;
  }
  if (!saved) throw new Error('not found');
  return JSON.parse(saved);
};

/** 대화 이력용 영수증 분석 요약 한 줄(FN-AIM-013-09) */
const summarizeReceipt = ({ hsptlNm, ckupYmd, recptAmt }) => {
  const [, month, day] = ckupYmd ? ckupYmd.split('-').map(Number) : [];
  const parts = [
    hsptlNm,
    ckupYmd && `${month}월 ${day}일`,
    recptAmt != null && `${recptAmt.toLocaleString()}원`,
  ].filter(Boolean);
  return `영수증 분석 — ${parts.join(', ')}`;
};

/**
 * 대화창 영수증 분석 (경로 미정, Python AI 서버 `/ai/` 아래)
 * 가짜 응답: 파일 이름의 slow(20초)·error(오류)·fail(추출 0건)·partial(일부 인식)에 따른 상황
 * 인식되면 요약 한 줄을 AI 메시지로 저장, 필드 이름은 연결 때 Swagger로 확인
 */
export const analyzeChatReceipt = async ({
  aiCnvrsRoomSn,
  petSn,
  file,
  signal,
}) => {
  await waitAbortable(file.name.includes('slow') ? 20000 : 2000, signal);
  if (file.name.includes('error')) throw new Error('일시 오류');
  const recptSn = Date.now();
  if (file.name.includes('fail')) {
    return {
      aiCnvrsRoomSn,
      recptSn,
      hsptlNm: null,
      ckupYmd: null,
      recptAmt: null,
      petAmts: [],
      prscrptnCnt: null,
    };
  }

  const pet = fakePets.find((item) => item.petSn === petSn);
  const otherPet = fakePets.find((item) => item.petSn !== petSn);
  const result = file.name.includes('partial')
    ? {
        hsptlNm: '메이 동물병원',
        ckupYmd: null,
        recptAmt: 145000,
        petAmts: [{ petSn, petNm: pet.petNm, amt: null }],
        prscrptnCnt: null,
      }
    : {
        hsptlNm: '메이 동물병원',
        ckupYmd: '2026-10-20',
        recptAmt: 145000,
        petAmts: [
          { petSn, petNm: pet.petNm, amt: 85000 },
          { petSn: otherPet.petSn, petNm: otherPet.petNm, amt: 60000 },
        ],
        prscrptnCnt: 2,
      };

  let room = fakeConversations.find(
    (item) => item.aiCnvrsRoomSn === aiCnvrsRoomSn,
  );
  if (!room) {
    room = {
      aiCnvrsRoomSn: nextFakeRoomSn++,
      aiCnvrsRoomCnvrsTtl: '영수증 분석',
      petSn,
      petNm: pet.petNm,
      crtDt: daysAgo(0, new Date().getHours()),
      messages: [],
    };
    fakeConversations = [room, ...fakeConversations];
  }
  /** 이미지는 이력에 남기지 않고 요약만 저장(FN-AIM-013-08·09) */
  const summary = saveAiMessage(room, summarizeReceipt(result));
  saveFakeChatReceipt({
    rcptSn: recptSn,
    petSn,
    items: [
      { ckupNm: '종합검진', ckupYmd: result.ckupYmd, ckupAmt: result.recptAmt },
    ],
  });
  return {
    aiCnvrsRoomSn: room.aiCnvrsRoomSn,
    aiCnvrsMsgSn: summary.aiCnvrsMsgSn,
    recptSn,
    ...result,
  };
};

/**
 * 대화창 영수증 분석 취소 (영수증 상태 '취소', FN-AIM-013-04)
 * 가짜 응답: 저장 없음, 연결 때 recptSn 기준 취소 요청으로 교체
 */
export const cancelChatReceipt = async () => {
  await wait(150);
};
