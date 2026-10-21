import { addDays } from '@/utils/formatDate';

/**
 * [영수증 인식 결과 확인 계산]
 * - 탭 만들기·금액 배분·품목 배정·검증·저장 값 만들기를 화면 밖의 순수 함수로 둔다 (FN-HLT-002-34~45)
 * - 탭 한 개 = 반려동물 한 마리의 검진기록 한 건. petSn은 숫자, 미선택은 null, "저장 안 함"은 SKIP
 */

export const MAX_HOSPITAL_NAME_LENGTH = 50;
export const MAX_CONTENT_LENGTH = 500;
export const MAX_MEMO_LENGTH = 200;
export const MAX_DRUG_NAME_LENGTH = 40;

/** 탭의 반려동물을 "저장 안 함"으로 고른 값 */
export const SKIP = 'SKIP';

export const DRUG_STATUSES = [
  { cd: 'ING', nm: '복용중' },
  { cd: 'END', nm: '종료' },
];

let sequence = 0;
const nextId = (prefix) => `${prefix}-${++sequence}`;

const removeSpace = (text) => text.replace(/\s/g, '');

const sum = (values) => values.reduce((total, value) => total + value, 0);

export const toAmount = (text) => (text === '' ? 0 : Number(text));

export const formatAmount = (amount) => `${amount.toLocaleString('ko-KR')}원`;

export const getTooLongMessage = (max) => `${max}자까지 입력할 수 있어요`;

/** 구역 이름이 등록된 이름과 공백을 빼고 같은 반려동물 */
export const findPetByZoneName = (zoneNm, pets) =>
  pets.find((pet) => removeSpace(pet.petNm) === removeSpace(zoneNm));

/** 진료 품목명을 쉼표로 이어 검진 내용으로, 500자를 넘으면 잘라 "…" */
export const joinContent = (names) => {
  const text = names.join(', ');
  return text.length > MAX_CONTENT_LENGTH
    ? `${text.slice(0, MAX_CONTENT_LENGTH - 1)}…`
    : text;
};

/**
 * 하단 할인을 소계 비율로 나눠 뺀다: 원 단위 버림, 남는 금액은 마지막 탭
 * subtotals에 null(인식 못 한 소계)이 있으면 그 탭 금액은 null
 */
export const splitDiscount = (subtotals, discountAmt) => {
  const values = subtotals.map((subtotal) => subtotal ?? 0);
  const total = sum(values);
  const discounts = values.map(() => 0);
  if (discountAmt > 0 && total > 0) {
    values.forEach((value, index) => {
      discounts[index] = Math.floor((discountAmt * value) / total);
    });
    discounts[discounts.length - 1] += discountAmt - sum(discounts);
  }
  return {
    discounts,
    amounts: subtotals.map((subtotal, index) =>
      subtotal == null ? null : subtotal - discounts[index],
    ),
  };
};

/**
 * 인식한 약품 → 처방 약품 행
 * 시작일 = 검진일, 종료일 = 검진일 + 일수 − 1, 상태는 종료일이 오늘보다 이전이면 종료
 */
export const toDrugRow = (drug, ckupYmd, todayYmd) => {
  const endYmd = ckupYmd && drug.days ? addDays(ckupYmd, drug.days - 1) : '';
  return {
    rowId: nextId('drug'),
    drugNm: drug.drugNm ?? '',
    startYmd: ckupYmd,
    endYmd,
    perDay: drug.perDay ? String(drug.perDay) : '',
    statusCd: endYmd && endYmd < todayYmd ? 'END' : 'ING',
    amt: drug.amt ?? null,
    isEdited: false,
  };
};

export const makeEmptyDrugRow = (ckupYmd) => ({
  rowId: nextId('drug'),
  drugNm: '',
  startYmd: ckupYmd,
  endYmd: '',
  perDay: '',
  statusCd: 'ING',
  amt: null,
  isEdited: true,
});

const makeTab = (fields) => ({
  id: nextId('tab'),
  zoneNm: null,
  petSn: null,
  isAutoLinked: false,
  ckupTypeCd: '',
  ckupCn: '',
  ckupMemoCn: '',
  amt: '',
  subtotal: null,
  discount: 0,
  drugs: [],
  isLedger: true,
  edited: { type: false, cn: false, amt: false },
  ...fields,
});

