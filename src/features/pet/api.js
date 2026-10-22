import { CGVR_ROLE, PET_REL, PET_SE } from '@/utils/petCodes';

/**
 * [반려동물 가짜 API]
 * - 반려동물 API(SJM)·품종 마스터(KSJ) 전까지 쓰는 가짜 응답, 나오면 본문만 api 요청으로 교체
 * - 미정 키: lastBdwgRcd, vrtyNm, rprsYn, petRelCd, chrcFaceUrl
 * - 양육관계 미정 키: rltnSn, mbrNcnm, cgvrRoleCd, authrtNm, lnkDt, myYn
 */
const basePet = {
  vrtySn: null,
  vrtyNm: null,
  vrtyDrctInptNm: null,
  chipNo: null,
  nutrYn: 'N',
  goalBdwg: null,
  colrDrctInptNm: null,
  chrcCn: null,
  algyCn: null,
  dssCn: null,
  lastBdwgRcd: null,
  rprsYn: 'N',
  petRelCd: PET_REL.OWNER,
  chrcFaceUrl: null,
};

let fakePets = [
  {
    ...basePet,
    petSn: 1,
    petNm: '초코',
    petSeCd: PET_SE.DOG,
    vrtySn: 1,
    vrtyNm: '골든리트리버',
    petBrdt: '2021-05-03',
    chipNo: '410123456789012',
    petGndrCd: 'PETC0003',
    nutrYn: 'Y',
    petBdwg: 4.3,
    goalBdwg: 4.0,
    minBdwg: 3.5,
    maxBdwg: 4.5,
    colrCd: 'PETC0007',
    chrcCn: '오른쪽 귀 한쪽만 접힘',
    algyCn: '새우,닭고기',
    lastBdwgRcd: { rcdNvl: 4.3, rcdDt: '2026-09-12T09:00:00' },
    rprsYn: 'Y',
  },
  {
    ...basePet,
    petSn: 2,
    petNm: '나비',
    petSeCd: PET_SE.CAT,
    vrtyDrctInptNm: '코리안 숏헤어 믹스',
    petBrdt: '2023-02-14',
    petGndrCd: 'PETC0004',
    petBdwg: 3.8,
    minBdwg: 3.0,
    maxBdwg: 4.5,
    colrCd: 'PETC0014',
    algyCn: '연어,소고기,밀,옥수수',
    dssCn: '슬개골 탈구,피부염,외이염,결막염',
  },
  {
    ...basePet,
    petSn: 3,
    petNm: '보리',
    petSeCd: PET_SE.DOG,
    vrtySn: 2,
    vrtyNm: '말티즈',
    petBrdt: '2026-02-01',
    petGndrCd: 'PETC0004',
    petBdwg: 1.9,
    minBdwg: 1.5,
    maxBdwg: 2.5,
    colrCd: 'PETC0006',
  },
  {
    ...basePet,
    petSn: 4,
    petNm: '두부',
    petSeCd: PET_SE.DOG,
    vrtySn: 3,
    vrtyNm: '푸들',
    petBrdt: '2019-11-20',
    petGndrCd: 'PETC0003',
    nutrYn: 'Y',
    petBdwg: 5.2,
    minBdwg: 4.5,
    maxBdwg: 6.0,
    colrCd: 'PETC0008',
  },
  {
    ...basePet,
    petSn: 5,
    petNm: '치즈',
    petSeCd: PET_SE.CAT,
    vrtySn: 101,
    vrtyNm: '코리안 숏헤어',
    petBrdt: '2022-07-07',
    petGndrCd: 'PETC0003',
    nutrYn: 'Y',
    petBdwg: 5.5,
    minBdwg: 4.0,
    maxBdwg: 6.0,
    colrCd: 'PETC0015',
  },
  {
    ...basePet,
    petSn: 6,
    petNm: '콩이',
    petSeCd: PET_SE.DOG,
    vrtySn: 4,
    vrtyNm: '포메라니안',
    petBrdt: '2024-04-10',
    petGndrCd: 'PETC0004',
    petBdwg: 2.6,
    minBdwg: 2.0,
    maxBdwg: 3.0,
    colrCd: 'PETC0008',
  },
  {
    ...basePet,
    petSn: 7,
    petNm: '구름',
    petSeCd: PET_SE.CAT,
    vrtySn: 103,
    vrtyNm: '페르시안',
    petBrdt: '2020-01-15',
    petGndrCd: 'PETC0004',
    nutrYn: 'Y',
    petBdwg: 4.1,
    minBdwg: 3.5,
    maxBdwg: 5.0,
    colrCd: 'PETC0006',
  },
  {
    ...basePet,
    petSn: 8,
    petNm: '까미',
    petSeCd: PET_SE.DOG,
    vrtySn: 3,
    vrtyNm: '푸들',
    petBrdt: '2018-09-30',
    petGndrCd: 'PETC0003',
    petBdwg: 6.4,
    minBdwg: 5.5,
    maxBdwg: 7.0,
    colrCd: 'PETC0005',
  },
  {
    ...basePet,
    petSn: 9,
    petNm: '모모',
    petSeCd: PET_SE.CAT,
    vrtySn: 102,
    vrtyNm: '러시안 블루',
    petBrdt: '2025-03-03',
    petGndrCd: 'PETC0004',
    petBdwg: 3.2,
    minBdwg: 2.8,
    maxBdwg: 4.0,
    colrCd: 'PETC0009',
  },
  {
    ...basePet,
    petSn: 10,
    petNm: '해피',
    petSeCd: PET_SE.DOG,
    vrtySn: 1,
    vrtyNm: '골든리트리버',
    petBrdt: '2020-06-18',
    petGndrCd: 'PETC0003',
    nutrYn: 'Y',
    petBdwg: 28.5,
    minBdwg: 26.0,
    maxBdwg: 32.0,
    colrCd: 'PETC0007',
    petRelCd: PET_REL.CO_PARENT,
  },
];

