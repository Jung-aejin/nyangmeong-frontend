/** 알림 유형 코드 (AIMG02 확정 전 가짜 값, 확정 시 이 파일만 수정) */
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

/** 유형 묶음 탭 (types null은 전체) */
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
