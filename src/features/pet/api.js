import { PET_REL, PET_SE } from './shared/petCodes';

/**
 * [반려동물 가짜 API]
 * - 반려동물 API(SJM)·품종 마스터(KSJ) 전까지 쓰는 가짜 응답, 나오면 본문만 api 요청으로 교체
 * - 미정 키: lastBdwgRcd, vrtyNm, rprsYn, petRelCd, chrcFaceUrl
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
