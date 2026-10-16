import { PET_SE } from './petCodes';

// 가짜 응답: 반려동물 API(SJM 백엔드)와 품종 마스터(KSJ)가 나오기 전까지 쓴다.
// 함수 이름과 경로 주석은 실제 API와 같게 두고, API가 나오면 본문만 api 요청으로 바꾼다.
// lastBdwgRcd(가장 최근 체중 기록)는 키 이름이 아직 정해지지 않았다. 백엔드를 만들 때 맞춘다
let fakePets = [
  {
    petSn: 1,
    petNm: '초코',
    petSeCd: PET_SE.DOG,
    vrtySn: 1,
    vrtyDrctInptNm: null,
    petBrdt: '2021-05-03',
    chipNo: '410123456789012',
    petGndrCd: 'PETC0003',
    nutrYn: 'Y',
    petBdwg: 4.3,
    goalBdwg: 4.0,
    minBdwg: 3.5,
    maxBdwg: 4.5,
    colrCd: 'PETC0007',
    colrDrctInptNm: null,
    chrcCn: '오른쪽 귀 한쪽만 접힘',
    algyCn: '새우,닭고기',
    dssCn: null,
    lastBdwgRcd: { rcdNvl: 4.3, rcdDt: '2026-09-12T09:00:00' },
  },
  {
    petSn: 2,
    petNm: '나비',
    petSeCd: PET_SE.CAT,
    vrtySn: null,
    vrtyDrctInptNm: '코리안 숏헤어 믹스',
    petBrdt: '2023-02-14',
    chipNo: null,
    petGndrCd: 'PETC0004',
    nutrYn: 'N',
    petBdwg: 3.8,
    goalBdwg: null,
    minBdwg: 3.0,
    maxBdwg: 4.5,
    colrCd: 'PETC0014',
    colrDrctInptNm: null,
    chrcCn: null,
    algyCn: null,
    dssCn: '슬개골 탈구',
    lastBdwgRcd: null,
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

const fakeDelay = (data) =>
  new Promise((resolve) => setTimeout(() => resolve(data), 200));

// GET /pets
export const getPets = () => fakeDelay(fakePets);

// GET /pets/{petSn}
export const getPet = (petSn) =>
  fakeDelay(fakePets.find((pet) => pet.petSn === petSn));

// POST /pets
export const createPet = (body) => {
  const pet = {
    ...body,
    petSn: Math.max(0, ...fakePets.map((p) => p.petSn)) + 1,
    lastBdwgRcd: null,
  };
  fakePets = [...fakePets, pet];
  return fakeDelay(pet);
};

// PUT /pets/{petSn}. 체중 기록이 있으면 서버가 petBdwg를 바꾸지 않는다
export const updatePet = ({ petSn, ...body }) => {
  const prev = fakePets.find((pet) => pet.petSn === petSn);
  const pet = {
    ...prev,
    ...body,
    petBdwg: prev.lastBdwgRcd ? prev.petBdwg : body.petBdwg,
  };
  fakePets = fakePets.map((p) => (p.petSn === petSn ? pet : p));
  return fakeDelay(pet);
};

// GET /varieties?petSeCd= (KSJ 품종 마스터)
export const getVarieties = (petSeCd) =>
  fakeDelay(fakeVarieties[petSeCd] ?? []);
