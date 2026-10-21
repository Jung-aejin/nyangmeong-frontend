import { addDays, getTodayYmd, getYear } from '@/utils/formatDate';
import { getQueryParam, getSchedules } from './api';
import { DOSING } from './checkup/checkupTypes';
import { getCheckupDetail } from './checkupApi';
import { getCheckups, getDailyRecords, getObservations } from './diaryApi';
import { WEIGHT } from './diaryTypes';
import { HOSPITAL } from './scheduleTypes';

/**
 * [종합 건강기록 API 가짜 응답]
 * - 반려동물별 종합 조회 API(JAJ 백엔드)와 반려동물 프로필 조회(SJM)가 생기기 전까지 쓰는 가짜 응답
 * - 다른 화면의 가짜 저장소(검진기록·검진상세·일상 기록·지속 관찰·일정)를 모아 만들어, 다른 화면에서 바꾼 값이 그대로 보임
 * - 프로필(품종·성별·생일·체중·알레르기·기저질환)만 이 파일의 임시 값이고 필드 이름은 가안
 * - 개발 환경에서만 ?fakeSummary=0(모든 영역 0건, 알레르기·기저질환 미입력), ?fakeSummary=1(검사·관찰 1회차만)
 */

const TIMELINE_COUNT = 5;
const TREND_COUNT = 4;
const ATTACHMENT_COUNT = 4;
const VACCINATION = 'VACC';
const REGULAR = 'REG';

/** 타임라인 항목 종류 */
export const TIMELINE_CHECKUP = 'CKUP';
export const TIMELINE_PREVENTION = 'PRVNT';

const today = getTodayYmd();

const fakeProfiles = {
  1: {
    brdNm: '코리안숏헤어',
    birthYmd: addDays(today, -1160),
    sexNm: '암컷',
    wghtVal: 4.2,
    allrgCn: '닭고기',
    undrlDiseCn: '슬개골 탈구',
  },
  2: {
    brdNm: '러시안블루',
    birthYmd: addDays(today, -900),
    sexNm: '수컷',
    wghtVal: 4.6,
    allrgCn: '',
    undrlDiseCn: '',
  },
  3: {
    brdNm: '말티즈',
    birthYmd: addDays(today, -2100),
    sexNm: '수컷',
    wghtVal: 9.0,
    allrgCn: '',
    undrlDiseCn: '비만 주의',
  },
};

const compareDesc = (a, b) => (a === b ? 0 : a < b ? 1 : -1);

/** 반려동물의 검진기록 전체(최신순) */
const getAllCheckups = async (petSn) => {
  const { years } = await getCheckups({ petSn, year: getYear(today) });
  const lists = await Promise.all(
    years.map((year) => getCheckups({ petSn, year })),
  );
  return lists
    .flatMap((list) => list.content)
    .sort(
      (a, b) =>
        compareDesc(a.ckupYmd, b.ckupYmd) || b.ckupRcdSn - a.ckupRcdSn,
    );
};

/** 같은 검진유형의 오늘 이후 가장 가까운 병원 일정 날짜. 없으면 null */
const findNextHospitalYmd = (schedules, ckupTypeCd) =>
  schedules
    .filter(
      (schedule) =>
        schedule.schdlTypeCd === HOSPITAL && schedule.ckupTypeCd === ckupTypeCd,
    )
    .map((schedule) => schedule.schdlYmd)
    .sort()[0] ?? null;

/** 혈액검사 항목별 이력(오래된 순, 최근 4회) */
const buildTrends = (detailsByCheckup) => {
  const trends = {};
  [...detailsByCheckup]
    .reverse()
    .forEach(({ checkup, bloodInspections }) => {
      bloodInspections.forEach((item) => {
        const trend = (trends[item.inspItmNm] ??= {
          inspItmNm: item.inspItmNm,
          fnctTagCd: item.fnctTagCd,
          unitNm: item.unitNm,
          points: [],
        });
        trend.unitNm = item.unitNm;
        trend.refMinVal = item.refMinVal;
        trend.refMaxVal = item.refMaxVal;
        trend.points.push({
          ckupRcdSn: checkup.ckupRcdSn,
          ckupYmd: checkup.ckupYmd,
          rsltVal: item.rsltVal,
        });
      });
    });
  Object.values(trends).forEach((trend) => {
    trend.points = trend.points.slice(-TREND_COUNT);
  });
  return trends;
};

