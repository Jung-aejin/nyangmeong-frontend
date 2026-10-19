import {
  COLR_DRCT_INPT,
  COLR_OPTIONS,
  PET_GNDR_OPTIONS,
  PET_SE_OPTIONS,
} from './petCodes';

const findName = (options, code) =>
  options?.find((option) => option.code === code)?.name ?? '';

// 만 나이. 1살이 안 되면 개월 수로 보인다
export const formatAge = (petBrdt) => {
  const birth = new Date(petBrdt);
  const today = new Date();
  let months =
    (today.getFullYear() - birth.getFullYear()) * 12 +
    today.getMonth() -
    birth.getMonth();
  if (today.getDate() < birth.getDate()) months -= 1;
  if (months < 12) return `${Math.max(months, 0)}개월`;
  return `${Math.floor(months / 12)}살`;
};

export const getPetSeName = (pet) => findName(PET_SE_OPTIONS, pet.petSeCd);

export const getVrtyName = (pet) => pet.vrtyNm ?? pet.vrtyDrctInptNm ?? '';

export const getGndrName = (pet) => findName(PET_GNDR_OPTIONS, pet.petGndrCd);

export const getColrName = (pet) =>
  pet.colrCd === COLR_DRCT_INPT
    ? (pet.colrDrctInptNm ?? '')
    : findName(COLR_OPTIONS[pet.petSeCd], pet.colrCd);

export const formatWeight = (kg) => `${kg}kg`;

// "새우,닭고기" → ['새우', '닭고기']
export const splitList = (value) => (value ? value.split(',') : []);