/** 구역이 있는 영수증: 구역마다 탭 1개 */
export const buildZoneTabs = ({ detail, pets, todayYmd }) => {
  const usedPetSns = new Set();
  const matchedPets = detail.zones.map((zone) => {
    const pet = findPetByZoneName(zone.zoneNm, pets);
    if (!pet || usedPetSns.has(pet.petSn)) return null;
    usedPetSns.add(pet.petSn);
    return pet;
  });
  const { amounts, discounts } = splitDiscount(
    detail.zones.map((zone) => zone.subtotal),
    detail.discountAmt,
  );
  return detail.zones.map((zone, index) =>
    makeTab({
      zoneNm: zone.zoneNm,
      petSn: matchedPets[index]?.petSn ?? null,
      isAutoLinked: matchedPets[index] != null,
      ckupTypeCd: zone.ckupTypeCd ?? '',
      ckupCn: joinContent(zone.items.map((item) => item.itmNm)),
      amt: amounts[index] == null ? '' : String(amounts[index]),
      subtotal: zone.subtotal,
      discount: discounts[index],
      drugs: zone.drugs.map((drug) =>
        toDrugRow(drug, detail.ckupYmd, todayYmd),
      ),
    }),
  );
};

/**
 * 구역이 없는 영수증: 탭마다 배정된 품목(lines)으로 검진 내용·금액·약품을 다시 채운다
 * 탭이 1개면 전부 그 탭의 것이고, 2개 이상이면 assign({ [lineSn]: tabId })으로 나눈다
 * 사람이 고친 검진 내용·금액은 그대로 두고, 약품 행은 배정이 바뀔 때마다 다시 만든다
 */
export const applyLineAssignment = ({
  tabs,
  lines,
  assign,
  discountAmt,
  ckupYmd,
  todayYmd,
}) => {
  const isSingle = tabs.length === 1;
  const ownLinesOf = (tab) =>
    lines.filter((line) => isSingle || assign[line.lineSn] === tab.id);
  const subtotals = tabs.map((tab) => {
    const ownLines = ownLinesOf(tab);
    return ownLines.length > 0
      ? sum(ownLines.map((line) => line.amt ?? 0))
      : null;
  });
  const { amounts, discounts } = splitDiscount(subtotals, discountAmt);
  return tabs.map((tab, index) => {
    const ownLines = ownLinesOf(tab);
    return {
      ...tab,
      ckupCn: tab.edited.cn
        ? tab.ckupCn
        : joinContent(
            ownLines
              .filter((line) => line.kind === 'item')
              .map((line) => line.nm),
          ),
      amt: tab.edited.amt
        ? tab.amt
        : amounts[index] == null
          ? ''
          : String(amounts[index]),
      subtotal: subtotals[index],
      discount: discounts[index],
      drugs: ownLines
        .filter((line) => line.kind === 'drug')
        .map((line) =>
          toDrugRow(
            {
              drugNm: line.nm,
              days: line.days,
              perDay: line.perDay,
              amt: line.amt,
            },
            ckupYmd,
            todayYmd,
          ),
        ),
    };
  });
};

export const buildNoZoneTabs = ({ detail, petSn, todayYmd }) =>
  applyLineAssignment({
    tabs: [
      makeTab({
        petSn,
        isAutoLinked: true,
        ckupTypeCd: detail.ckupTypeCd ?? '',
      }),
    ],
    lines: detail.lines,
    assign: {},
    discountAmt: detail.discountAmt,
    ckupYmd: detail.ckupYmd,
    todayYmd,
  });

/** [＋ 반려동물 추가]: 아직 탭에 없는 반려동물 중 첫 번째로 새 탭을 만든다. 더 없으면 null */
export const makeAddedTab = (tabs, pets) => {
  const usedPetSns = new Set(tabs.map((tab) => tab.petSn));
  const pet = pets.find((candidate) => !usedPetSns.has(candidate.petSn));
  return pet ? makeTab({ petSn: pet.petSn }) : null;
};

/** 가계부에 실제로 기록할 금액: 체크돼 있고 1원 이상일 때만, 아니면 null */
export const getLedgerAmount = (tab) => {
  const amount = toAmount(tab.amt);
  return tab.isLedger && amount >= 1 ? amount : null;
};

