# JAJ 핸드오프

## 지금 하는 것

SCR-HLT-011 종합 건강기록 다시 열기 (시작 2026-10-22 09:38) — 상태: 끝남 (승인 2026-10-22 11:40, 검증 12회차 통과 수준 `확인 못 함 있음`·실패 항목 없음, 사람 확인 2026-10-22)

기준: 건강기록_기능명세서_v1.1_20261021, 건강기록_화면설계서_v1.1_20261021 (DMS). 011 절은 v1.0_20261018과 같다(diff 없음). 이번 일은 명세 변경이 아니라 반려동물 도메인(SJM)과 필드 이름·표기 함수를 맞추는 것이다

디자인: `html/hlt-summary.html` (화면 모양은 바꾸지 않는다)

결정(2026-10-22, 사람, SJM과 합의): 품종·나이·성별 표기 함수와 코드 표는 `utils/`로 올려 같이 쓴다. 기준은 반려동물 파일이다. 건강기록은 반려동물 기준에 맞춘다. 건강 일지·케어 캘린더가 쓰는 건강기록 `getPets`와 알레르기·기저질환·몸무게 필드(`allrgCn`·`undrlDiseCn`·`wghtVal`)는 이번에 바꾸지 않는다

- 공용으로 올리기: `features/pet/list/petFormat.js` → `src/utils/petFormat.js`, `features/pet/shared/petCodes.js` → `src/utils/petCodes.js`. 내용은 그대로 옮기고(`git mv`), `petFormat.js` 안의 `../shared/petCodes` import만 `./petCodes`로 바뀐다. import 하는 파일은 경로만 `@/utils/petFormat`·`@/utils/petCodes`로 고친다: `features/pet/api.js`, `invite/InvitationAccept.jsx`, `list/FamilySection.jsx`·`InviteModal.jsx`·`PetFormModal.jsx`·`PetSlide.jsx`, `PetProfileCard.jsx`, `pages/main/MainPage.jsx`, `pages/mypage/PetListPage.jsx`, 그 밖에 grep으로 찾은 것 전부. `shared/` 폴더가 비면 지운다. 완료 조건 `명령:` `yarn -s lint`, `yarn -s build`, `grep -rn "pet/shared/petCodes\|list/petFormat" src`가 비어 있다
- FN-HLT-011-02 요약 바: `summaryApi.js` `fakeProfiles`의 `brdNm`→`vrtyNm`, `birthYmd`→`petBrdt`, `sexNm`(암컷/수컷 글자)→`petGndrCd`(`PETC0004`=암컷, `PETC0003`=수컷)로 바꾼다. 값은 그대로(1=코리안숏헤어·암컷, 2=러시안블루·수컷, 3=말티즈·수컷). `SummaryHero.jsx`는 `getVrtyName(profile)`·`formatAge(profile.petBrdt, new Date(summary.baseYmd))`·`getGndrName(profile)`을 쓴다. `summaryUtils.js`의 `formatAge`는 지우고 안 쓰게 된 import(`getYear` 등)를 정리한다. `화면:` 종합 건강기록 요약 바가 바꾸기 전과 같은 글자로 나온다(나비 "코리안숏헤어 · N살 N개월 · 암컷", 탭을 바꿔도 품종·성별이 맞다)
- 다른 화면 확인 `화면:` 마이페이지 반려동물 관리(`/mypage/pets` 쯤, `routes/paths.js`로 확인), 초대 수락(`/mypage/invitations/<토큰>`), 메인, 종합 건강기록이 옮기기 전과 같이 뜬다. 콘솔에 import 오류 없음. 초대 수락은 pet 가짜 API의 토큰으로 연다

### 추가 요청

