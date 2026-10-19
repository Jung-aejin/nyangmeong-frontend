// 알림 유형 코드(AIMG02)가 정해지기 전의 가짜 값이다. 실제 코드값으로 바꿀 때 이 파일만 고친다
export const NOTI_TYPE = {
  CARE_SCHDL: 'CARE_SCHDL',
  EXPND_LIM: 'EXPND_LIM',
  CMNT: 'CMNT',
  LOST_EXPRY: 'LOST_EXPRY',
  MTCH_DLNG: 'MTCH_DLNG',
  JNT_BRUP: 'JNT_BRUP',
  CHRCTR: 'CHRCTR',
  INQRY_ANSWR: 'INQRY_ANSWR',
  NTC: 'NTC',
};

// 탭은 알림 유형을 묶어서 보여 줄 뿐이다. types가 null이면 전체다
export const NOTI_TABS = [
  { key: 'all', label: '전체', types: null },
  {
    key: 'care',
    label: '케어',
    types: [NOTI_TYPE.CARE_SCHDL, NOTI_TYPE.EXPND_LIM],
  },
  {
    key: 'community',
    label: '커뮤니티',
    types: [NOTI_TYPE.CMNT, NOTI_TYPE.LOST_EXPRY, NOTI_TYPE.MTCH_DLNG],
  },
  {
    key: 'guide',
    label: '안내',
    types: [
      NOTI_TYPE.JNT_BRUP,
      NOTI_TYPE.CHRCTR,
      NOTI_TYPE.INQRY_ANSWR,
      NOTI_TYPE.NTC,
    ],
  },
];
