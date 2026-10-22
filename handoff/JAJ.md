# JAJ 핸드오프

## 지금 하는 것

SCR-HLT-002 건강 일지 다시 열기 (시작 2026-10-22) — 상태: 끝남 (승인 2026-10-22 12:30, 검증 통과 `/verify` 2026-10-22, 사람 확인 2026-10-22). 추가-14·15·16(칩 묶음 바)은 서로 되돌려 변화가 없어 표에서 뺐다

기준: 건강기록_기능명세서_v1.1_20261021, 건강기록_화면설계서_v1.1_20261021 (DMS). 002 절은 v1.0_20261018과 견줘 FN-HLT-002-05·09·10·12·13·15와 공통 정책 2줄(상세 칸 배치, 그래프 모양)이 바뀌었다. 모두 "10-21 퍼블리싱 반영"이다. 코드를 대조해 보니 바뀐 내용이 이미 다 들어가 있다. 이번 일은 v1.1 기준 화면 확인이 중심이고, 어긋난 곳만 고친다

디자인: `html/hlt-diary.html`

같은 화면 ID의 "건강 일지 · 영수증 등록" 절(FN-HLT-002-34~46)은 v1.1에서 바뀐 것이 없어 이번에 열지 않는다

- FN-HLT-002-10 그래프 원칙: `features/health/diary/recordUtils.js`(이미 반영: 체중은 기록마다 1점, 식사량·음수량·산책은 최근 기록 14개가 걸친 날의 하루 합계, 가장 이른 날도 그날 전부). 어긋나면 고친다. `명령:` `yarn -s lint`, `yarn -s build` / `화면:` 식사량 그래프의 오늘 점 값이 최근 건강기록 표 오늘 행의 식사량 합계와 같다
- FN-HLT-002-09 그래프 모양: `LineChart.jsx`·`BarChart.jsx`(이미 반영). `화면:` 선그래프는 곡선 + 연한 그라데이션, 정상범위 점선과 오른쪽 둥근 라벨, 목표 점선, 최근 값 흰 말풍선 / 산책 막대는 연한 색에 마지막 막대만 진하게, 평균 점선
- FN-HLT-002-12 오늘의 기록: `TodayRecordCard.jsx`(이미 반영). `화면:` 줄마다 종류 아이콘(체중 monitor_weight · 식사량 restaurant · 음수량 water_drop · 배변상태 wc · 산책 directions_walk), 식사량·음수량·산책은 "합계" 글자가 값 위에 있고 오른쪽 끝이 줄마다 맞음, 개별 값 6건 이상이어도 5건까지만 나오고 [전체 보기]가 없다
- FN-HLT-002-13 최근 건강기록: `RecentRecordTable.jsx`(이미 반영). `화면:` 날짜 행 어디를 눌러도 펼침·접힘, [∨]는 남아 있다 / 펼친 상세가 1280px 5칸·900px 3칸·600px 2칸, 순서 체중·식사량·음수량·산책·배변상태
- FN-HLT-002-15 관찰 항목 목록: `ObservationCard.jsx`. 지금 카드 머리 [관찰 항목 등록]은 명세대로 채운 주 버튼(`BTN_PRIMARY`, 높이 32px)인데 `html/hlt-diary.html`은 `btn-soft btn-sm`이다(아래 질문). `화면:` 답에 따른 모양, 빈 상태 버튼은 두 기준 모두 `btn-secondary`로 같다
- FN-HLT-002-05 검진기록 리스트: `CheckupListCard.jsx`(이미 반영: 10건 페이지, 1페이지면 `Pagination`이 숨음, 연도·칩 변경 때 1페이지, 반려동물 변경은 `key`로 초기화). `화면:` 가짜 기록이 10건을 넘는 반려동물에서 페이지 번호가 나오고 2페이지로 간 뒤 칩을 바꾸면 1페이지로 돌아간다. 10건 이하면 페이지 번호가 없다. 가짜 기록이 10건을 넘지 않으면 이유와 함께 "확인 못 함"으로 보고한다(가짜 데이터는 늘리지 않는다)
- 공통 `명령:` `yarn -s lint`, `yarn -s build`

질문: [관찰 항목 등록] 카드 머리 버튼을 명세 v1.1(채운 주 버튼)대로 둘까요, `html/hlt-diary.html`(btn-soft)에 맞출까요? (추천: 명세 v1.1. 명세가 같은 날 퍼블리싱을 반영했다고 적었고 지금 코드도 그렇다. 시안을 고칠지는 퍼블리싱 담당에게 알린다)
결정: html/hlt-diary.html에 맞춘다(btn-soft). 명세 v1.1의 "채운 주 버튼"과 다르다

### 추가 요청

