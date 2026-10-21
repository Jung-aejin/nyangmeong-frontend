/**
 * [매칭 실패 폴백]
 * - 실패 안내 문구와 연속 실패 횟수
 * - 횟수는 브라우저 sessionStorage에 대화별로 보관 -> 새로고침 유지, 창을 닫으면 초기화
 */

/** 실패 안내 문구 */
export const FALLBACK_MESSAGE =
  '질문을 이해하지 못했어요. 다시 입력하거나 아래에서 선택해 주세요.';

/** 고객센터 안내를 보이는 연속 실패 횟수 */
export const FAQ_FAIL_COUNT = 2;

const storageKey = (aiCnvrsRoomSn) => `aiFallbackCount:${aiCnvrsRoomSn}`;

/** 연속 실패 횟수 조회 */
export const getFallbackCount = (aiCnvrsRoomSn) => {
  try {
    return Number(sessionStorage.getItem(storageKey(aiCnvrsRoomSn))) || 0;
  } catch {
    return 0;
  }
};

/** 연속 실패 횟수 증가 */
export const increaseFallbackCount = (aiCnvrsRoomSn) => {
  const next = getFallbackCount(aiCnvrsRoomSn) + 1;
  try {
    sessionStorage.setItem(storageKey(aiCnvrsRoomSn), String(next));
  } catch {
    /** 저장소 사용 불가 시 화면 상태로만 집계 */
  }
  return next;
};

/** 연속 실패 횟수 초기화 */
export const resetFallbackCount = (aiCnvrsRoomSn) => {
  try {
    sessionStorage.removeItem(storageKey(aiCnvrsRoomSn));
  } catch {
    /** 저장소 사용 불가 시 화면 상태로만 집계 */
  }
  return 0;
};