const fakeVarieties = {
  [PET_SE.DOG]: [
    { vrtySn: 1, vrtyNm: '골든리트리버' },
    { vrtySn: 2, vrtyNm: '말티즈' },
    { vrtySn: 3, vrtyNm: '푸들' },
    { vrtySn: 4, vrtyNm: '포메라니안' },
  ],
  [PET_SE.CAT]: [
    { vrtySn: 101, vrtyNm: '코리안 숏헤어' },
    { vrtySn: 102, vrtyNm: '러시안 블루' },
    { vrtySn: 103, vrtyNm: '페르시안' },
  ],
};

const findVrtyNm = (petSeCd, vrtySn) =>
  fakeVarieties[petSeCd]?.find((vrty) => vrty.vrtySn === vrtySn)?.vrtyNm ??
  null;

const fakeDelay = (data) =>
  new Promise((resolve) => setTimeout(() => resolve(data), 200));

/** 목록 조회 GET /pets */
export const getPets = () => fakeDelay(fakePets);

/** 상세 조회 GET /pets/{petSn} */
export const getPet = (petSn) =>
  fakeDelay(fakePets.find((pet) => pet.petSn === petSn));

/** 등록 POST /pets */
export const createPet = (body) => {
  const pet = {
    ...basePet,
    ...body,
    petSn: Math.max(0, ...fakePets.map((p) => p.petSn)) + 1,
    vrtyNm: findVrtyNm(body.petSeCd, body.vrtySn),
  };
  fakePets = [...fakePets, pet];
  return fakeDelay(pet);
};

/** 수정 PUT /pets/{petSn} */
export const updatePet = ({ petSn, ...body }) => {
  const prev = fakePets.find((pet) => pet.petSn === petSn);
  const pet = {
    ...prev,
    ...body,
    petBdwg: prev.lastBdwgRcd ? prev.petBdwg : body.petBdwg,
    vrtyNm: findVrtyNm(body.petSeCd, body.vrtySn),
  };
  fakePets = fakePets.map((p) => (p.petSn === petSn ? pet : p));
  return fakeDelay(pet);
};

