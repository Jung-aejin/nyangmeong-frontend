import {
  COLR_DRCT_INPT,
  COLR_OPTIONS,
  PET_GNDR_OPTIONS,
  PET_SE_OPTIONS,
} from './petCodes';

const findName = (options, code) =>
  options?.find((option) => option.code === code)?.name ?? '';

export const getPetSeName = (pet) => findName(PET_SE_OPTIONS, pet.petSeCd);

export const getVrtyName = (pet) => pet.vrtyNm ?? pet.vrtyDrctInptNm ?? '';

// "골든리트리버(강아지)". 품종 이름이 없으면 종류만
export const formatSpecies = (pet) => {
  const vrtyName = getVrtyName(pet);
  return vrtyName ? `${vrtyName}(${getPetSeName(pet)})` : getPetSeName(pet);
};

export const getGndrName = (pet) => findName(PET_GNDR_OPTIONS, pet.petGndrCd);

export const getColrName = (pet) =>
  pet.colrCd === COLR_DRCT_INPT
    ? (pet.colrDrctInptNm ?? '')
    : findName(COLR_OPTIONS[pet.petSeCd], pet.colrCd);

export const formatWeight = (kg) => `${kg}kg`;

// "새우,닭고기" → ['새우', '닭고기']
export const splitList = (value) => (value ? value.split(',') : []);

// "3살 2개월". 생일이 없으면 빈 문자열
export const formatAge = (petBrdt, today = new Date()) => {
  if (!petBrdt) return '';
  const birth = new Date(petBrdt);
  let months =
    (today.getFullYear() - birth.getFullYear()) * 12 +
    today.getMonth() -
    birth.getMonth();
  if (today.getDate() < birth.getDate()) months -= 1;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0) return `${rest}개월`;
  return rest === 0 ? `${years}살` : `${years}살 ${rest}개월`;
};
