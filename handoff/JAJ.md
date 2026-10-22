# JAJ 핸드오프

## 지금 하는 것

SCR-HLT-007 검사 수치 입력 (시작 2026-10-22 09:03) — 상태: 끝남 (승인 2026-10-22 09:20, 검증 통과 수준 `확인 못 함 있음`·실패 항목 없음, 사람 확인 2026-10-22)

기준: 건강기록_기능명세서_v1.1_20261021, 건강기록_화면설계서_v1.1_20261021 (DMS)

디자인: `html/hlt-lab-input.html` (+ `html/hlt.css`)

질문: html/hlt-lab-input.html을 디자인으로 쓸까요? 아니면 화면설계서 기준으로 갈까요? (추천: 그 파일을 쓴다. 시안 주석의 기준이 v1.0_20261011이라, v1.1과 다른 곳은 명세를 따른다)

결정: html 기준 (`디자인: html/hlt-lab-input.html` 그대로)

진입 경로(이미 있음): URL `/health/checkups/:ckupRcdSn/inspections`(`routes/domains/health/healthRoutes.js`에 지금 `EmptyPage`). 검진상세가 `?mode=pdf`(state `analyzedItems`, `AttachmentTab.jsx`), `?mode=manual`·`?mode=edit&item=<inspSn>`(`BloodResultList.jsx`)으로 이미 보낸다

- 화면 조립: `pages/health/LabInputPage.jsx` 새로 만들고 `healthRoutes.js`의 `EmptyPage`를 바꾼다. 코드는 `features/health/labInput/`. 겉틀은 `CheckupDetailPage.jsx`의 `PageFrame`과 같은 모양으로 둔다. 완료 조건 `명령:` `yarn -s lint`, `yarn -s build`
- FN-HLT-007-04 분석 결과 검수: `labInput/AnalysisReview.jsx`. `?mode=pdf`일 때만 ①②③ 노출. 파일명·인식 건수, 인식 행(검사 종류 "혈액검사"·항목·값·단위), 값 클릭 → 인라인 수정(저장 전 확정 안 됨), 인식 실패 행은 빈 값으로 직접 입력, 같은 검진기록에 이미 있는 항목은 "이미 등록됨 · 저장 제외", 하단 AI 주의 문구 상시. API: PDF 분석 (LJS, 가짜 `checkupApi.js` `analyzeLabPdf`). 가짜 응답에 인식 실패 1건·이미 등록 1건(CREA)·혈액검사 아님 1건을 더한다. `화면:` 첨부 자료 탭 [PDF 분석] → 인식 행이 채워진 채 열리고 CREA 행에 "이미 등록됨"이 붙는다 / 실패 행 값이 비어 있고 입력할 수 있다
- FN-HLT-007-05 검사 종류 표시: 혈액검사 아닌 인식 행은 "혈액검사 항목이 아니라 저장에서 제외" 표시. `화면:` 그 행이 저장 뒤 검사 결과에 들어가지 않는다
- FN-HLT-007-06 다시 분석 · 직접 입력하기: [다시 분석하기]는 같은 첨부로 `analyzeLabPdf` 재호출(진행 중 버튼 비활성). 첨부 번호가 필요해 `AttachmentTab.jsx`가 `?mode=pdf&atch=<atchSn>`으로 보내게 고친다. 새로고침 등으로 state가 없으면 그 첨부로 다시 분석한다. [직접 입력하기]는 분석 결과를 버리고 `?mode=manual`로 바꾼다. `화면:` 다시 분석 중 버튼이 막히고 결과가 다시 채워진다 / 직접 입력하기 → ①②③이 사라지고 빈 폼
- FN-HLT-007-01 검사 종류: "혈액검사" 고정 비활성 칸. `화면:` 바꿀 수 없다
- FN-HLT-007-02 검사 항목: `labInput/LabItemForm.jsx` + `labInput/bloodItems.js`(12종·4태그·한글 이름, 태그 코드는 `checkupTypes.js` `FUNCTION_TAGS`). 드롭다운은 태그 묶음 + 약어 + 한글 이름, 맨 아래 직접입력(태그 없음). 항목·결과값·단위 필수, 참고범위 최소·최대는 둘 다 비우거나 둘 다 입력, 수정 진입 시 항목 비활성. 이미 있는 항목을 고르면 "이미 등록된 항목입니다: CREA" 안내. `화면:` 참고범위 한쪽만 넣으면 [저장하기]가 막힌다 / 수정 진입 시 항목이 비활성이고 기존 값이 채워진다
- FN-HLT-007-03 취소 · 저장하기: [취소] → 검진상세 검사 결과 탭(입력 폐기). [저장하기] → 검사 결과 생성·수정 후 검진상세로 이동하고 `checkupKeys` 무효화. API: 검사 결과 생성·수정 (JAJ 백엔드, 가짜 `checkupApi.js`에 `createInspections`(여러 건)·`updateInspection` 추가, `queries.js`에 훅 추가). 종합 건강기록 검사 수치 추이는 같은 가짜 저장소를 읽어 따로 할 일 없다. 메모 필드는 지금 가짜 데이터에 없어 `memoCn`으로 더한다. `화면:` 수동 추가로 저장하면 검사 결과 탭에 새 행이 생긴다 / 수정 저장하면 새 행 없이 그 행이 바뀐다 / PDF 저장 시 제외 행은 들어가지 않는다

다음에 할 것에 남길 연결: PDF 분석 호출부 (LJS), 검사 결과 생성·수정 API (JAJ 백엔드)

### 추가 요청

| 번호 | 바꿀 파일 | 완료 조건 | 요청 |
| --- | --- | --- | --- |
| 추가-1 | `features/health/checkup/BloodResultList.jsx` | 명령: `yarn -s lint`, `yarn -s build` / 화면: 검진상세 검사 결과 탭의 혈액검사 행을 항목명이 아닌 곳(값·참고범위·빈 곳)을 눌러도 검사 수치 입력 수정 화면(`?mode=edit&item=<번호>`)으로 간다. 체크박스는 그대로 선택만 된다 | 요청 2026-10-22 "03 해당 라인 어느 곳을 눌러도 수정하는 곳으로 갔으면 좋겠어, 지금은 제목만 눌러야 해서 헷갈려" |

새 의존성: 없음

## 다음에 할 것

- 결정 필요(SCR-HLT-007 추가-1): 검사 결과 행을 어디나 누르면 수정 화면으로 가게 바꾸면서(`BloodResultList.jsx`) 검진상세에서 종합 건강기록 검사 수치 추이(`/health?inspection=<항목>`)로 가는 길이 없어졌다. 기능명세서 FN-HLT-005-02를 고칠지, 추이로 가는 다른 길을 둘지 정한다
- SCR-HLT-007 참고(실패 아님): [직접 입력하기] 뒤에도 주소가 `?mode=pdf&atch=<번호>`에 남아 새로고침하면 분석이 다시 뜬다(기획은 `?mode=manual`로 바꾸는 것). `labInput/ItemSelect.jsx` 목록에서 묶음 행과 항목 행 key가 `GLU`로 겹쳐 콘솔 경고. PDF 진입 때 아래 입력칸은 선택(비우면 분석 행만 저장)으로 구현했다
- 연결 남음(SCR-HLT-007): 검사결과지 PDF 분석 호출부 (LJS, `checkupApi.js` `analyzeLabPdf` 가짜, 응답의 `bloodYn`은 가정), 검사 결과 생성·수정 API (JAJ 백엔드, `createInspections`·`updateInspection` 가짜)

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
