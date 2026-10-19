# SJM 핸드오프

## 지금 하는 것

SCR-MYP-002 반려동물 프로필 목록 — 끝 (2026-10-16 16:51 시작, 2026-10-19 사람 확인 완료)

기획:
- 공통: 반려동물 API(SJM 백엔드)는 가짜 응답으로 먼저 만든다. 가짜는 `features/pet/api.js`. 가짜 목록을 10마리(주양육 9, 공동양육 1)로 늘려 상한·슬라이드를 확인할 수 있게 한다. 응답에 아직 정해지지 않은 키(`vrtyNm` 품종명, `rprsYn` 대표 여부, `petRelCd` 주양육/공동양육, `chrcFaceUrl` 캐릭터 얼굴)를 넣고 백엔드를 만들 때 맞춘다
- FN-MYP-002-01 등록 상한: `pages/mypage/PetListPage.jsx`. 주양육 동물이 10마리면 [＋ 반려동물 등록] 비활성과 "반려동물은 최대 10마리까지 등록할 수 있어요" 안내. 상한 숫자는 `features/pet/petCodes.js`에 둔다. API 없음
  - 명령: `yarn -s lint`, `yarn -s build`
  - 화면: 처음엔 [등록]이 켜져 있고 안내가 없다. 1마리 등록하면 [등록]이 비활성되고 안내가 보인다
- FN-MYP-002-02 반려동물 슬라이드: `features/pet/PetSlide.jsx`(새 파일), `pages/mypage/PetListPage.jsx`. GET /pets(가짜). 캐릭터 얼굴은 LJS 캐릭터 이미지 API가 없어 `chrcFaceUrl`이 비면 종별 기본 얼굴(lucide `Dog`·`Cat` 아이콘)로 그린다. 나이는 `petBrdt`로 계산한다(`features/pet/petFormat.js` 새 파일, 품종명·성별명·털색명 표시 함수도 여기)
  - 화면: 카드 위에 "반려동물 1 / 10". ▶를 누르면 다음 동물과 "2 / 10", 처음·끝에서는 ◀·▶ 비활성. 왼쪽에 얼굴·이름·대표/주양육 배지·품종·나이·성별·체중과 [수정]·[삭제], 오른쪽 2열에 종·성별(중성화)·체중·털색 / 인식 번호·특징·알레르기·기저질환. 알레르기·기저질환이 3개 이상이면 2개와 [외 N개], 누르면 "기저질환 (4)" 제목과 전체 값 레이어가 열리고 ✕·바깥 클릭으로 닫힌다. 값 없는 줄은 안 보인다
- FN-MYP-002-03 인식칩 번호 표시: `features/pet/PetSlide.jsx`
  - 화면: `chipNo`가 없는 동물은 "인식 번호" 줄이 없다
- FN-MYP-002-04 수정: `pages/mypage/PetListPage.jsx`. 기존 `PetFormModal`을 현재 슬라이드의 `petSn`으로 연다
  - 화면: [수정] → 현재 값이 채워진 모달. 저장하면 슬라이드 값이 바뀌고 위치가 유지된다
- FN-MYP-002-05 삭제: `features/pet/PetSlide.jsx`. 공동양육 동물은 [삭제] 대신 [연동 해제]를 보인다. 연동 해제 흐름은 SCR-MYP-006 마일스톤이라 이번에는 버튼만 두고 누르면 "준비 중" 토스트
  - 화면: 공동양육 슬라이드에 "공동양육" 배지와 [연동 해제]가 보이고 [삭제]가 없다
- FN-MYP-002-06 0마리 안내: `features/pet/PetEmpty.jsx`(새 파일), `pages/mypage/PetListPage.jsx`
  - 화면: 가짜 목록에 공동양육 동물이 있어 브라우저로는 0마리가 되지 않는다. 확인하지 못한 조건으로 보고한다
- FN-MYP-002-07 삭제 확인 팝업: `features/pet/PetDeleteDialog.jsx`(새 파일), `features/pet/api.js`(`deletePet` 가짜, DELETE /pets/{petSn}), `features/pet/queries.js`(`useDeletePet`)
  - 화면: [삭제] → "초코를 삭제하시겠습니까?" 팝업. [취소]는 그대로 닫힌다. [삭제]하면 목록에서 빠지고 총마리가 줄며, 위치가 끝을 넘으면 마지막 동물로 간다
- FN-MYP-002-08 공동양육 연동 자동 해제: 서버 처리(SJM 백엔드, 알림은 YAY). 프론트 변경 없음. 삭제 후 `petKeys.all` 무효화만 한다

새 의존성: 없음

## 다음에 할 것

- 털색 신규 6개(강아지 황색·세이블·멀, 고양이 젖소·카오스·포인트)는 백엔드가 코드 번호를 정하면 `features/pet/petCodes.js`의 `COLR`와 `COLR_OPTIONS`에 넣는다. 이름 변경(블랙탄·파티)과 순서는 커밋 08c33cf에 반영됨
- SCR-MYP-010 캐릭터 만들기 1단계는 털색을 읽기 전용으로 보이고 생성 요청에 `colrCd`·`colrDrctInptNm`을 넣는다(FN-MYP-010-08)
- SCR-MYP-006을 만들 때 [연동 해제] 버튼("준비 중" 토스트)을 연결한다
- 등록 상한은 주양육 동물만 센다. 슬라이드 "N / 총마리"는 공동양육을 포함한다(명세대로)

- 로그인(AIC)이 나오면 `/mypage/pets`를 `ProtectedRoute` 아래로 옮긴다
- 품종 마스터 API(KSJ)가 나오면 `getVarieties` 가짜 응답을 실제 요청으로 바꾼다
- 반려동물 API(SJM 백엔드)가 나오면 `features/pet/api.js`의 가짜 응답(`getPets`·`getPet`·`createPet`·`updatePet`)을 실제 요청으로 바꾸고, 체중 기록 키 이름(`lastBdwgRcd`)을 응답에 맞춘다
- 건강 일지(SCR-HLT-002, JAJ) 경로가 생기면 [건강 일지에서 기록하기]를 연결한다