export const getHealthSummary = async (petSn) => {
  const mode = getQueryParam('fakeSummary');
  const isEmptyMode = mode === '0';
  const isOneMode = mode === '1';

  const checkups = isEmptyMode ? [] : await getAllCheckups(petSn);
  const detailsByCheckup = await Promise.all(
    checkups.map(async (checkup) => ({
      checkup,
      ...(await getCheckupDetail(checkup.ckupRcdSn)),
    })),
  );

  const profile = fakeProfiles[petSn];
  const [{ content: dailyRecords }, { content: observationItems }] =
    await Promise.all([
      getDailyRecords({ petSn }),
      getObservations({ petSn }),
    ]);
  const { content: schedules } = await getSchedules({
    startYmd: today,
    endYmd: addDays(today, 730),
  });
  const petSchedules = schedules.filter((schedule) => schedule.petSn === petSn);

  /** 요약 바 몸무게: 일상 기록의 최신 체중, 없으면 프로필 체중 */
  const latestWeight = dailyRecords
    .filter((record) => record.rcdTypeCd === WEIGHT)
    .sort(
      (a, b) =>
        compareDesc(`${a.rcdYmd} ${a.rcdTm}`, `${b.rcdYmd} ${b.rcdTm}`) ||
        b.dlyRcdSn - a.dlyRcdSn,
    )[0];

  const trends = buildTrends(detailsByCheckup);
  const latestLabDetail = detailsByCheckup.find(
    (detail) => detail.bloodInspections.length > 0,
  );
  const lab = latestLabDetail
    ? {
        ckupRcdSn: latestLabDetail.checkup.ckupRcdSn,
        ckupYmd: latestLabDetail.checkup.ckupYmd,
        items: latestLabDetail.bloodInspections,
      }
    : null;
  if (isOneMode) {
    Object.values(trends).forEach((trend) => {
      trend.points = trend.points.slice(-1);
    });
  }

  const prescriptions = detailsByCheckup
    .flatMap(({ checkup, prescriptions: list }) =>
      list.map((prescription) => ({
        ...prescription,
        ckupRcdSn: checkup.ckupRcdSn,
      })),
    )
    .sort(
      (a, b) =>
        Number(b.dosSttsCd === DOSING) - Number(a.dosSttsCd === DOSING) ||
        compareDesc(a.dosBgnYmd, b.dosBgnYmd) ||
        b.rxSn - a.rxSn,
    );

  const attachments = detailsByCheckup
    .flatMap(({ checkup, attachments: list }) =>
      list.map((attachment) => ({
        ...attachment,
        ckupRcdSn: checkup.ckupRcdSn,
        ckupYmd: checkup.ckupYmd,
      })),
    )
    .sort(
      (a, b) => compareDesc(a.ckupYmd, b.ckupYmd) || b.atchSn - a.atchSn,
    )
    .slice(0, ATTACHMENT_COUNT);

  /** 관찰중 항목만, 회차는 관찰일 순 */
  let observations = observationItems.filter((item) => item.obsvEndYmd === null);
  if (isEmptyMode) observations = [];
  if (isOneMode) {
    observations = observations
      .slice(0, 1)
      .map((item) => ({ ...item, rounds: item.rounds.slice(0, 1) }));
  }

  const pastCheckups = checkups.filter((checkup) => checkup.ckupYmd <= today);
  const vaccinations = pastCheckups.filter(
    (checkup) => checkup.ckupTypeCd === VACCINATION,
  );
  const regulars = pastCheckups.filter(
    (checkup) => checkup.ckupTypeCd === REGULAR,
  );

  const lastRecordYmd =
    [
      ...checkups.map((checkup) => checkup.ckupYmd),
      ...dailyRecords.map((record) => record.rcdYmd),
      ...observations.flatMap((item) =>
        item.rounds.map((round) => round.obsvYmd),
      ),
    ].sort(compareDesc)[0] ?? null;

  /** 건강 이력 타임라인: 검진기록과 반복 예방(시작일)을 날짜순으로 섞은 최신 5건 */
  const timeline = [
    ...pastCheckups.map((checkup) => ({
      tlKey: `ckup-${checkup.ckupRcdSn}`,
      tlTypeCd: TIMELINE_CHECKUP,
      ymd: checkup.ckupYmd,
      ckupRcdSn: checkup.ckupRcdSn,
      ckupTypeCd: checkup.ckupTypeCd,
      hospNm: checkup.hospNm,
      cn: checkup.ckupCn,
    })),
    ...detailsByCheckup.flatMap(({ checkup, preventions }) =>
      preventions
        .filter((prevention) => prevention.startYmd <= today)
        .map((prevention) => ({
          tlKey: `prvnt-${prevention.prvntSn}`,
          tlTypeCd: TIMELINE_PREVENTION,
          ymd: prevention.startYmd,
          ckupRcdSn: checkup.ckupRcdSn,
          hospNm: checkup.hospNm,
          prvntItmCd: prevention.prvntItmCd,
        })),
    ),
  ]
    .sort(
      (a, b) =>
        compareDesc(a.ymd, b.ymd) ||
        (a.tlTypeCd === b.tlTypeCd ? 0 : a.tlTypeCd === TIMELINE_CHECKUP ? -1 : 1),
    )
    .slice(0, TIMELINE_COUNT);

  return {
    baseYmd: today,
    lastRecordYmd,
    profile: {
      ...profile,
      wghtVal: latestWeight?.rcdVal ?? profile.wghtVal,
      allrgCn: isEmptyMode ? '' : profile.allrgCn,
      undrlDiseCn: isEmptyMode ? '' : profile.undrlDiseCn,
    },
    latestCheckup: pastCheckups[0] ?? null,
    timeline,
    prevention: {
      vaccinations: vaccinations.slice(0, 2),
      nextVaccinationYmd: findNextHospitalYmd(petSchedules, VACCINATION),
      latestRegularYmd: regulars[0]?.ckupYmd ?? null,
      nextRegularYmd: findNextHospitalYmd(petSchedules, REGULAR),
    },
    lab,
    trends,
    prescriptions,
    attachments,
    observations,
  };
};
