/**
 * [가짜 일정 등록 해석]
 * - Python AI 서버의 규칙 해석·AI 보조·반려동물 결정 연결 전 임시 구현
 * - 화면설계서 예시 문장과 수정 요청이 돌아갈 만큼만 해석
 */

import { WEEKDAYS, formatDate, parseYmd, toYmd } from '@/utils/formatDate';

/** 월요일 기준 요일 순서 */
const WEEKDAY_ORDER = '월화수목금토일';

const HOSPITAL_CATEGORY = '병원';
const CATEGORY_RULES = [
  { category: HOSPITAL_CATEGORY, pattern: /병원|예방접종|접종|검진|진료/ },
  { category: '미용·목욕', pattern: /미용|목욕/ },
  { category: '케어·투약', pattern: /투약|복약/ },
];
const CKUP_RULES = [
  { type: '예방접종', pattern: /예방접종|접종/ },
  { type: '정기검진', pattern: /정기검진|검진/ },
  { type: '진료', pattern: /진료/ },
];
const REVISE_PATTERN = /바꿔|변경|수정|로 ?해 ?줘/;
const REGISTER_VERB_PATTERN =
  /등록해 ?줘|등록|잡아 ?줘|잡아|추가해 ?줘|추가|넣어 ?줘|넣어/g;
const LAST_DONE_PATTERN =
  /(지난 ?주 ?[월화수목금토일]요일|어제|그제|그저께|오늘|\d{1,2}월 ?\d{1,2}일)에? ?했[가-힣]*/;
/** 병원명으로 볼 수 없는 앞말: 조사로 끝나거나 날짜·시간 표현 */
const NOT_HOSPITAL_NAME = /[에로]$|\d|요일/;

const pad = (value) => String(value).padStart(2, '0');

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

/** 오늘 0시 */
const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** 이번 주 월요일 */
const mondayOf = (date) => addDays(date, -((date.getDay() + 6) % 7));

/** 날짜 표현 → YYYY-MM-DD, 없으면 null */
const parseDate = (text, today) => {
  if (/모레/.test(text)) return toYmd(addDays(today, 2));
  if (/내일/.test(text)) return toYmd(addDays(today, 1));
  if (/그제|그저께/.test(text)) return toYmd(addDays(today, -2));
  if (/어제/.test(text)) return toYmd(addDays(today, -1));
  if (/오늘/.test(text)) return toYmd(today);

  const week = text.match(/(다음|이번|지난) ?주 ?([월화수목금토일])요일/);
  if (week) {
    const offset = { 다음: 7, 이번: 0, 지난: -7 }[week[1]];
    const index = WEEKDAY_ORDER.indexOf(week[2]);
    return toYmd(addDays(mondayOf(today), offset + index));
  }

  const monthDay = text.match(/(\d{1,2})월 ?(\d{1,2})일/);
  if (monthDay) {
    let date = new Date(today.getFullYear(), monthDay[1] - 1, monthDay[2]);
    if (date < today) {
      date = new Date(today.getFullYear() + 1, monthDay[1] - 1, monthDay[2]);
    }
    return toYmd(date);
  }

  const weekday = text.match(/([월화수목금토일])요일/);
  if (weekday) {
    const target = WEEKDAYS.indexOf(weekday[1]);
    const ahead = ((target - today.getDay() + 6) % 7) + 1;
    return toYmd(addDays(today, ahead));
  }
  return null;
};

/** 시간 표현 → HH:MM, 없으면 null */
const parseTime = (text) => {
  const clock = text.match(/(\d{1,2}):(\d{2})/);
  if (clock) return `${pad(clock[1])}:${clock[2]}`;

  const korean = text.match(
    /(오전|오후)? ?(\d{1,2}) ?시(?: ?(\d{1,2}) ?분| ?(반))?/,
  );
  if (!korean) return null;
  let hour = Number(korean[2]);
  /** 오전·오후가 없으면 1~7시는 오후로 해석 */
  if (korean[1] === '오후' && hour < 12) hour += 12;
  if (!korean[1] && hour >= 1 && hour <= 7) hour += 12;
  const minute = korean[4] ? 30 : Number(korean[3] ?? 0);
  return `${pad(hour)}:${pad(minute)}`;
};