/** 삭제 DELETE /pets/{petSn} */
export const deletePet = (petSn) => {
  fakePets = fakePets.filter((pet) => pet.petSn !== petSn);
  return fakeDelay(null);
};

/** 품종 목록 조회 GET /varieties?petSeCd= (KSJ) */
export const getVarieties = (petSeCd) =>
  fakeDelay(fakeVarieties[petSeCd] ?? []);

/**
 * 양육관계 가짜 데이터 (petSn별)
 * - 주양육자 시점: 연동된 공동양육자(CCG) 전원
 * - 공동양육자 시점: 주양육자(PCG) + 본인 연동 1건(myYn 'Y'), 다른 공동양육자는 서버가 내려주지 않음
 */
let fakeCaregivers = {
  1: [
    {
      rltnSn: 101,
      mbrNcnm: '이서연',
      cgvrRoleCd: CGVR_ROLE.CCG,
      authrtNm: '조회+수정',
      lnkDt: '2026-07-02',
      myYn: 'N',
    },
    {
      rltnSn: 102,
      mbrNcnm: '최민지',
      cgvrRoleCd: CGVR_ROLE.CCG,
      authrtNm: '조회+수정',
      lnkDt: '2026-08-01',
      myYn: 'N',
    },
  ],
  3: [
    {
      rltnSn: 301,
      mbrNcnm: '이서연',
      cgvrRoleCd: CGVR_ROLE.CCG,
      authrtNm: '조회+수정',
      lnkDt: '2026-06-11',
      myYn: 'N',
    },
    {
      rltnSn: 302,
      mbrNcnm: '최민지',
      cgvrRoleCd: CGVR_ROLE.CCG,
      authrtNm: '조회',
      lnkDt: '2026-06-20',
      myYn: 'N',
    },
    {
      rltnSn: 303,
      mbrNcnm: '박지호',
      cgvrRoleCd: CGVR_ROLE.CCG,
      authrtNm: '조회+수정',
      lnkDt: '2026-07-05',
      myYn: 'N',
    },
    {
      rltnSn: 304,
      mbrNcnm: '정하늘',
      cgvrRoleCd: CGVR_ROLE.CCG,
      authrtNm: '조회',
      lnkDt: '2026-08-19',
      myYn: 'N',
    },
    {
      rltnSn: 305,
      mbrNcnm: '강도윤',
      cgvrRoleCd: CGVR_ROLE.CCG,
      authrtNm: '조회+수정',
      lnkDt: '2026-09-02',
      myYn: 'N',
    },
  ],
  10: [
    {
      rltnSn: 1001,
      mbrNcnm: '김주인',
      cgvrRoleCd: CGVR_ROLE.PCG,
      authrtNm: '조회+수정',
      lnkDt: '2026-07-02',
      myYn: 'N',
    },
    {
      rltnSn: 1002,
      mbrNcnm: '이서연',
      cgvrRoleCd: CGVR_ROLE.CCG,
      authrtNm: '조회+수정',
      lnkDt: '2026-07-02',
      myYn: 'Y',
    },
  ],
};

/** 양육관계 조회 GET /pets/{petSn}/caregivers (SJM 백엔드, 이메일은 내려주지 않음) */
export const getCaregivers = (petSn) => fakeDelay(fakeCaregivers[petSn] ?? []);

/** 주양육자의 강제 해제 DELETE /pets/{petSn}/caregivers/{rltnSn} (SJM 백엔드) */
export const deleteCaregiver = ({ petSn, rltnSn }) => {
  fakeCaregivers = {
    ...fakeCaregivers,
    [petSn]: (fakeCaregivers[petSn] ?? []).filter(
      (caregiver) => caregiver.rltnSn !== rltnSn,
    ),
  };
  return fakeDelay(null);
};

/** 공동양육자 본인의 자진 해제 DELETE /pets/{petSn}/caregivers/me (SJM 백엔드, 본인 연동만 끊고 반려동물 데이터는 그대로) */
export const leavePet = (petSn) => {
  fakePets = fakePets.filter((pet) => pet.petSn !== petSn);
  fakeCaregivers = {
    ...fakeCaregivers,
    [petSn]: (fakeCaregivers[petSn] ?? []).filter(
      (caregiver) => caregiver.myYn !== 'Y',
    ),
  };
  return fakeDelay(null);
};

