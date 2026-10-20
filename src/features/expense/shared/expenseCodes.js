/** 공통코드 값: 백엔드 db/..._insert_com_cd_*.sql 과 일치 */

/** MYPG05 가계부카테고리 */
export const EXPND_CLSF_LIST = [
  {
    code: 'MYPC0012',
    name: '병원',
    badge: 'bg-tone-blue-bg text-tone-blue-fg',
    color: 'var(--color-tone-blue-fg)',
  },
  {
    code: 'MYPC0013',
    name: '사료',
    badge: 'bg-tone-green-bg text-tone-green-fg',
    color: 'var(--color-tone-green-fg)',
  },
  {
    code: 'MYPC0014',
    name: '간식',
    badge: 'bg-tone-rose-bg text-tone-rose-fg',
    color: 'var(--color-tone-rose-fg)',
  },
  {
    code: 'MYPC0015',
    name: '용품',
    badge: 'bg-tone-violet-bg text-tone-violet-fg',
    color: 'var(--color-tone-violet-fg)',
  },
  {
    code: 'MYPC0016',
    name: '미용',
    badge: 'bg-tone-amber-bg text-tone-amber-fg',
    color: 'var(--color-tone-amber-fg)',
  },
  {
    code: 'MYPC0017',
    name: '돌봄',
    badge: 'bg-brand-50 text-brand-600',
    color: 'var(--color-brand-500)',
  },
  {
    code: 'MYPC0018',
    name: '기타',
    badge: 'bg-tone-gray-bg text-tone-gray-fg',
    color: 'var(--color-line-strong)',
  },
];

/** 병원 카테고리 공용 등록 불가 */
export const HOSPITAL_CLSF_CD = EXPND_CLSF_LIST[0].code;

export const EXPND_CLSF = Object.fromEntries(
  EXPND_CLSF_LIST.map((clsf) => [clsf.code, clsf]),
);

/** 지출에 남은 반려동물 상태 */
export const PET_STTS = {
  ACTIVE: 'ACTIVE',
  UNLINKED: 'UNLINKED',
  DELETED: 'DELETED',
};

export const FILTER_ALL = 'ALL';
export const FILTER_SHARED = 'SHARED';

export const SORT = {
  LATEST: 'LATEST',
  AMOUNT: 'AMOUNT',
};

export const RANGE_MODE = {
  MONTH: 'MONTH',
  PERIOD: 'PERIOD',
  ALL: 'ALL',
};

export const PAGE_SIZE = 20;
