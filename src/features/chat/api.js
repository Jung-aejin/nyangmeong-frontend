/**
 * [채팅 가짜 API]
 * - 채팅 API(KSJ, 백엔드 docs/api/community.md) 전까지 사용, api.get()·api.post()로 교체
 * - 읽음 위치는 localStorage 공유: 채팅 창에서 읽으면 본창 배지에도 반영
 * - ?fakeChatRooms=0·?fakeChatForbidden=1은 개발 환경 전용
 */
import { toYmd } from '@/utils/formatDate';

/** CHTG03 확정 전 가짜 값 */
export const MSG_TYPE = { TEXT: 'TEXT' };

/** 참여자 아님 오류 모양(인터셉터가 만드는 { code, message, fields }) */
const FORBIDDEN_ERROR = {
  code: 'CHAT_ROOM_ACCESS_DENIED',
  message: '참여한 채팅방만 볼 수 있어요',
  fields: null,
};

const READ_SEQ_STORAGE_KEY = 'fake-chat-read-seq';

const fakeRooms = [
  {
    otoChatRoomSn: 1,
    chatRoomSttsCd: 'OPEN',
    pstSn: 101,
    pstTtl: '보리(몰티즈) 저녁 산책 도와주실 분 구해요',
    ctptMbrSn: 21,
    ctptMbrNcnm: '산책왕',
    ctptProfileAtchFileSn: null,
    lastMsgDt: '2026-10-21T14:20:00',
  },
  {
    otoChatRoomSn: 2,
    chatRoomSttsCd: 'OPEN',
    pstSn: 101,
    pstTtl: '보리(몰티즈) 저녁 산책 도와주실 분 구해요',
    ctptMbrSn: 22,
    ctptMbrNcnm: '냥집사',
    ctptProfileAtchFileSn: null,
    lastMsgDt: '2026-10-21T13:05:00',
  },
  {
    otoChatRoomSn: 3,
    chatRoomSttsCd: 'OPEN',
    pstSn: 102,
    pstTtl: '주말 펫시터 구해요 (코리안숏헤어 2마리)',
    ctptMbrSn: 23,
    ctptMbrNcnm: '김하늘',
    ctptProfileAtchFileSn: null,
    lastMsgDt: '2026-10-04T18:30:00',
  },
  {
    otoChatRoomSn: 4,
    chatRoomSttsCd: 'OPEN',
    pstSn: 103,
    pstTtl: '두부 목욕 · 미용 맡기실 분',
    ctptMbrSn: 24,
    ctptMbrNcnm: '두부아빠',
    ctptProfileAtchFileSn: null,
    lastMsgDt: '2026-10-20T21:10:00',
  },
];

const text = (chatMsgSn, msgSeq, mine, msgCn) => ({
  chatMsgSn,
  msgSeq,
  mbrSn: mine ? 1 : 0,
  mine,
  msgTypeCd: MSG_TYPE.TEXT,
  msgCn,
  shrnAddr: null,
  photos: [],
});

const fakeMessages = {
  1: [
    text(
      11,
      1,
      false,
      '안녕하세요! 보리 저녁 산책 글 보고 연락드려요. 서곡동 근처에 살고, 소형견 산책 경험이 많아요.',
    ),
    text(12, 2, true, '안녕하세요 :) 화·목 저녁 7시에 30분 정도 가능하실까요?'),
    text(13, 3, false, '네, 둘 다 가능해요. 동네 한 바퀴 천천히 돌면 될까요?'),
    text(14, 4, false, '네, 화요일 7시 전에 도착할게요'),
  ],
  2: [
    text(21, 1, false, '안녕하세요, 산책 글 보고 연락드려요'),
    text(22, 2, false, '혹시 하네스는 따로 챙겨 가야 할까요?'),
  ],
  3: [
    text(31, 1, true, '주말 이틀 부탁드려도 될까요?'),
    text(32, 2, false, '덕분에 잘 다녀왔어요. 감사합니다!'),
  ],
  4: [
    text(41, 1, false, '오늘 목욕 끝났어요'),
    text(42, 2, false, '완료 확인 부탁드려요!'),
  ],
};

/** 처음 읽음 위치: 1·2번 방에 안 읽은 메시지 */
const INITIAL_READ_SEQ = { 1: 3, 2: 0, 3: 2, 4: 2 };