/** 주기 표현 → { match, repeatType, cycleNm } */
const parseCycle = (text) => {
  if (/매일/.test(text)) {
    return { match: '매일', repeatType: 'DAILY', cycleNm: null };
  }
  const weeks = text.match(/(\d+) ?주 ?마다/);
  if (weeks) {
    return { match: weeks[0], repeatType: 'CYCLE', cycleNm: `${weeks[1]}주` };
  }
  const biweekly = text.match(/격주/);
  if (biweekly) {
    return { match: '격주', repeatType: 'CYCLE', cycleNm: '2주' };
  }
  const weekly = text.match(/매 ?주(?! ?[월화수목금토일]요일)/);
  if (weekly) {
    return { match: weekly[0], repeatType: 'CYCLE', cycleNm: '1주' };
  }
  const monthly = text.match(/한 ?달 ?마다|매달/);
  if (monthly) {
    return { match: monthly[0], repeatType: 'CYCLE', cycleNm: '한달' };
  }
  const yearly = text.match(/1 ?년 ?마다|매년/);
  if (yearly) {
    return { match: yearly[0], repeatType: 'CYCLE', cycleNm: '1년' };
  }
  const days = text.match(/(\d+) ?일 ?마다/);
  if (days) {
    return { match: days[0], repeatType: 'CYCLE', cycleNm: `${days[1]}일` };
  }
  return null;
};

/** 마지막으로 한 날부터 주기만큼 뒤 */
const addCycle = (ymd, repeatType, cycleNm) => {
  const date = parseYmd(ymd);
  if (repeatType === 'DAILY') return toYmd(addDays(date, 1));
  const weeks = cycleNm.match(/^(\d+)주$/);
  if (weeks) return toYmd(addDays(date, Number(weeks[1]) * 7));
  const days = cycleNm.match(/^(\d+)일$/);
  if (days) return toYmd(addDays(date, Number(days[1])));
  if (cycleNm === '한달') date.setMonth(date.getMonth() + 1);
  if (cycleNm === '1년') date.setFullYear(date.getFullYear() + 1);
  return toYmd(date);
};

const parseHospitalName = (text, petNames) => {
  const isName = (name) =>
    name && !NOT_HOSPITAL_NAME.test(name) && !petNames.includes(name);
  const spaced = text.match(/([가-힣A-Za-z0-9]{2,}) ?동물병원/);
  if (spaced && isName(spaced[1])) return `${spaced[1]} 동물병원`;
  const attached = text.match(/([가-힣A-Za-z0-9]{2,})병원/);
  if (attached && attached[1] !== '동물' && isName(attached[1])) {
    return `${attached[1]}병원`;
  }
  return null;
};

