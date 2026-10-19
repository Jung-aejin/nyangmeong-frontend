import { IS_DEV } from '@/api/env';
import { addDays, getTodayYmd } from '@/utils/formatDate';
import { MAX_MAIN_CARE, getNextDueYmd } from './careDue';

// 케어 캘린더 API(JAJ 백엔드)와 반려동물 목록(SJM)이 생기기 전까지 쓰는 가짜 응답이다. api.get() 등으로 바꾸고 실제 필드 이름에 맞춘다
// 필드 이름은 ERD 약어 기준 가안이다. 메모리 배열이라 새로고침하면 처음 상태로 돌아간다
// 개발 환경에서만 ?fakePets=1로 반려동물 1마리를, ?fakeSchedules=0으로 일정 0건을, ?fakeRecords=0으로 완료 기록 0건을 확인할 수 있다

const getQueryParam = (name) =>
  IS_DEV ? new URLSearchParams(window.location.search).get(name) : null;

const today = getTodayYmd();

const fakePets = [
  { petSn: 1, petNm: '나비', petSpcsCdNm: '고양이', chrctrImgPath: null },
  { petSn: 2, petNm: '초코', petSpcsCdNm: '고양이', chrctrImgPath: null },
  { petSn: 3, petNm: '두리', petSpcsCdNm: '강아지', chrctrImgPath: null },
];

const getFakePets = () =>
  getQueryParam('fakePets') === '1' ? fakePets.slice(0, 1) : fakePets;

const findPetNm = (petSn) => fakePets.find((pet) => pet.petSn === petSn)?.petNm;

// 반려동물 목록은 SJM의 pet 도메인 API다. 연결할 때 페이지에서 pet 도메인 훅으로 바꾼다
export const getPets = () =>
  Promise.resolve(getFakePets().map((pet) => ({ ...pet })));

let nextSchdlSn = 100;

const fakeSchedules = [
  {
    schdlSn: 1,
    petSn: 1,
    schdlTypeCd: 'HOSP',
    ckupTypeCd: 'REG',
    hospNm: '늘봄동물병원',
    schdlNm: null,
    schdlYmd: addDays(today, -10),
    schdlTm: '10:30',
    schdlMemoCn: '',
    bdgClrCd: null,
    ckupRcdCnt: 1,
  },
  {
    schdlSn: 2,
    petSn: 3,
    schdlTypeCd: 'HOSP',
    ckupTypeCd: 'DISE',
    hospNm: '해맑은동물병원',
    schdlNm: null,
    schdlYmd: addDays(today, -3),
    schdlTm: null,
    schdlMemoCn: '',
    bdgClrCd: null,
    ckupRcdCnt: 0,
  },
  {
    schdlSn: 3,
    petSn: 2,
    schdlTypeCd: 'BEAUTY',
    ckupTypeCd: null,
    hospNm: null,
    schdlNm: '집 목욕',
    schdlYmd: today,
    schdlTm: '15:00',
    schdlMemoCn: '',
    bdgClrCd: null,
    ckupRcdCnt: 0,
  },
  {
    schdlSn: 4,
    petSn: 1,
    schdlTypeCd: 'HOSP',
    ckupTypeCd: 'REG',
    hospNm: '늘봄동물병원',
    schdlNm: null,
    schdlYmd: today,
    schdlTm: '10:00',
    schdlMemoCn: '오전 예약, 공복 방문',
    bdgClrCd: null,
    ckupRcdCnt: 0,
  },
  {
    schdlSn: 5,
    petSn: 1,
    schdlTypeCd: 'HOSP',
    ckupTypeCd: 'VACC',
    hospNm: '늘봄동물병원',
    schdlNm: null,
    schdlYmd: addDays(today, 3),
    schdlTm: '11:00',
    schdlMemoCn: '',
    bdgClrCd: null,
    ckupRcdCnt: 0,
  },
  {
    schdlSn: 6,
    petSn: 3,
    schdlTypeCd: 'HOSP',
    ckupTypeCd: 'REG',
    hospNm: '해맑은동물병원',
    schdlNm: null,
    schdlYmd: addDays(today, 6),
    schdlTm: null,
    schdlMemoCn: '',
    bdgClrCd: null,
    ckupRcdCnt: 0,
  },
  {
    schdlSn: 7,
    petSn: 2,
    schdlTypeCd: 'BEAUTY',
    ckupTypeCd: null,
    hospNm: null,
    schdlNm: '미용',
    schdlYmd: addDays(today, 10),
    schdlTm: null,
    schdlMemoCn: '',
    bdgClrCd: '#f59e0b',
    ckupRcdCnt: 0,
  },
  {
    schdlSn: 8,
    petSn: 1,
    schdlTypeCd: 'ETC',
    ckupTypeCd: null,
    hospNm: null,
    schdlNm: '사료 주문',
    schdlYmd: addDays(today, 20),
    schdlTm: null,
    schdlMemoCn: '',
    bdgClrCd: null,
    ckupRcdCnt: 0,
  },
];

