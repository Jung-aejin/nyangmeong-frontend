// 반려동물 목록 API(SJM)가 생기기 전까지 쓰는 가짜 응답이다. 연결할 때는 페이지에서 features/pet의 훅으로 바꾼다
// features/ai가 features/pet을 import 할 수 없어서 페이지가 props로 넘긴다. rprsPetYn이 'Y'인 반려동물이 대표다
export const fakePets = [
  { petSn: 1, petNm: '초코', rprsPetYn: 'Y' },
  { petSn: 2, petNm: '뭉치', rprsPetYn: 'N' },
];
