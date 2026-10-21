# JAJ 핸드오프

## 지금 하는 것

SCR-HLT-005 검진상세 (시작 2026-10-21 14:48) — 상태: 끝남 (승인 2026-10-21 14:51, 검증 통과, 사람 확인 2026-10-21)

기준: 건강기록_기능명세서_v1.1_20261021, 건강기록_화면설계서_v1.1_20261021 (DMS). 디자인: `html/hlt-checkup-detail.html`

기능 FN-HLT-005-01~05·11~15 구현과 검증 통과. 기능별 내용은 `milestones/JAJ.md`와 기능명세서. `pages/health/CheckupDetailPage.jsx`가 기본정보 카드 + 탭 4개를 조립하고 코드는 `features/health/checkup/`, 가짜 응답은 `features/health/checkupApi.js`(검진기록 조회·수정은 `diaryApi.js`)에 있다. 처방약·반복 예방은 `api.js`의 가짜 케어 항목과 이어진다

- 가짜 확인용 쿼리(개발 환경만): `?fakeCheckupDetail=0`(검사·첨부·처방약·반복 예방 0건). 검진기록 500에 설계서 목업 값, 501에 처방약·반복 예방 1건씩. PDF 분석 실패는 파일 이름에 `fail`
- 범위 밖: SCR-HLT-007 검사 수치 입력(`/health/checkups/:ckupRcdSn/inspections`), SCR-HLT-011 종합 건강기록(`/health?inspection=<항목>`). 둘 다 도착 화면은 빈 화면

새 의존성: 없음

## 다음에 할 것

- 알려진 결함(검증 1회차 실패 항목, 코드는 아직 고치지 않음): `features/health/checkup/CheckupInfoCard.jsx`에서 [검진기록 수정] 모달로 저장해도 카드가 인라인 수정 상태로 남고, 이어서 카드의 [저장하기]를 누르면 모달에서 고친 검진 내용이 옛 값으로 돌아간다. 모달 저장 성공 때 조회 상태로 돌리거나 초안을 새 값으로 다시 채우면 된다
- 연결 남음: 검진상세의 검진기록·검사 결과·첨부 자료·처방약·반복 예방 API (JAJ 백엔드, `checkupApi.js`·`diaryApi.js` 가짜 응답을 실제 호출로 교체), 검사결과지 PDF 분석 호출부 (LJS). 007·011 도착 화면은 각 마일스톤에서 만든다
- 영수증 등록 가짜 확인용 쿼리(개발 환경만): `?fakeReceipt=zones`·`nozone`, `?fakeLedgerDup=1`, `?fakeReceiptSave=fail`. 인식 실패·15초 초과는 업로드 파일 이름에 `fail`·`slow`
- 검증 보고의 참고(실패 항목 아님): 약품 행 시작일·종료일은 인식 때 검진일로 고정돼 검진일을 고쳐도 따라 바뀌지 않는다. 저장 실패는 서버가 한 번에 처리한다고 보고 맨 앞에서만 낸다(기획의 반려동물별 되돌리기 `createCheckupsFromReceipt` 대신 `saveReceiptCheckups`). 가계부 함수는 `prepareReceiptSave`·`saveReceiptCheckups` 안에 합쳤다
- 알릴 것(LJS): `routes/domains/devRoutes.js`의 영수증 DEV 화면은 "건강 일지가 영수증 모달을 열면 지움"이라 이 마일스톤이 끝나면 지워도 된다
- 연결 남음: 반려동물 목록·프로필(체중 정상범위·목표 포함) `getPets` (SJM), 캐릭터 이미지 조회 (LJS), 케어 완료의 케어미션·포인트 반영 (SJM), 일정·케어·일상 기록·관찰·검진기록 API `features/health/api.js`·`diaryApi.js` 가짜 응답을 실제 호출로 교체 (JAJ 백엔드)
- 사이드 메뉴 "종합 건강기록"(`/health`)은 라우트가 아직 없어 누르면 빈 화면. SCR-HLT-011 작업 때 연결
- 결정 필요: 공용 `ConfirmModal`을 시안 스타일로 맞출지, 우측 아래 플로팅 버튼(시안은 고양이 이미지)을 맞출지(LJS 파일). 앱 전체 본문 줄 높이를 시안 1.6으로 할지(지금은 건강 일지 안에서만 맞춤). 식사량·음수량·산책 그래프의 "최근 14개"를 기록 14건이 걸친 날의 합계로 그렸는데 14일로 바꿀지
- 정리: `features/health/api.js` 주석에 "더보기"라는 옛 표현이 남아 있다(지금은 페이지 나눔). `HealthDiaryPage`의 `PageFrame`이 `CareCalendarPage`와 거의 같아 한 곳으로 합칠 수 있다. 오늘의 기록 아이콘 이름(`restaurant`·`water_drop`·`directions_walk`·`monitor_weight`·`wc`)은 시안에 정해진 것이 없어 내가 골랐다
- 영수증 등록 연결 남음: 영수증 인식 결과 전체(YAY, 지금은 LJS 인식 응답 + `receiptApi.js` `getReceiptDetail` 가짜), 가계부 지출 생성·중복 확인(SJM, `receiptApi.js` 가짜)
- 알릴 것(LJS): 공용 `layouts/UserHeader.jsx`·`NotificationDropdown.jsx`·`ProfileDropdown.jsx`를 시안 기준으로 수정(Material 아이콘, 새 `headerStyles.js`·`assets/user.svg`), `Card`·`buttonStyles`·`SideMenu`·`PetTabs` 줄 높이·색·비활성 스타일 수정, 로컬 Pretendard 글꼴 추가(`assets/fonts/PretendardVariable.woff2` 약 2MB, `index.css` `@font-face`), `eslint.config.js`에 `html` 제외
- 채팅 아이콘의 안 읽은 수 배지는 KSJ 채팅 API 연결 전이라 숨김
