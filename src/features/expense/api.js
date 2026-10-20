import { getCurrentYm, shiftYm } from '@/utils/yearMonth';
import { EXPND_CLSF_LIST, PET_STTS } from './expenseCodes';

// 가짜 응답: 가계부 API(SJM 백엔드)가 나오기 전까지 쓴다.
// 함수 이름과 경로 주석은 실제 API와 같게 두고, API가 나오면 본문만 api 요청으로 바꾼다.
// 아직 정해지지 않은 키: petNm·petStts(지출에 남은 반려동물의 이름·상태), mmExpndLimAmt(월 한도),
// pets·expndMonths(overview). 집계는 지금 화면이 하고 서버가 주면 그 값으로 바꾼다
const [HOSPITAL, FEED, SNACK, SUPPLY, GROOM, CARE, ETC] = EXPND_CLSF_LIST.map(
  (clsf) => clsf.code,
);

const fakePets = [
  { petSn: 1, petNm: '초코', petStts: PET_STTS.ACTIVE },
  { petSn: 2, petNm: '나비', petStts: PET_STTS.ACTIVE },
  { petSn: 3, petNm: '보리', petStts: PET_STTS.ACTIVE },
  { petSn: 4, petNm: '두부', petStts: PET_STTS.ACTIVE },
  { petSn: 5, petNm: '치즈', petStts: PET_STTS.ACTIVE },
  { petSn: 6, petNm: '콩이', petStts: PET_STTS.ACTIVE },
  { petSn: 7, petNm: '하루', petStts: PET_STTS.UNLINKED },
  { petSn: 8, petNm: '모리', petStts: PET_STTS.DELETED },
];

// [일, petSn(null은 공용), 카테고리, 금액, 내용]. 일은 28일까지만 써서 어느 달에도 있다
const TEMPLATE = [
  [1, 1, FEED, 38000, '연어 사료 5kg'],
  [2, null, SUPPLY, 21000, '배변패드 대용량'],
  [3, 1, HOSPITAL, 120000, '정기 검진 · 행복동물병원'],
  [4, 2, SNACK, 9000, '츄르 20개입'],
  [5, 7, HOSPITAL, 45000, '예방접종'],
  [7, null, FEED, 32000, '습식 사료 묶음'],
  [8, 4, SNACK, 6500, '동결건조 간식'],
  [9, 8, CARE, 30000, '산책 대행'],
  [10, 2, SUPPLY, 15000, '캣타워 쿠션'],
  [12, 4, SNACK, 8500, '덴탈껌'],
  [13, 3, GROOM, 40000, '목욕 · 위생미용'],
  [14, 6, SUPPLY, 12000, '하네스'],
  [15, 1, GROOM, 45000, '부분 미용 · 애견미용실'],
  [15, 2, SNACK, 12000, '츄르 30개입'],
  [17, 5, FEED, 29000, '고양이 사료 3kg'],
  [18, 6, ETC, 7000, '펫 보험료'],
  [19, 2, SUPPLY, 23000, '고양이 모래 · 쿠팡'],
  [20, 3, HOSPITAL, 52000, '피부 진료'],
  [21, 4, CARE, 25000, '방문 돌봄'],
  [22, null, SUPPLY, 18000, '물그릇 세트'],
  [24, 1, CARE, 60000, '정기 돌봄 서비스'],
  [25, 5, SNACK, 4500, '고양이 간식'],
  [26, 6, FEED, 27000, '소형견 사료'],
  [28, 3, ETC, 11000, '이름표 제작'],
];

// 이번 달 24건, 지난달 12건, 2개월 전 6건, 5개월 전 2건
const MONTH_PLANS = [
  { offset: 0, rows: TEMPLATE, rate: 1 },
  { offset: -1, rows: TEMPLATE.slice(0, 12), rate: 0.9 },
  { offset: -2, rows: TEMPLATE.slice(0, 6), rate: 1.1 },
  { offset: -5, rows: TEMPLATE.slice(2, 4), rate: 1 },
];

const buildFakeExpenses = () => {
  const currentYm = getCurrentYm();
  let expndSn = 0;
  return MONTH_PLANS.flatMap(({ offset, rows, rate }) =>
    rows.map(([day, petSn, expndClsfCd, amt, dtlMttr]) => {
      const pet = fakePets.find((p) => p.petSn === petSn);
      expndSn += 1;
      return {
        expndSn,
        petSn,
        petNm: pet?.petNm ?? null,
        petStts: pet?.petStts ?? null,
        expndClsfCd,
        expndAmt: Math.round((amt * rate) / 500) * 500,
        dtlMttr,
        expndYmd: `${shiftYm(currentYm, offset)}-${String(day).padStart(2, '0')}`,
      };
    }),
  );
};

let fakeExpenses = buildFakeExpenses();
// 처음에는 한도를 설정하지 않은 상태다
let fakeLimit = null;

const fakeDelay = (data) =>
  new Promise((resolve) => setTimeout(() => resolve(data), 200));

// GET /expenses?fromYm=&toYm=. 두 값이 없으면 전체 기간
export const getExpenses = ({ fromYm, toYm }) =>
  fakeDelay(
    fakeExpenses.filter((expense) => {
      const ym = expense.expndYmd.slice(0, 7);
      return (!fromYm || ym >= fromYm) && (!toYm || ym <= toYm);
    }),
  );

// GET /expenses/overview. 월 한도, 연동된 동물(등록순), 지출이 있는 연월
export const getExpenseOverview = () =>
  fakeDelay({
    mmExpndLimAmt: fakeLimit,
    pets: fakePets,
    expndMonths: [
      ...new Set(fakeExpenses.map((expense) => expense.expndYmd.slice(0, 7))),
    ].sort(),
  });

// PUT /expenses/limit. 처음 저장하면 서버가 한도 알림 수신을 켠다
export const saveExpenseLimit = (mmExpndLimAmt) => {
  fakeLimit = mmExpndLimAmt;
  return fakeDelay(null);
};

// DELETE /expenses/{expndSn}
export const deleteExpense = (expndSn) => {
  fakeExpenses = fakeExpenses.filter((expense) => expense.expndSn !== expndSn);
  return fakeDelay(null);
};

// DELETE /expenses. 선택한 지출을 한 번에 지운다
export const deleteExpenses = (expndSns) => {
  fakeExpenses = fakeExpenses.filter(
    (expense) => !expndSns.includes(expense.expndSn),
  );
  return fakeDelay(null);
};