/**
 * [공동양육 초대 가짜 데이터]
 * - 초대 API(SJM 백엔드) 전까지 쓰는 가짜 응답
 * - 미정 키: invtSn, invitationToken(수락 URL 경로 변수, 확정 필요), invtEml, invtSttsCd, invtDt, expryDt, mbrYn, invtrNcnm, pets
 */
export const INVT_STTS = {
  WAIT: 'WAIT',
  ACPT: 'ACPT',
  RJCT: 'RJCT',
  EXPR: 'EXPR',
};

/** 초대 유효 기간(일) */
const INVT_VALID_DAYS = 7;

const toYmd = (date) => date.toISOString().slice(0, 10);

const addDays = (ymd, days) => {
  const date = new Date(`${ymd}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return toYmd(date);
};

const todayYmd = () => {
  const now = new Date();
  return toYmd(new Date(now.getTime() - now.getTimezoneOffset() * 60000));
};

/** 기한이 지난 대기 건은 만료로 표시 (실제는 서버 상태) */
const withExpiry = (invitation) =>
  invitation.invtSttsCd === INVT_STTS.WAIT && invitation.expryDt < todayYmd()
    ? { ...invitation, invtSttsCd: INVT_STTS.EXPR }
    : invitation;

/** 내가 보낸 초대 (계정 전체, 최신 발송 순) */
let fakeSentInvitations = [
  {
    invtSn: 4,
    invtEml: 'sooyoung@example.com',
    pets: [{ petSn: 1, petNm: '초코' }],
    invtDt: '2026-10-18',
    expryDt: '2026-10-25',
    mbrYn: 'N',
    invtSttsCd: INVT_STTS.WAIT,
  },
  {
    invtSn: 3,
    invtEml: 'jiho@example.com',
    pets: [
      { petSn: 2, petNm: '나비' },
      { petSn: 4, petNm: '두부' },
    ],
    invtDt: '2026-10-01',
    expryDt: '2026-10-08',
    mbrYn: 'Y',
    invtSttsCd: INVT_STTS.WAIT,
  },
  {
    invtSn: 2,
    invtEml: 'minji@example.com',
    pets: [{ petSn: 1, petNm: '초코' }],
    invtDt: '2026-07-28',
    expryDt: '2026-08-04',
    mbrYn: 'Y',
    invtSttsCd: INVT_STTS.ACPT,
  },
  {
    invtSn: 1,
    invtEml: 'haneul@example.com',
    pets: [{ petSn: 3, petNm: '보리' }],
    invtDt: '2026-06-15',
    expryDt: '2026-06-22',
    mbrYn: 'N',
    invtSttsCd: INVT_STTS.RJCT,
  },
];

/** 내가 받은 초대 (invitationToken별) */
let fakeReceivedInvitations = {
  'demo-wait': {
    invtSn: 901,
    invtrNcnm: '김주인',
    invtDt: '2026-10-20',
    expryDt: '2026-10-27',
    invtSttsCd: INVT_STTS.WAIT,
    pets: [
      {
        ...basePet,
        petSn: 901,
        petNm: '뭉치',
        petSeCd: PET_SE.DOG,
        vrtySn: 1,
        vrtyNm: '골든리트리버',
        petBrdt: '2023-05-02',
        petGndrCd: 'PETC0003',
        petBdwg: 30.2,
        minBdwg: 27.0,
        maxBdwg: 33.0,
        colrCd: 'PETC0007',
        petRelCd: PET_REL.CO_PARENT,
      },
      {
        ...basePet,
        petSn: 902,
        petNm: '마루',
        petSeCd: PET_SE.CAT,
        vrtyNm: '코리안 숏헤어',
        petBrdt: '2024-03-11',
        petGndrCd: 'PETC0004',
        petBdwg: 4.1,
        minBdwg: 3.5,
        maxBdwg: 4.8,
        colrCd: 'PETC0014',
        petRelCd: PET_REL.CO_PARENT,
      },
    ],
  },
  'demo-expired': {
    invtSn: 902,
    invtrNcnm: '박보호',
    invtDt: '2026-10-01',
    expryDt: '2026-10-08',
    invtSttsCd: INVT_STTS.WAIT,
    pets: [
      {
        ...basePet,
        petSn: 903,
        petNm: '별이',
        petSeCd: PET_SE.DOG,
        vrtyNm: '시바견',
        petBrdt: '2022-08-08',
        petRelCd: PET_REL.CO_PARENT,
      },
    ],
  },
};

/** 보낸 초대 조회 GET /invitations/sent (SJM 백엔드) */
export const getSentInvitations = () =>
  fakeDelay(fakeSentInvitations.map(withExpiry));

/** 초대 발송 POST /invitations (SJM 백엔드, 가입 회원은 인앱 알림·미가입은 메일) */
export const createInvitation = ({ invtEml, petSns }) => {
  const invtDt = todayYmd();
  const invitation = {
    invtSn: Math.max(0, ...fakeSentInvitations.map((i) => i.invtSn)) + 1,
    invtEml,
    pets: fakePets
      .filter((pet) => petSns.includes(pet.petSn))
      .map(({ petSn, petNm }) => ({ petSn, petNm })),
    invtDt,
    expryDt: addDays(invtDt, INVT_VALID_DAYS),
    mbrYn: 'N',
    invtSttsCd: INVT_STTS.WAIT,
  };
  fakeSentInvitations = [invitation, ...fakeSentInvitations];
  return fakeDelay(invitation);
};

/** 받은 초대 조회 GET /invitations/{invitationToken} (SJM 백엔드) */
export const getInvitation = (invitationToken) => {
  const invitation = fakeReceivedInvitations[invitationToken];
  if (!invitation) {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error('NOT_FOUND')), 200),
    );
  }
  return fakeDelay(withExpiry({ ...invitation, invitationToken }));
};

/** 받은 쪽 처리 결과를 보낸 쪽 목록에도 반영 (같은 invtSn) */
const setReceivedStatus = (invitationToken, invtSttsCd) => {
  const { invtSn } = fakeReceivedInvitations[invitationToken];
  fakeSentInvitations = fakeSentInvitations.map((invitation) =>
    invitation.invtSn === invtSn ? { ...invitation, invtSttsCd } : invitation,
  );
  fakeReceivedInvitations = {
    ...fakeReceivedInvitations,
    [invitationToken]: {
      ...fakeReceivedInvitations[invitationToken],
      invtSttsCd,
    },
  };
};

/** 초대 수락 POST /invitations/{invitationToken}/accept (SJM 백엔드, 초대에 담긴 동물 일괄 연동) */
export const acceptInvitation = (invitationToken) => {
  const invitation = fakeReceivedInvitations[invitationToken];
  setReceivedStatus(invitationToken, INVT_STTS.ACPT);
  fakePets = [...fakePets, ...invitation.pets];
  invitation.pets.forEach((pet) => {
    fakeCaregivers = {
      ...fakeCaregivers,
      [pet.petSn]: [
        {
          rltnSn: pet.petSn * 100 + 1,
          mbrNcnm: invitation.invtrNcnm,
          cgvrRoleCd: CGVR_ROLE.PCG,
          authrtNm: '조회+수정',
          lnkDt: invitation.invtDt,
          myYn: 'N',
        },
        {
          rltnSn: pet.petSn * 100 + 2,
          mbrNcnm: '이서연',
          cgvrRoleCd: CGVR_ROLE.CCG,
          authrtNm: '조회+수정',
          lnkDt: todayYmd(),
          myYn: 'Y',
        },
      ],
    };
  });
  return fakeDelay(null);
};

/** 초대 거절 POST /invitations/{invitationToken}/reject (SJM 백엔드) */
export const rejectInvitation = (invitationToken) => {
  setReceivedStatus(invitationToken, INVT_STTS.RJCT);
  return fakeDelay(null);
};