const getQueryParam = (name) =>
  import.meta.env.DEV
    ? new URLSearchParams(window.location.search).get(name)
    : null;

const loadReadSeq = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(READ_SEQ_STORAGE_KEY));
    return { ...INITIAL_READ_SEQ, ...saved };
  } catch {
    return { ...INITIAL_READ_SEQ };
  }
};

const saveReadSeq = (readSeq) => {
  try {
    localStorage.setItem(READ_SEQ_STORAGE_KEY, JSON.stringify(readSeq));
  } catch {
    /** 저장 불가 환경: 이 창 안에서만 반영 */
  }
};

const countUnread = (otoChatRoomSn, readSeq) =>
  (fakeMessages[otoChatRoomSn] ?? []).filter(
    (message) =>
      !message.mine && message.msgSeq > (readSeq[otoChatRoomSn] ?? 0),
  ).length;

const getFakeRooms = () =>
  getQueryParam('fakeChatRooms') === '0' ? [] : fakeRooms;

const toSummary = (room, readSeq) => ({
  ...room,
  lastMsgCn: fakeMessages[room.otoChatRoomSn]?.at(-1)?.msgCn ?? null,
  unreadCnt: countUnread(room.otoChatRoomSn, readSeq),
});

const pad = (value) => String(value).padStart(2, '0');

/** 현재 시각 → 서버 일시 형식 */
const nowDateTime = () => {
  const now = new Date();
  return `${toYmd(now)}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
};

const findRoom = (otoChatRoomSn) =>
  getQueryParam('fakeChatForbidden') === '1'
    ? undefined
    : getFakeRooms().find((room) => room.otoChatRoomSn === otoChatRoomSn);

export const getChatRooms = async ({ unreadOnly }) => {
  const readSeq = loadReadSeq();
  const summaries = getFakeRooms().map((room) => toSummary(room, readSeq));
  return unreadOnly
    ? summaries.filter((room) => room.unreadCnt > 0)
    : summaries;
};

export const getChatUnreadCount = async () => {
  const readSeq = loadReadSeq();
  return {
    unreadCnt: getFakeRooms().reduce(
      (sum, room) => sum + countUnread(room.otoChatRoomSn, readSeq),
      0,
    ),
  };
};

export const getChatMessages = async (otoChatRoomSn) => {
  if (!findRoom(otoChatRoomSn)) throw FORBIDDEN_ERROR;
  return (fakeMessages[otoChatRoomSn] ?? []).map((message) => ({
    ...message,
  }));
};

/** 게시글·보호자·지원자 조합의 방 생성 또는 기존 방 */
export const createChatRoom = async ({ pstSn }) => {
  const existing = fakeRooms.find((room) => room.pstSn === pstSn);
  if (existing) return { otoChatRoomSn: existing.otoChatRoomSn };

  const otoChatRoomSn =
    Math.max(...fakeRooms.map((room) => room.otoChatRoomSn)) + 1;
  fakeRooms.push({
    otoChatRoomSn,
    chatRoomSttsCd: 'OPEN',
    pstSn,
    pstTtl: `게시글 ${pstSn}`,
    ctptMbrSn: 0,
    ctptMbrNcnm: '작성자',
    ctptProfileAtchFileSn: null,
    lastMsgDt: null,
  });
  fakeMessages[otoChatRoomSn] = [];
  return { otoChatRoomSn };
};

export const readChatRoom = async ({ otoChatRoomSn, lastPrslMsgSeq }) => {
  const readSeq = loadReadSeq();
  if (lastPrslMsgSeq <= (readSeq[otoChatRoomSn] ?? 0)) return;
  saveReadSeq({ ...readSeq, [otoChatRoomSn]: lastPrslMsgSeq });
};

export const createChatMessage = async ({ otoChatRoomSn, ...body }) => {
  const room = findRoom(otoChatRoomSn);
  if (!room) throw FORBIDDEN_ERROR;

  const messages = fakeMessages[otoChatRoomSn];
  const duplicate = messages.find(
    (message) => message.idmptDmndId === body.idmptDmndId,
  );
  if (duplicate) return { ...duplicate };

  const message = {
    ...text(Date.now(), (messages.at(-1)?.msgSeq ?? 0) + 1, true, body.msgCn),
    msgTypeCd: body.msgTypeCd,
    idmptDmndId: body.idmptDmndId,
  };
  messages.push(message);
  room.lastMsgDt = nowDateTime();
  return { ...message };
};
