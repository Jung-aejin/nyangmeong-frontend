/** 포인트 표기: 1,234P / 부호가 있으면 +295P·−1,300P */
export const formatPoint = (amt) => `${Math.abs(amt).toLocaleString()}P`;

export const formatSignedPoint = (amt) =>
  `${amt < 0 ? '−' : '+'}${formatPoint(amt)}`;

/** 완료 수 / 전체 수 → 정수 퍼센트 */
export const getPercent = (done, total) =>
  total === 0 ? 0 : Math.round((done / total) * 100);

export const sumPoint = (missions) =>
  missions.reduce((sum, mission) => sum + mission.msnPnt, 0);