/** 항목명: 반려동물 이름·주기·등록 동사·구두점을 뺀 나머지 */
const parseItemName = (text, petNames, cycleMatch) => {
  let rest = text.replace(cycleMatch, ' ').replace(REGISTER_VERB_PATTERN, ' ');
  petNames.forEach((name) => {
    rest = rest.replace(name, ' ');
  });
  rest = rest
    .replace(/[,.!?]/g, ' ')
    .replace(/(을|를|도) /g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return rest === '' ? null : rest;
};

const findPet = (text, pets) => pets.find((pet) => text.includes(pet.petNm));

/** 문장에서 찾은 값만 모은 초안 조각 */
const extract = (text, { pets, draft, today }) => {
  const petNames = pets.map((pet) => pet.petNm);
  const lastDone = text.match(LAST_DONE_PATTERN);
  const body = lastDone ? text.replace(lastDone[0], ' ') : text;
  const cycle = parseCycle(body);
  const found = {};

  const pet = findPet(text, pets);
  if (pet) {
    found.petSn = pet.petSn;
    found.petNm = pet.petNm;
  }
  if (cycle) {
    found.kind = 'CARE';
    found.repeatType = cycle.repeatType;
    found.cycleNm = cycle.cycleNm;
    const itemNm = parseItemName(body, petNames, cycle.match);
    if (itemNm && !draft?.itemNm) found.itemNm = itemNm;
    if (lastDone) found.lastYmd = parseDate(lastDone[1], today);
    return found;
  }
  /** 되묻는 중인 케어 항목: 주기 없는 답도 이어서 처리 */
  if (draft?.kind === 'CARE') {
    found.kind = 'CARE';
    const itemNm = parseItemName(body, petNames, '');
    if (itemNm && !draft.itemNm) found.itemNm = itemNm;
    return found;
  }

  found.kind = 'SCHEDULE';
  const date = parseDate(body, today);
  if (date) found.ymd = date;
  const time = parseTime(body);
  if (time) found.time = time;
  const category = CATEGORY_RULES.find((rule) => rule.pattern.test(body));
  if (category) {
    found.category = category.category;
    if (category.category === HOSPITAL_CATEGORY) {
      const ckup = CKUP_RULES.find((rule) => rule.pattern.test(body));
      if (ckup) found.ckupType = ckup.type;
      const hospital = parseHospitalName(body, petNames);
      if (hospital) found.hsptlNm = hospital;
    } else {
      found.title = body.match(category.pattern)[0];
    }
  }
  return found;
};

/** 마지막 태그·1마리 회원 규칙으로 반려동물을 정한 초안 */
const resolvePet = (draft, { pets, petSn }) => {
  if (draft.petSn != null) return draft;
  const tagged = pets.find((pet) => pet.petSn === petSn);
  const only = pets.length === 1 ? pets[0] : null;
  const pet = tagged ?? only;
  return pet ? { ...draft, petSn: pet.petSn, petNm: pet.petNm } : draft;
};

/** 비어 있는 필수 칸 이름 */
const findMissing = (draft) => {
  const missing = [];
  if (draft.petSn == null) missing.push('pet');
  if (draft.kind === 'CARE') {
    if (!draft.itemNm) missing.push('itemNm');
    return missing;
  }
  if (!draft.category) missing.push('category');
  if (!draft.ymd) missing.push('ymd');
  if (draft.category === HOSPITAL_CATEGORY) {
    if (!draft.hsptlNm) missing.push('hsptlNm');
    if (!draft.ckupType) missing.push('ckupType');
  } else if (draft.category && !draft.title) {
    missing.push('title');
  }
  return missing;
};

const ASK_MESSAGES = {
  pet: '어느 반려동물인가요?',
  category: '어떤 일정인가요? (병원 / 미용·목욕 / 케어·투약 / 기타)',
  ymd: '언제인가요? (예: 다음 주 화요일 오후 3시)',
  title: '일정 이름을 알려 주세요.',
  itemNm: '어떤 관리 항목인가요?',
};

/** 되물음 문구: 빈 칸만 */
const buildAsk = (missing) => {
  const lines = [];
  if (missing.includes('hsptlNm') && missing.includes('ckupType')) {
    lines.push(
      '어느 병원인가요? 검진 종류도 알려 주세요. (예: 정기검진, 예방접종)',
    );
  } else if (missing.includes('hsptlNm')) {
    lines.push('어느 병원인가요?');
  } else if (missing.includes('ckupType')) {
    lines.push('검진 종류를 알려 주세요. (예: 정기검진, 예방접종)');
  }
  ['pet', 'category', 'ymd', 'title', 'itemNm']
    .filter((key) => missing.includes(key))
    .forEach((key) => lines.push(ASK_MESSAGES[key]));
  return lines.join(' ');
};

/** 저장 직전 재검증용 필수 칸 검사 */
export const findMissingCardFields = (card) => {
  if (card.cardTypeCd === 'CARE') {
    return card.careArtclNm ? [] : ['careArtclNm'];
  }
  const missing = [];
  if (!card.schdlYmd) missing.push('schdlYmd');
  if (card.schdlKndNm === HOSPITAL_CATEGORY) {
    if (!card.schdlCkupTypeCd) missing.push('schdlCkupTypeCd');
    if (!card.schdlHsptlNm) missing.push('schdlHsptlNm');
  } else if (!card.schdlNm) {
    missing.push('schdlNm');
  }
  return missing;
};

const toCard = (draft, careItems, today) => {
  if (draft.kind === 'CARE') {
    const lastYmd = draft.lastYmd ?? toYmd(today);
    return {
      cardTypeCd: 'CARE',
      petSn: draft.petSn,
      petNm: draft.petNm,
      careArtclNm: draft.itemNm,
      careRpttTypeCd: draft.repeatType,
      careCycleNm: draft.cycleNm,
      careLastYmd: lastYmd,
      careNextYmd: addCycle(lastYmd, draft.repeatType, draft.cycleNm),
      isDuplicate: careItems.some(
        (item) =>
          item.petSn === draft.petSn && item.careArtclNm === draft.itemNm,
      ),
    };
  }
  return {
    cardTypeCd: 'SCHEDULE',
    petSn: draft.petSn,
    petNm: draft.petNm,
    schdlKndNm: draft.category,
    schdlCkupTypeCd: draft.ckupType ?? null,
    schdlHsptlNm: draft.hsptlNm ?? null,
    schdlNm: draft.title ?? null,
    schdlYmd: draft.ymd,
    schdlTm: draft.time ?? null,
    schdlMemo: null,
  };
};

/** 결과 문구 날짜 표기: 10.06(화) */
const MONTH_DAY_OPTIONS = { hasYear: false, weekday: true, weekdayGap: '' };

/** 카드 요약: 대화 이력 저장용 한 줄 */
export const describeCard = (card) => {
  if (card.cardTypeCd === 'CARE') {
    return `${card.petNm} ${card.careArtclNm} · 다음 예정일 ${formatDate(card.careNextYmd, MONTH_DAY_OPTIONS)}`;
  }
  const label =
    card.schdlKndNm === HOSPITAL_CATEGORY ? card.schdlCkupTypeCd : card.schdlNm;
  const time = card.schdlTm ? ` ${card.schdlTm}` : '';
  return `${card.petNm} ${label} · ${formatDate(card.schdlYmd, MONTH_DAY_OPTIONS)}${time}`;
};

/** 카드 머리 문구 */
export const getCardTitle = (card) =>
  card.cardTypeCd === 'CARE'
    ? '토탈 케어리스트에 이렇게 추가할까요?'
    : '일정을 이렇게 등록할까요?';

/**
 * 등록 요청 해석
 * - draft: 되묻는 중이거나 수정 중인 이전 초안
 * - 결과: 되물음(ASK, 반려동물 칩 포함 가능) 또는 미리보기 카드(CARD)
 */
export const interpretRegister = ({
  text,
  draft,
  isRevision = false,
  pets,
  petSn,
  careItems,
  today = startOfDay(new Date()),
}) => {
  const found = extract(text, { pets, draft, today });
  /** 종류가 같은 이전 초안 이어받기 */
  const base = draft && draft.kind === found.kind ? draft : null;
  const next = resolvePet({ ...(base ?? {}), ...found }, { pets, petSn });

  if (isRevision && JSON.stringify(next) === JSON.stringify(draft)) {
    return {
      type: 'ASK',
      draft,
      message: '어떻게 바꿀까요? 날짜나 시간을 알려 주세요.',
    };
  }

  const missing = findMissing(next);
  if (missing.length > 0) {
    return {
      type: 'ASK',
      draft: next,
      message: buildAsk(missing),
      petChoices: missing.includes('pet') ? pets : undefined,
    };
  }
  return { type: 'CARD', draft: next, card: toCard(next, careItems, today) };
};

export { REVISE_PATTERN };