const getFakeSchedules = () => {
  if (getQueryParam('fakeSchedules') === '0') return [];
  const petSns = getFakePets().map((pet) => pet.petSn);
  return fakeSchedules.filter((schedule) => petSns.includes(schedule.petSn));
};

const toScheduleResponse = (schedule) => ({
  ...schedule,
  petNm: findPetNm(schedule.petSn),
});

// startYmd·endYmd(포함) 범위의 일정. totalSchdlCnt는 기간과 관계없는 전체 일정 수다(0건이면 월 이동 비활성, FN-HLT-003-29)
export const getSchedules = ({ startYmd, endYmd }) => {
  const all = getFakeSchedules();
  const content = all
    .filter(
      (schedule) =>
        schedule.schdlYmd >= startYmd && schedule.schdlYmd <= endYmd,
    )
    .map(toScheduleResponse);
  return Promise.resolve({ content, totalSchdlCnt: all.length });
};

const pickScheduleFields = (body) => ({
  petSn: body.petSn,
  schdlTypeCd: body.schdlTypeCd,
  ckupTypeCd: body.ckupTypeCd ?? null,
  hospNm: body.hospNm ?? null,
  schdlNm: body.schdlNm ?? null,
  schdlYmd: body.schdlYmd,
  schdlTm: body.schdlTm || null,
  schdlMemoCn: body.schdlMemoCn ?? '',
  bdgClrCd: body.bdgClrCd ?? null,
});

export const createSchedule = (body) => {
  const schedule = {
    schdlSn: nextSchdlSn++,
    ...pickScheduleFields(body),
    ckupRcdCnt: 0,
  };
  fakeSchedules.push(schedule);
  return Promise.resolve(toScheduleResponse(schedule));
};

// 반려동물을 바꾸면 연결된 검진기록·연동 케어 항목도 서버가 함께 옮긴다(FN-HLT-003-37). 가짜는 일정만 옮긴다
export const updateSchedule = ({ schdlSn, ...body }) => {
  const target = fakeSchedules.find((schedule) => schedule.schdlSn === schdlSn);
  Object.assign(target, pickScheduleFields(body));
  return Promise.resolve(toScheduleResponse(target));
};

export const deleteSchedule = (schdlSn) => {
  const index = fakeSchedules.findIndex(
    (schedule) => schedule.schdlSn === schdlSn,
  );
  if (index >= 0) fakeSchedules.splice(index, 1);
  return Promise.resolve();
};

// 서비스 기본 항목(FN-HLT-003-12). 기본 항목은 삭제·이름·아이콘 변경 불가, 정기관리는 주기만 바꿀 수 있다
// 메인 표시 기본값은 양치·빗질·발톱 관리 3개(FN-HLT-003-13)
const BASE_CARE_ITEMS = [
  { careItemNm: '화장실 청소', careIconCn: 'wc', rptTypeCd: 'DAILY' },
  {
    careItemNm: '양치',
    careIconCn: 'dentistry',
    rptTypeCd: 'DAILY',
    mainExpsrYn: true,
  },
  {
    careItemNm: '빗질',
    careIconCn: 'brush',
    rptTypeCd: 'DAILY',
    mainExpsrYn: true,
  },
  { careItemNm: '발 관리', careIconCn: 'pets', rptTypeCd: 'DAILY' },
  { careItemNm: '놀이', careIconCn: 'sports_tennis', rptTypeCd: 'DAILY' },
  {
    careItemNm: '귀 청소',
    careIconCn: 'hearing',
    rptTypeCd: 'REGULAR',
    rptCycleCd: '1W',
  },
  {
    careItemNm: '발톱 관리',
    careIconCn: 'content_cut',
    rptTypeCd: 'REGULAR',
    rptCycleCd: '2W',
    mainExpsrYn: true,
  },
  {
    careItemNm: '목욕',
    careIconCn: 'bathtub',
    rptTypeCd: 'REGULAR',
    rptCycleCd: '1M',
  },
  {
    careItemNm: '눈 주변 관리',
    careIconCn: 'visibility',
    rptTypeCd: 'REGULAR',
    rptCycleCd: '2W',
  },
  {
    careItemNm: '발바닥 털 관리',
    careIconCn: 'pets',
    rptTypeCd: 'REGULAR',
    rptCycleCd: '2W',
  },
  {
    careItemNm: '구강 상태 확인',
    careIconCn: 'sentiment_satisfied',
    rptTypeCd: 'REGULAR',
    rptCycleCd: '2W',
  },
];