| 번호 | 바꿀 파일 | 완료 조건 | 요청 |
| --- | --- | --- | --- |
| 추가-1 | `features/health/diary/DailyTrendCard.jsx` | 명령: `yarn -s lint`, `yarn -s build` / 화면: 건강기록 변화 카드 제목 옆 "최근 14개 기록" 글자가 지금보다 작다 | 요청 2026-10-22 "최근 건강기록변화에서 제목 옆 최근 14개 기록 글자는 작게 표시해줘". 시안(`.card-title small`: 본문 크기)과 다르다 |
| 추가-3 | `features/health/diary/RecentRecordTable.jsx` | 명령: `yarn -s lint`, `yarn -s build` / 화면: 최근 건강기록 조회기간에 "최근 3일"이 있다(3·7·14일, 처음은 7일) | 요청 2026-10-22 "최근 건강기록 필터에 3일 추가해주고". 명세 FN-HLT-002-13의 조회기간 선택지에 3일이 없다면 명세와 다르다 |
| 추가-4 | `features/health/diary/RecentRecordTable.jsx` | 명령: `yarn -s lint`, `yarn -s build` / 화면: 날짜 행을 누르면 펼쳐지지 않고 그날 상세 기록 모달이 열린다. 모달 안에서 기록 수정·삭제가 된다. 표에는 펼침 상세가 없다 | 요청 2026-10-22 "상세기록은 모달로 변경해줘". 명세 FN-HLT-002-13(날짜 행 클릭 펼침, 상세 5·3·2칸 배치)과 다르다. 공용 `Modal` 폭이 440px이라 종류별 칸은 세로로 쌓는다 |
| 추가-5 | `pages/health/HealthDiaryPage.jsx`, `features/health/diary/DiaryTabs.jsx`(새 파일), `AnchorBar.jsx`(지움) | 명령: `yarn -s lint`, `yarn -s build` / 화면: 반려동물 탭 아래 앵커 3개가 탭으로 바뀌어 선택한 묶음만 보인다(건강기록 변화 = 그래프·오늘의 기록·최근 건강기록, 지속 관찰, 검진기록). 처음은 건강기록 변화, `/health/diary#hlt002-obs`·`#hlt002-exam`으로 오면 그 탭 | 요청 2026-10-22 "앵커를 탭으로 바꿔줘". 시안·명세의 페이지 내 이동 앵커(스크롤)와 다르다. 종합 건강기록 추가-8과 같은 방식 |
| 추가-6 | `features/health/diary/RecentRecordTable.jsx`, `components/Modal.jsx`(선택 속성 `isWide`) | 명령: `yarn -s lint`, `yarn -s build` / 화면: 상세 기록 모달이 시안의 표 형태(종류 5칸 한 줄, 칸 제목 가운데·아래 선)이고 칸 사이에 선이 있어 종류가 구별된다. 다른 모달은 그대로 | 요청 2026-10-22 "모달 기존 화면설계서에서 사용하던 표 형태를 그대로 차용하면서 각 내용이 구별되게 선을 넣어줘". 추가-4에서 세로로 쌓던 것을 되돌려 5칸으로 두고, 그 폭을 위해 공용 `Modal`에 넓은 폭 속성을 더한다 |
| 추가-7 | `features/health/diary/RecentRecordTable.jsx` | 명령: `yarn -s lint`, `yarn -s build` / 화면: 상세 기록 모달의 각 칸에서 기록 줄이 한 줄 걸러 옅은 바탕(줄무늬)이고 줄 사이 선이 있다. 기록 없는 칸은 "-"와 선으로 구별된다 | 요청 2026-10-22 "모달 안에 있는 표를 줄무늬형 으로 해줘 값이 없어서 선으로 구별해주고". 시안(`.dt-line`: 줄무늬 없음)과 다르다 |
| 추가-8 | `features/health/diary/RecentRecordTable.jsx` | 명령: `yarn -s lint`, `yarn -s build` / 화면: 최근 건강기록 조회기간 처음 값이 "최근 3일" | 요청 2026-10-22 "최근건강기록 기본 필터는 3일이야" |
| 추가-9 | `features/health/diary/RecentRecordTable.jsx` | 명령: `yarn -s lint`, `yarn -s build` / 화면: 상세 기록 모달이 하나의 표다 — 머리줄 밑줄·줄 구분선·줄무늬가 열마다 끊기지 않고 표 전체 폭으로 이어지고, 같은 순번의 기록이 같은 줄에 놓이며, "총 ○회"(식사량 등은 "총 합계 · ○회")는 맨 아래 같은 줄에 모여 있다 | 요청 2026-10-22 "표는 열마다 따로 그은 머리줄 밑줄·줄 구분선·줄무늬를 표 전체 폭으로 이어 하나의 표로 만들고, \"총 ○회\"는 맨 아래 같은 줄에 모아". 추가-6·7의 칸 단위 상자를 대체한다. 시안(`.dt-grid` 칸별 세로 쌓기)과 다르다 |
| 추가-10 | `features/health/diary/RecentRecordTable.jsx` | 명령: `yarn -s lint`, `yarn -s build` / 화면: 상세 기록 모달 표의 머리줄(체중·식사량…)이 최근 건강기록 표 머리줄과 같은 색(회색 바탕 `bg-surface-3`, 글자 `text-ink-2`)이다 | 요청 2026-10-22 "모달 표 제목에 색상넣어 최근 건강기록 제목과 동일한 색상으로" (최근 건강기록 표의 머리줄 색으로 해석) |
| 추가-11 | `features/health/diary/RecentRecordTable.jsx` | 명령: `yarn -s lint`, `yarn -s build` / 화면: 상세 기록 모달 맨 아래 "총 ○회" 줄 글자가 굵다 | 요청 2026-10-22 "모달 토탈값 글자 굴기 넣어줘"(굵기로 해석) |
| 추가-12 | `features/health/diary/ObservationCard.jsx` | 명령: `yarn -s lint`, `yarn -s build` / 화면: 지속 관찰 카드 머리 [관찰 항목 등록]이 [오늘 기록추가]·[검진기록 등록]과 같은 채운 주 버튼 색이다(높이 32px) | 요청 2026-10-22 "지속관찰 항목 등록 버튼 다른 곳과 동일한 버튼색상적용해줘". 앞서 `결정: html에 맞춘다(btn-soft)`를 사람이 되돌린 것이고, 명세 v1.1(채운 주 버튼)과는 같아진다 |
| 추가-13 | `features/health/checkup/BloodResultList.jsx`, `features/health/checkup/BloodResultForm.jsx`(새 파일) | 명령: `yarn -s lint`, `yarn -s build` / 화면: 검진상세 검사 결과 탭(혈액검사)에서 [검사 수치 추가]를 누르면 다른 페이지로 가지 않고 처방약·반복 예방처럼 버튼 자리에 입력 영역이 아래로 열린다. 항목·결과값·단위·참고범위·메모를 넣고 [저장하기]하면 목록에 행이 늘고 영역이 닫히며, [취소]는 닫는다. 행을 눌러 고치기와 첨부의 PDF 분석은 그대로 검사 수치 입력 화면으로 간다 | 요청 2026-10-22 "검사수치 기록추가도 반복예방이나 처방약처럼 아래에 열리는 구조로 만들어줘". 화면 SCR-HLT-005(검진상세) 일이다. 명세 FN-HLT-005-02·SCR-HLT-007 직접 입력 화면(별도 페이지)과 다르다 |
| 추가-2 | `features/health/diary/TodayRecordCard.jsx` | 명령: `yarn -s lint`, `yarn -s build` / 화면: 오늘의 기록 카드 제목 옆 날짜 글자가 지금보다 작다(추가-1과 같은 14px) | 요청 2026-10-22 "오늘의 기록 제목 옆의 날짜도 작게해". 시안(`.card-title small`: 본문 크기)과 다르다 |

