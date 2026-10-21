// import.meta.env는 이 파일에서만 읽는다. API 주소는 환경변수로 두지 않는다
export const IS_DEV = import.meta.env.DEV;

// 카카오 JavaScript 키. 등록한 도메인에서만 동작하는 공개용 키라 VITE_로 둘 수 있다
export const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;