let nextCareItemSn = 1;
let nextCareRcdSn = 1;

const fakeCareItems = [];
const fakeCareRecords = [];

// 기본 항목의 처음 완료 기록은 예정일 배지(오늘·D-n·+n일)가 섞여 보이도록 고른 날짜다
const BASE_LAST_DONE_DAYS = {
  '귀 청소': -7,
  '발톱 관리': -11,
  목욕: -18,
  '눈 주변 관리': -9,
  '발바닥 털 관리': -17,
  '구강 상태 확인': -4,
};

const addFakeRecord = (item, careYmd) =>
  fakeCareRecords.push({
    careRcdSn: nextCareRcdSn++,
    careItemSn: item.careItemSn,
    petSn: item.petSn,
    careYmd,
  });

fakePets.forEach((pet) => {
  BASE_CARE_ITEMS.forEach((base) => {
    const item = {
      careItemSn: nextCareItemSn++,
      petSn: pet.petSn,
      rptCycleCd: null,
      rptCycleDayCnt: null,
      mainExpsrYn: false,
      baseItemYn: true,
      lnkgTypeCd: null,
      ckupRcdSn: null,
      dosEndYmd: null,
      dayGoalCnt: null,
      regYmd: addDays(today, -60),
      ...base,
    };
    fakeCareItems.push(item);
    const lastDone = BASE_LAST_DONE_DAYS[item.careItemNm];
    if (lastDone !== undefined) addFakeRecord(item, addDays(today, lastDone));
  });
});

// 처방약(주기 체크 ON)·반복 예방으로 자동 생긴 항목 예시. 출처는 검진상세(SCR-HLT-005)다
fakeCareItems.push(
  {
    careItemSn: nextCareItemSn++,
    petSn: 1,
    careItemNm: '소염제',
    careIconCn: 'medication',
    rptTypeCd: 'DAILY',
    rptCycleCd: null,
    rptCycleDayCnt: null,
    mainExpsrYn: false,
    baseItemYn: false,
    lnkgTypeCd: 'PRSC',
    ckupRcdSn: 1,
    dosEndYmd: addDays(today, 5),
    dayGoalCnt: 2,
    regYmd: addDays(today, -10),
  },
  {
    careItemSn: nextCareItemSn++,
    petSn: 1,
    careItemNm: '심장사상충 예방',
    careIconCn: 'pest_control',
    rptTypeCd: 'REGULAR',
    rptCycleCd: '1M',
    rptCycleDayCnt: null,
    mainExpsrYn: false,
    baseItemYn: false,
    lnkgTypeCd: 'PRVNT',
    ckupRcdSn: 1,
    dosEndYmd: null,
    dayGoalCnt: null,
    regYmd: addDays(today, -16),
  },
);

fakeCareItems
  .filter((item) => item.rptTypeCd === 'DAILY' && item.baseItemYn)
  .forEach((item) => {
    if (['양치', '화장실 청소', '놀이'].includes(item.careItemNm))
      addFakeRecord(item, addDays(today, -1));
    if (['양치', '발 관리'].includes(item.careItemNm))
      addFakeRecord(item, addDays(today, -2));
  });

// 투약 항목의 오늘 체크 횟수. 서버에서는 체크 기록으로 센다
const doseChecks = new Map();

const getFakeRecords = () =>
  getQueryParam('fakeRecords') === '0' ? [] : fakeCareRecords;

const toCareItemResponse = (item, records) => {
  const doneToday = records.some(
    (record) =>
      record.careItemSn === item.careItemSn && record.careYmd === getTodayYmd(),
  );
  return {
    ...item,
    nextSchdYmd:
      item.rptTypeCd === 'REGULAR' ? getNextDueYmd(item, records) : null,
    todayChckCnt: item.dayGoalCnt
      ? (doseChecks.get(item.careItemSn) ?? 0)
      : null,
    todayDoneYn: doneToday,
  };
};