const validateDrug = (drug) => {
  const errors = {};
  if (drug.drugNm.trim() === '') errors.drugNm = '약품명을 입력해 주세요';
  else if (drug.drugNm.length > MAX_DRUG_NAME_LENGTH)
    errors.drugNm = getTooLongMessage(MAX_DRUG_NAME_LENGTH);
  if (drug.startYmd === '') errors.startYmd = '시작일을 입력해 주세요';
  if (drug.endYmd === '') errors.endYmd = '종료일을 입력해 주세요';
  else if (drug.startYmd !== '' && drug.endYmd < drug.startYmd)
    errors.endYmd = '종료일은 시작일 이후여야 해요';
  if (!/^[1-9]\d*$/.test(drug.perDay))
    errors.perDay = '1일 복용 횟수를 입력해 주세요';
  return errors;
};

/**
 * 저장 가능 여부와 칸별 안내
 * assignableTabIds: 품목을 배정할 수 있는(반려동물을 고른) 탭
 */
export const validateReceipt = ({
  ckupYmd,
  hospNm,
  tabs,
  lines,
  assign,
  isNoZone,
}) => {
  const common = {};
  if (ckupYmd === '') common.ckupYmd = '검진일을 입력해 주세요';
  if (hospNm.trim() === '') common.hospNm = '병원명을 입력해 주세요';
  else if (hospNm.length > MAX_HOSPITAL_NAME_LENGTH)
    common.hospNm = getTooLongMessage(MAX_HOSPITAL_NAME_LENGTH);

  const savedTabs = tabs.filter((tab) => tab.petSn !== SKIP);
  const isAllSkipped = tabs.length > 0 && savedTabs.length === 0;

  const tabErrors = {};
  savedTabs.forEach((tab) => {
    const errors = {};
    if (tab.petSn == null) errors.pet = '반려동물을 선택해 주세요';
    if (tab.ckupTypeCd === '') errors.type = '검진 종류를 선택해 주세요';
    if (tab.ckupCn.length > MAX_CONTENT_LENGTH)
      errors.cn = getTooLongMessage(MAX_CONTENT_LENGTH);
    if (tab.ckupMemoCn.length > MAX_MEMO_LENGTH)
      errors.memo = getTooLongMessage(MAX_MEMO_LENGTH);
    const drugErrors = {};
    tab.drugs.forEach((drug) => {
      const drugError = validateDrug(drug);
      if (Object.keys(drugError).length > 0) drugErrors[drug.rowId] = drugError;
    });
    if (Object.keys(drugErrors).length > 0) errors.drugs = drugErrors;
    if (Object.keys(errors).length > 0) tabErrors[tab.id] = errors;
  });

  const assignableTabIds = new Set(
    tabs
      .filter((tab) => tab.petSn != null && tab.petSn !== SKIP)
      .map((tab) => tab.id),
  );
  const unassignedCount =
    isNoZone && tabs.length >= 2
      ? lines.filter((line) => !assignableTabIds.has(assign[line.lineSn]))
          .length
      : 0;

  return {
    common,
    tabErrors,
    isAllSkipped,
    unassignedCount,
    isValid:
      Object.keys(common).length === 0 &&
      Object.keys(tabErrors).length === 0 &&
      !isAllSkipped &&
      unassignedCount === 0,
  };
};

/** 저장 요청의 항목: "저장 안 함" 탭은 뺀다. 가계부에 안 쓸 탭은 ledgerAmt가 null */
export const buildSaveEntries = (tabs) =>
  tabs
    .filter((tab) => tab.petSn !== SKIP)
    .map((tab) => ({
      tabId: tab.id,
      petSn: tab.petSn,
      ckupTypeCd: tab.ckupTypeCd,
      ckupCn: tab.ckupCn.trim(),
      ckupMemoCn: tab.ckupMemoCn.trim(),
      drugs: tab.drugs.map((drug) => ({
        drugNm: drug.drugNm.trim(),
        startYmd: drug.startYmd,
        endYmd: drug.endYmd,
        perDay: Number(drug.perDay),
        statusCd: drug.statusCd,
      })),
      ledgerAmt: getLedgerAmount(tab),
    }));
