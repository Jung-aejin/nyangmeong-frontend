# JAJ 핸드오프

## 지금 하는 것

SCR-HLT-011 종합 건강기록 (시작 2026-10-21 15:45) — 상태: 끝남 (승인 2026-10-21 16:05, 검증 통과, 사람 확인 2026-10-21)

기준: 건강기록_기능명세서_v1.1_20261021, 건강기록_화면설계서_v1.1_20261021 (DMS). 디자인: `html/hlt-summary.html`

기능 FN-HLT-011-01~10, 앵커, 추가 요청 7건 구현과 검증 통과. 기능별 내용은 `milestones/JAJ.md`와 기능명세서. `pages/health/HealthSummaryPage.jsx`가 히어로 + 영역을 조립하고 코드는 `features/health/summary/`, 가짜 응답은 `features/health/summaryApi.js`의 `getHealthSummary(petSn)`(다른 화면의 가짜 저장소를 모음), 훅은 `queries.js`의 `useHealthSummary`다. 화면을 열 때마다 다시 읽으므로 다른 화면에서 바꾼 값이 보인다

- 가짜 확인용 쿼리(개발 환경만): `?fakeSummary=0`(모든 영역 0건·알레르기·기저질환 미입력), `?fakeSummary=1`(검사·관찰 1회차만. 반려동물 1마리는 `?fakePets=1`), `?inspection=<검사 항목>`(검사 수치 추이 처음 항목). 검진상세는 `?fakeCheckupDetail=0`
- 시안과 달라진 점: 반려동물 선택 탭은 `PetTabs.jsx` 대신 `summary/SummaryHero.jsx`에 직접 만들었다(진한 초록 히어로 안의 칩). `checkupApi.js`에 검진기록 502·503 신장 수치 가짜 이력을 더했고, `HealthDiaryPage.jsx`에 URL 해시 스크롤을 더했다
- 추가 요청(요청·확인 2026-10-21): 추가-1 타임라인 아이콘 세로 선, 추가-2 타임라인 [전체 보기]를 건강 일지 검진기록으로, 추가-3 타임라인에 반복 예방(시작일 기준), 추가-4 예방·정기검진 카드 [전체 보기] 삭제, 추가-5 히어로 칩·자간·프로필 카드를 시안과 일치, 추가-6 히어로 점 무늬, 추가-7 반려동물 1마리일 때 [반려동물 등록] 칩

새 의존성: 없음

## 다음에 할 것

- 연결 남음(SCR-HLT-011): 반려동물 목록·프로필(품종·성별·생일·알레르기·기저질환 필드 이름 포함) `getPets` (SJM), 캐릭터 이미지 조회 (LJS), 반려동물별 종합 조회 (JAJ 백엔드, `summaryApi.js` 가짜 응답을 실제 호출로 교체). 첨부 칸의 미리보기·다운로드는 가짜에 파일 주소가 없어 안내 토스트만 뜬다
- 결정 필요: 추가-3(타임라인에 반복 예방)과 추가-4(예방·정기검진 [전체 보기] 삭제)는 기능명세서 FN-HLT-011-03·04와 달라졌다. 명세를 고칠지 정한다. 종합 화면에서 링크로 `/health/diary#hlt002-exam`에 가면 위쪽 내용이 늦게 그려져 영역이 상단 112px이 아니라 328px에 놓인다(화면 안에는 보임). `HealthSummaryPage`·`HealthDiaryPage`·`CareCalendarPage`의 `PageFrame`이 거의 같아 한 곳으로 합칠 수 있다
- 알려진 결함(검증 1회차 실패 항목, 코드는 아직 고치지 않음): `features/health/checkup/CheckupInfoCard.jsx`에서 [검진기록 수정] 모달로 저장해도 카드가 인라인 수정 상태로 남고, 이어서 카드의 [저장하기]를 누르면 모달에서 고친 검진 내용이 옛 값으로 돌아간다. 모달 저장 성공 때 조회 상태로 돌리거나 초안을 새 값으로 다시 채우면 된다
- 연결 남음: 검진상세의 검진기록·검사 결과·첨부 자료·처방약·반복 예방 API (JAJ 백엔드, `checkupApi.js`·`diaryApi.js` 가짜 응답을 실제 호출로 교체), 검사결과지 PDF 분석 호출부 (LJS). 007·011 도착 화면은 각 마일스톤에서 만든다
- 영수증 등록 가짜 확인용 쿼리(개발 환경만): `?fakeReceipt=zones`·`nozone`, `?fakeLedgerDup=1`, `?fakeReceiptSave=fail`. 인식 실패·15초 초과는 업로드 파일 이름에 `fail`·`slow`
- 검증 보고의 참고(실패 항목 아님): 약품 행 시작일·종료일은 인식 때 검진일로 고정돼 검진일을 고쳐도 따라 바뀌지 않는다. 저장 실패는 서버가 한 번에 처리한다고 보고 맨 앞에서만 낸다(기획의 반려동물별 되돌리기 `createCheckupsFromReceipt` 대신 `saveReceiptCheckups`). 가계부 함수는 `prepareReceiptSave`·`saveReceiptCheckups` 안에 합쳤다
- 알릴 것(LJS): `routes/domains/devRoutes.js`의 영수증 DEV 화면은 "건강 일지가 영수증 모달을 열면 지움"이라 이 마일스톤이 끝나면 지워도 된다
- 연결 남음: 반려동물 목록·프로필(체중 정상범위·목표 포함) `getPets` (SJM), 캐릭터 이미지 조회 (LJS), 케어 완료의 케어미션·포인트 반영 (SJM), 일정·케어·일상 기록·관찰·검진기록 API `features/health/api.js`·`diaryApi.js` 가짜 응답을 실제 호출로 교체 (JAJ 백엔드)
- 결정 필요: 공용 `ConfirmModal`을 시안 스타일로 맞출지, 우측 아래 플로팅 버튼(시안은 고양이 이미지)을 맞출지(LJS 파일). 앱 전체 본문 줄 높이를 시안 1.6으로 할지(지금은 건강 일지 안에서만 맞춤). 식사량·음수량·산책 그래프의 "최근 14개"를 기록 14건이 걸친 날의 합계로 그렸는데 14일로 바꿀지
- 정리: `features/health/api.js` 주석에 "더보기"라는 옛 표현이 남아 있다(지금은 페이지 나눔). `HealthDiaryPage`의 `PageFrame`이 `CareCalendarPage`와 거의 같아 한 곳으로 합칠 수 있다. 오늘의 기록 아이콘 이름(`restaurant`·`water_drop`·`directions_walk`·`monitor_weight`·`wc`)은 시안에 정해진 것이 없어 내가 골랐다
- 영수증 등록 연결 남음: 영수증 인식 결과 전체(YAY, 지금은 LJS 인식 응답 + `receiptApi.js` `getReceiptDetail` 가짜), 가계부 지출 생성·중복 확인(SJM, `receiptApi.js` 가짜)
- 알릴 것(LJS): 공용 `layouts/UserHeader.jsx`·`NotificationDropdown.jsx`·`ProfileDropdown.jsx`를 시안 기준으로 수정(Material 아이콘, 새 `headerStyles.js`·`assets/user.svg`), `Card`·`buttonStyles`·`SideMenu`·`PetTabs` 줄 높이·색·비활성 스타일 수정, 로컬 Pretendard 글꼴 추가(`assets/fonts/PretendardVariable.woff2` 약 2MB, `index.css` `@font-face`), `eslint.config.js`에 `html` 제외
- 채팅 아이콘의 안 읽은 수 배지는 KSJ 채팅 API 연결 전이라 숨김