export const getCareItems = (petSn) => {
  const records = getFakeRecords();
  const careItems = fakeCareItems
    .filter((item) => item.petSn === petSn)
    .map((item) => toCareItemResponse(item, records));
  const careRecords = records
    .filter((record) => record.petSn === petSn)
    .map((record) => {
      const item = fakeCareItems.find(
        (careItem) => careItem.careItemSn === record.careItemSn,
      );
      return {
        ...record,
        careItemNm: item.careItemNm,
        careIconCn: item.careIconCn,
        rptTypeCd: item.rptTypeCd,
      };
    });
  return Promise.resolve({ careItems, careRecords });
};

const findItem = (careItemSn) =>
  fakeCareItems.find((item) => item.careItemSn === careItemSn);

const removeTodayRecord = (careItemSn) => {
  const index = fakeCareRecords.findIndex(
    (record) =>
      record.careItemSn === careItemSn && record.careYmd === getTodayYmd(),
  );
  if (index >= 0) fakeCareRecords.splice(index, 1);
  return index >= 0;
};

// 타일 클릭(FN-HLT-003-12). 일반 항목은 오늘 완료를 켜고 끈다. 투약 항목은 누를 때마다 1회씩 올리고 목표 횟수를 채우면 완료 기록을 남긴다
export const checkCareItem = (careItemSn) => {
  const item = findItem(careItemSn);
  if (item.dayGoalCnt) {
    const count = doseChecks.get(careItemSn) ?? 0;
    if (count >= item.dayGoalCnt) return Promise.resolve();
    doseChecks.set(careItemSn, count + 1);
    if (count + 1 === item.dayGoalCnt) addFakeRecord(item, getTodayYmd());
    return Promise.resolve();
  }
  if (!removeTodayRecord(careItemSn)) addFakeRecord(item, getTodayYmd());
  return Promise.resolve();
};

export const cancelLastDose = (careItemSn) => {
  const item = findItem(careItemSn);
  const count = doseChecks.get(careItemSn) ?? 0;
  if (count === 0) return Promise.resolve();
  if (count === item.dayGoalCnt) removeTodayRecord(careItemSn);
  doseChecks.set(careItemSn, count - 1);
  return Promise.resolve();
};

// 기록 내용의 아이콘 클릭. 정기관리 다음 예정일은 남은 기록으로 다시 계산된다
export const cancelCareRecord = (careRcdSn) => {
  const index = fakeCareRecords.findIndex(
    (record) => record.careRcdSn === careRcdSn,
  );
  if (index < 0) return Promise.resolve();
  const [record] = fakeCareRecords.splice(index, 1);
  const item = findItem(record.careItemSn);
  if (item.dayGoalCnt && record.careYmd === getTodayYmd())
    doseChecks.set(item.careItemSn, 0);
  return Promise.resolve();
};

export const toggleCareMain = (careItemSn) => {
  const item = findItem(careItemSn);
  if (!item.mainExpsrYn) {
    const mainCount = fakeCareItems.filter(
      (careItem) => careItem.petSn === item.petSn && careItem.mainExpsrYn,
    ).length;
    if (mainCount >= MAX_MAIN_CARE) {
      return Promise.reject({
        code: 'CARE_MAIN_LIMIT',
        message:
          '메인에는 6개까지 보여줄 수 있어요. 다른 항목을 먼저 해제해 주세요.',
        fields: null,
      });
    }
  }
  item.mainExpsrYn = !item.mainExpsrYn;
  return Promise.resolve();
};

// 마지막으로 한 날(lastCareYmd)을 넣으면 그 날짜의 완료 기록도 함께 남긴다(FN-HLT-003-38)
export const createCareItem = ({
  petSn,
  careItemNm,
  careIconCn,
  rptTypeCd,
  rptCycleCd,
  rptCycleDayCnt,
  lastCareYmd,
}) => {
  const item = {
    careItemSn: nextCareItemSn++,
    petSn,
    careItemNm,
    careIconCn,
    rptTypeCd,
    rptCycleCd: rptTypeCd === 'REGULAR' ? rptCycleCd : null,
    rptCycleDayCnt: rptCycleCd === 'CUSTOM' ? Number(rptCycleDayCnt) : null,
    mainExpsrYn: false,
    baseItemYn: false,
    lnkgTypeCd: null,
    ckupRcdSn: null,
    dosEndYmd: null,
    dayGoalCnt: null,
    regYmd: getTodayYmd(),
  };
  fakeCareItems.push(item);
  if (rptTypeCd === 'REGULAR' && lastCareYmd) addFakeRecord(item, lastCareYmd);
  return Promise.resolve({ ...item });
};
