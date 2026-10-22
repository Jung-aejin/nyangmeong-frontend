/** 행을 저장에서 빼는 이유: 'registered' 이미 등록됨, 'nonBlood' 혈액검사 아님, 없으면 null */
export const getExcludeReason = (row, registeredNames) => {
  if (!row.isBlood) return 'nonBlood';
  if (registeredNames.has(row.inspItmNm)) return 'registered';
  return null;
};
