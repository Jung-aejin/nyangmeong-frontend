/** 뉴스 카테고리 공통코드 값: 화면 이름 ↔ newsClsfCd */
export const NEWS_CATEGORIES = [
  { name: '건강', code: 'CMUC0018' },
  { name: '생활', code: 'CMUC0019' },
  { name: '정책', code: 'CMUC0020' },
  { name: '여행', code: 'CMUC0021' },
];

/** 공통코드 그룹 CMUG07(뉴스출처) 값: newsSrcCd */
export const NEWS_SRC_PRESS = 'CMUC0022';
export const NEWS_SRC_ADMIN = 'CMUC0023';

export const getCategoryName = (code) =>
  NEWS_CATEGORIES.find((category) => category.code === code)?.name;

export const getCategoryCode = (name) =>
  NEWS_CATEGORIES.find((category) => category.name === name)?.code;
