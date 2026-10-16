# SJM 핸드오프

## 지금 하는 것

끝남: SCR-MYP-003 반려동물 등록/수정 모달(`features/pet/PetFormModal.jsx`). 반려동물·품종 API는 가짜 응답이고, 임시 페이지 `/mypage/pets`에서 연다. 2026-10-16 `/verify` 통과, 사람 확인 완료.

## 다음에 할 것

- 로그인(AIC)이 나오면 `/mypage/pets`를 `ProtectedRoute` 아래로 옮긴다
- 품종 마스터 API(KSJ)가 나오면 `getVarieties` 가짜 응답을 실제 요청으로 바꾼다
- 반려동물 API(SJM 백엔드)가 나오면 `features/pet/api.js`의 가짜 응답(`getPets`·`getPet`·`createPet`·`updatePet`)을 실제 요청으로 바꾸고, 체중 기록 키 이름(`lastBdwgRcd`)을 응답에 맞춘다
- 건강 일지(SCR-HLT-002, JAJ) 경로가 생기면 [건강 일지에서 기록하기]를 연결한다
- 다음 마일스톤 SCR-MYP-002 반려동물 프로필 목록: 임시 `PetListPage`를 슬라이드 화면으로 채운다
