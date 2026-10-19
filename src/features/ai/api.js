// 대화 API(Python AI 서버)가 생기기 전까지 쓰는 가짜 응답이다. api.get() / api.delete()로 바꾼다
// 필드 이름은 ERD 컬럼명(AI_CNVRS_ROOM_*, AI_CNVRS_MSG_*)에서 따온 추정이다. 연결 때 Swagger로 확인한다
// petSn이 null인 대화는 펫 태그가 [전체]다. aiCnvrsMsgRoleCd는 'USER' 또는 'AI'다

// 오늘 기준 n일 전 날짜를 서버가 주는 형태(타임존 없는 일시)로 만든다. 날짜 묶음이 날마다 맞게 상대 날짜로 둔다
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

// 최근 대화가 위로 온다. 목록에는 메시지를 싣지 않는다
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

// 대화 하나와 그 메시지를 함께 돌려준다
export const getConversation = (aiCnvrsRoomSn) => {
  const room = fakeConversations.find(
    (item) => item.aiCnvrsRoomSn === aiCnvrsRoomSn,
  );
  return room ? Promise.resolve(room) : Promise.reject(new Error('not found'));
};

// 대화와 메시지를 복구할 수 없게 지운다
export const deleteConversation = (aiCnvrsRoomSn) => {
  fakeConversations = fakeConversations.filter(
    (room) => room.aiCnvrsRoomSn !== aiCnvrsRoomSn,
  );
  return Promise.resolve();
};

let nextFakeRoomSn = 100;
let nextFakeMsgSn = 100;

// 메시지를 보낸다. aiCnvrsRoomSn이 null이면 대화를 이 메시지로 새로 만든다(제목은 첫 메시지, 200자까지)
// intent는 AI 서버가 판정한 분기 결과다(추정: REGISTER·ROUTE·SEARCH·FALLBACK). 화면 처리는 002·004·005·012에서 한다
export const sendMessage = ({
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

  return Promise.resolve({ aiCnvrsRoomSn: room.aiCnvrsRoomSn, intent: 'SEARCH' });
};