새 의존성: 없음

## 다음에 할 것

- 결정 필요(SCR-HLT-002 추가 요청): 명세 v1.1·시안과 달라졌다. 명세 FN-HLT-002-13(날짜 행 클릭 펼침, 5·3·2칸 → 행 클릭 시 상세 모달 하나의 표, 조회기간 3·7·14일 기본 3일), 앵커 → 탭(추가-5), 제목 옆 글자 14px(추가-1·2), [관찰 항목 등록] 채운 주 버튼(추가-12, 시안은 `btn-soft`)을 고칠지 정한다. 시안은 퍼블리싱 담당에게 알린다. 추가-13(검사 수치 추가가 아래에 열림)은 검진상세 SCR-HLT-005·검사 수치 입력 SCR-HLT-007 명세와 다르다
- 알릴 것(LJS): 공용 `components/Modal.jsx`에 선택 속성 `isWide`(960px)를 더했다. 상세 기록 모달만 쓴다. 참고: 건강 일지 탭은 처음 열 때만 주소 `#`를 읽는다. `BloodResultForm.jsx`의 입력 검사가 `labInput/LabInput.jsx`와 거의 같아 한 곳으로 합칠 수 있다

- 결정 필요(SCR-HLT-011 추가 요청): 아래 요청이 명세·시안과 달라졌다. 명세 FN-HLT-011-05(알레르기·기저질환 링크 없음)·011-07(처음 항목은 첫 번째)·011-09(첨부 [전체 보기], 접기 없음), 011 처리 조건(앵커, 탭 아님), 시안 "현재 처방" 한 줄을 고칠지 정한다. 건강 일지·검진상세 등 다른 화면으로 옮길 때 맨 위로 스크롤하는 처리가 앱에 없어 [수정하러 가기] 뒤 반려동물 관리가 스크롤된 채 열린다
- 연결 남음(SCR-HLT-011 추가-1): 건강기록 `getPets`와 반려동물 도메인 `getPets`를 같은 반려동물 목록으로 쓰면 [수정하러 가기]가 같은 이름의 슬라이드로 열린다(지금 가짜는 petSn이 서로 다름, SJM). 처방약 첫 행 아이콘은 처방약에 종류 구분이 없어 시안(`monitor_heart`)과 다름
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