| 번호 | 바꿀 파일 | 완료 조건 | 요청 |
| --- | --- | --- | --- |
| 추가-1 | `features/health/summary/ConditionCard.jsx`, `SummaryParts.jsx`(MoreLink state), `pages/health/HealthSummaryPage.jsx` | 명령: `yarn -s lint`, `yarn -s build` / 화면: 알레르기 · 기저질환 카드의 [수정하러 가기]가 마이페이지 반려동물 관리로 간다 | 요청 2026-10-22 "알레르기와 기저질환 세션에 그 정보를 입력하는 마이페이지 화면으로 넘기는 버튼 추가" |
| 추가-2 | `features/health/summary/ConditionCard.jsx` | 명령: `yarn -s lint`, `yarn -s build` / 화면: 알레르기·기저질환이 둘 다 비면 링크 글자가 [입력하러 가기], 하나라도 있으면 [수정하러 가기] | 요청 2026-10-22 "추천안으로 버튼 바꿔줘"(둘 다 비었을 때만 입력하러 가기) |
| 추가-3 | `features/health/summary/PreventionHistoryCard.jsx` | 명령: `yarn -s lint`, `yarn -s build` / 화면: 예방접종·정기검진 각 상자 안 줄 사이에 점선이 있고 첫 줄 위에는 없다(`html/hlt-summary.html`의 `.kv`와 같다) | 요청 2026-10-22 "예방 · 정기검진 이력 세션 사이에 있는 선이 html과 다르게 없어 html확인해서 동일하게 변경" |
| 추가-4 | `features/health/summary/PreventionHistoryCard.jsx` | 명령: `yarn -s lint`, `yarn -s build` / 화면: 예방 · 정기검진 이력 카드에서 항목명은 더 크고 진한 색, 날짜는 더 작고 회색 | 요청 2026-10-22 "글자 크기 변경: 항목명은 크게, 날짜는 상대적으로 작게 / 글자 색상 변경: 항목명은 진한 색, 날짜는 회색 계열" (정기검진과 이력카드). 시안(`.kv`: 항목명 ink-2, 값 muted)과 다르게 한다 |
| 추가-5 | `features/health/summary/ConditionCard.jsx` | 명령: `yarn -s lint`, `yarn -s build` / 화면: 알레르기 · 기저질환 카드 제목 옆 "진료 시 반드시 확인"이 지금보다 작다 | 요청 2026-10-22 "알레르기 기저질환 섹션에 있는 진료시 확인 글자 작게해" |
| 추가-6 | `features/health/summary/PrescriptionHistoryCard.jsx` | 명령: `yarn -s lint`, `yarn -s build` / 화면: 처방 및 투약 이력이 `html/hlt-summary.html`과 같다 — 목록이 제목 선 바로 아래부터 붙고, 마지막 행 아래 선 없음, 화살표 18px, 날짜 숫자 폭 고름, 0건 안내 여백 20/22/22. 첫 행 `monitor_heart` 아이콘은 처방약에 종류 구분이 없어 못 맞춘다 | 요청 2026-10-22 "처방과 투약 섹션 html과 달라 다시 고쳐" |
| 추가-7 | `features/health/summary/ObservationSummaryCard.jsx`, `AttachmentStrip.jsx` | 명령: `yarn -s lint`, `yarn -s build` / 화면: 관찰 기록 사진 없는 칸 아이콘 52px·연한 회색·글자와 간격 6px, 첨부 자료 1101px 이상에서 칸 폭 160px 고정, 미리보기 칸 아이콘 52px, 오른쪽 위 버튼 아이콘 18px (`html/hlt-summary.html` 기준) | 요청 2026-10-22 "관찰기록과 첨부자료 사이즈 html참조해" |
| 추가-8 | `pages/health/HealthSummaryPage.jsx`, `features/health/summary/SummaryTabs.jsx`(새 파일), `SummaryParts.jsx`(SectionHead id 제거) | 명령: `yarn -s lint`, `yarn -s build` / 화면: 요약 바 아래 4개 앵커가 탭으로 바뀌어 선택한 묶음만 보인다. 처음은 진료 · 예방 이력, `?inspection=`으로 오면 검사 · 수치 | 요청 2026-10-22 "앵커를 탭으로 바꿔서 해당 세션만 보이게 해줘". 명세 011 처리 조건("탭 전환 대신 앵커, 묶음을 숨기지 않음")과 다르다 |
| 추가-9 | `features/health/summary/AttachmentStrip.jsx` | 명령: `yarn -s lint`, `yarn -s build` / 화면: 첨부 자료 카드 제목 줄의 [접기]를 누르면 목록이 접히고 [펼치기]를 누르면 다시 펼쳐진다 | 요청 2026-10-22 "첨부자료 접었다가 누르면 펼쳐지는 형태로 바꿔줘"(처음은 펼침으로 구현했다가 아래 추가-10에서 접힘으로 바꿈). 명세 FN-HLT-011-09에는 없다 |
| 추가-10 | `features/health/summary/AttachmentStrip.jsx`, `LabSection.jsx` | 명령: `yarn -s lint`, `yarn -s build` / 화면: 첨부 자료가 처음에 접혀 있다 / 검사 · 수치 탭을 처음 열면 검사 수치 추이가 기록 2건 이상인 첫 항목(그래프가 그려지는 항목)으로 시작한다 | 요청 2026-10-22 "첨부자료 기본값이 접혀져있는걸로 해주고 검사추이는 기록이 여러개 쌓여서 그래프가 있는 항목이 첫세션화면으로". 검사 수치 추이는 명세 FN-HLT-011-07("기본 선택 = 첫 번째 항목")과 다르다 |
| 추가-11 | `features/health/summary/AttachmentStrip.jsx` | 명령: `yarn -s lint`, `yarn -s build` / 화면: 첨부 자료 카드 제목 줄에 [전체 보기]가 없고 [접기]·[펼치기]만 있다 | 요청 2026-10-22 "첨부자료에서 전체보기버튼 삭제해". 명세 FN-HLT-011-09의 [전체 보기]와 다르다 |
| 추가-12 | `components/Card.jsx`(선택 속성 `onHeaderClick`), `features/health/summary/AttachmentStrip.jsx` | 명령: `yarn -s lint`, `yarn -s build` / 화면: 첨부 자료 카드 제목 줄 어디를 눌러도 접힘·펼침이 바뀐다. 다른 카드는 그대로 | 요청 2026-10-22 "첨부자료 해당리스트칸에서 어디를 눌러도 펼쳐지게 해야지" |
| 추가-13 | `features/health/summary/SummaryHero.jsx` | 명령: `yarn -s lint`, `yarn -s build` / 화면: 히어로 "현재 처방" 칸이 처방명 한 줄, "복용 중" 한 줄의 두 줄로 나온다 | 요청 2026-10-22 "히어로영역 현재 처방에서 복용중이란 글자가 잘려서 내려가는데 두줄표시해". 시안은 `영양제 · 복용 중` 한 줄이다 |

새 의존성: 없음

## 다음에 할 것

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
