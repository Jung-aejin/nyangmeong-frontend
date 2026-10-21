# JAJ 핸드오프

## 지금 하는 것

SCR-HLT-002 건강 일지 · 영수증 등록 (시작 2026-10-21 12:55) — 상태: 진행 중 (승인 2026-10-21 13:10, 검증 1회차 실패, 중간 저장 2026-10-21)

기획 보정(구현 전, 2026-10-21 13:10): LJS가 SCR-AIM-008 업로드 모달(`features/ai/receipt/ReceiptUploadModal.jsx`, 인식 `recognizeCheckupReceipt`)을 이미 만들어 둬서 업로드 단계(`ReceiptUploadStep.jsx`)는 새로 만들지 않고 그 모달을 쓴다. `features/health`는 `features/ai`를 import 할 수 없어 `pages/health/HealthDiaryPage.jsx`가 업로드 모달 → 인식 결과 확인(`ReceiptResultStep`) → 직접 입력(`CheckupModal`)을 이어 조립한다. 그래서 `HealthDiaryPage.jsx`·`CheckupListCard.jsx`(영수증 버튼 콜백)·`FormModal.jsx`(결과 확인 하단 줄의 [다시 촬영하기]·저장 비활성)도 고친다. LJS 인식 응답은 `{ rcptSn, petSn, items:[{ ckupNm, ckupYmd, ckupAmt }] }`뿐이라 병원명·구역·약품 등 나머지는 `receiptApi.js`의 `getReceiptDetail` 가짜가 채운다(YAY 연결 때 한 응답으로 합친다)

기준: 건강기록_기능명세서_v1.0_20261018, 건강기록_화면설계서_v1.0_20261018 (DMS)

디자인: `html/hlt-diary.html`의 2-B 영수증 업로드·2-C 인식 결과 확인·2-D 배정 필요 부분(+ `hlt.css`·`nyangmung.css`). HLT-002 건강 일지와 같은 시안 파일이고 사람이 최우선으로 지정했다. 업로드 화면 SCR-AIM-008(`html/aim-receipt-upload.html`)은 LJS 담당이라 이 모달 안의 단계로만 만든다

가짜 응답: 영수증 인식(YAY)·가계부 지출 생성·중복 확인(SJM)은 아직 없어 새 `features/health/receiptApi.js`에 가짜로 먼저 만들고 나중에 연결한다. 인식은 1초 뒤 고정 결과를 돌려주고, 쿼리 `?fakeReceipt=zones`(구역 2개: 미르·'린이'), `?fakeReceipt=nozone`(구역 없음), `?fakeReceipt=fail`(인식 실패), 기본은 구역 1개. 가계부 중복은 `?fakeLedgerDup=1`. 검진기록 저장·병원 일정 연결은 기존 `diaryApi.js`의 `createCheckup`을 반려동물마다 호출하고, 하나라도 실패하면 이미 만든 것을 되돌리는 `createCheckupsFromReceipt`를 `receiptApi.js`에 둔다. 처방 약품은 검진상세 전이라 저장하지 않고 `receiptApi.js`의 가짜 처방 목록에 검진기록 번호와 함께 쌓는다. 반려동물은 기존 가짜 `getPets`(SJM)

- FN-HLT-002-33 연결 + 업로드(2-B, 위 화면설계 ⑧~⑪): `diary/CheckupModal.jsx`(영수증 버튼 콜백 `onReceipt`, 직접 입력으로 바로 열기 `initialStep`·`rcptSn`), `diary/CheckupListCard.jsx`, `pages/health/HealthDiaryPage.jsx`(조립). 업로드 화면은 LJS의 `ReceiptUploadModal`을 쓴다. 완료 조건 명령: `yarn -s lint`, `yarn -s build`. 화면: [영수증으로 등록하기]를 누르면 업로드 모달(LJS), 성공이면 인식 결과 확인, 실패·15초 초과면 "영수증을 읽지 못했어요" + [다시 촬영하기]·[직접 입력](직접 입력으로 열면 저장 시 영수증 연결만 하고 가계부에는 안 씀)
- FN-HLT-002-34·35·36·37·38 인식 결과 확인(2-C): 새 `diary/ReceiptResultStep.jsx`, `ReceiptPetTab.jsx`. 화면: 원본 썸네일을 누르면 크게 보임, 검진일·병원명(필수, 모든 탭 공통, 인식값 점선·고친 값 실선, 병원명 50자), 구역마다 탭(구역 이름이 등록 이름과 공백 빼고 같으면 자동 연결, 다르면 [반려동물 선택 ▾]에서 고르고 "저장 안 함" 있음, 같은 반려동물 두 탭 불가), 구역이 없으면 업로드에서 고른 반려동물 탭 1개 + [＋ 반려동물 추가](연동된 반려동물 수까지), 탭이 1개면 탭 머리 없음, 탭마다 검진 종류 필수, 검진 내용은 품목명을 쉼표로 자동 채움(500자 넘으면 자르고 "…"), 검진 메모 선택
- FN-HLT-002-39·40·42 금액·처방 약품·금액 배분: 새 `diary/ReceiptInfoBlock.jsx`, `receiptUtils.js`(할인 배분·약품 변환 순수 함수). 화면: 탭 금액 = 구역 소계 − 할인(수정 가능), 하단 할인은 소계 비율로 나눠 원 단위 버림·남는 금액은 마지막 탭에 + "할인 N원을 금액 비율로 나눴어요", 영수증 금액과 나눈 합계가 다르면 "영수증 금액과 합계가 달라요", 약품 금액 합계가 탭 금액과 다르면 "약품 금액 합계와 탭 금액이 달라요"(저장은 안 막음), 처방 약품 행(약품명 40자·시작일=검진일·종료일=검진일+일수−1·1일 횟수=용법 n회·상태=종료일이 오늘 전이면 종료 아니면 복용중)은 모두 필수, [＋ 약품 행 추가]·[−], 0건 저장 가능
- FN-HLT-002-43 배정 필요 목록(2-D): 새 `diary/ReceiptAssignList.jsx`. 화면: 구역 없는 영수증이 [＋ 반려동물 추가]로 2마리 이상이 되면 품목·약품이 "배정 필요" 표로 모이고 행마다 [반려동물 ▾], [전부 ○○에게] 단축 버튼(누른 뒤에도 행마다 변경), 모두 배정해야 저장 가능, 탭 금액 = 배정된 품목 합
- FN-HLT-002-41·44 가계부에도 기록: `ReceiptInfoBlock.jsx`, 새 `diary/LedgerDupModal.jsx`, `receiptApi.js`(`createLedgerExpense`·`findLedgerDuplicates`). API: 가계부 지출 생성·중복 확인 (SJM, 가짜). 화면: 탭마다 체크박스(기본 체크), 금액이 비었거나 1원 미만이면 비활성 + "금액이 있어야 가계부에 기록돼요", 저장 전 같은 반려동물·날짜·금액·병원 지출이 있으면 겹치는 것만 나열한 확인 창에서 [가계부에도 기록하기]/[가계부 기록 건너뛰기](겹친 반려동물만 건너뛰고 검진기록은 저장)
- FN-HLT-002-45·46 다시 촬영하기·저장하기·예정 일정 확인: `ReceiptResultStep.jsx`, 기존 `CheckupModal.jsx`의 일정 확인 창을 여러 마리 줄로 확장(`diary/NearScheduleModal.jsx`로 분리). 화면: [다시 촬영하기]는 입력을 버린다는 확인 뒤 업로드 단계로, [저장하기]는 필수값(검진일·병원명, 탭마다 반려동물·검진 종류, 약품 행 필수값)이 차야 활성 · 모두 "저장 안 함"이면 비활성 + "저장할 반려동물을 1마리 이상 골라 주세요", 최대 길이(병원명 50·검진 내용 500·약품명 40)를 넘으면 "{n}자까지 입력할 수 있어요" + 저장 비활성, 같은 날 병원 일정이 없고 앞뒤 7일 안에 연결 안 된 일정이 있는 반려동물만 한 창에 줄로 나열해 줄마다 [옮겨 연결하기]/[새 일정으로 저장하기], 저장하면 새 검진기록마다 병원 일정에 자동 연결되고 건강 일지 리스트·캘린더에 반영, 1마리면 그 검진상세로, 여러 마리면 보던 반려동물(탭에 없으면 첫 탭)의 검진상세로 이동하고 "미르·아린 2마리 검진기록을 저장했어요 · 아린 기록 보기" 안내, 하나라도 실패하면 모두 되돌리고 입력 유지 + "저장하지 못했어요. 입력한 내용은 그대로 있으니 다시 시도해 주세요." + [다시 시도하기]. 검진상세 `/health/checkups/:ckupRcdSn`는 SCR-HLT-005 전이라 빈 화면
- `features/health/queries.js`: 영수증 인식·저장·가계부 훅 추가, 저장 뒤 검진기록·일정 캐시 무효화
- 범위 밖: SCR-AIM-008 업로드 화면 자체(LJS), 검진상세(SCR-HLT-005)에서 처방약·영수증 연결 표시, 가계부 화면. 수정 모달 경로 `[검진기록 수정]`은 이미 처리됨

### 추가 요청

| 번호 | 바꿀 파일 | 완료 조건 | 근거 |
| --- | --- | --- | --- |
| 추가-1 | `src/routes/domains/healthRoutes.js` | 명령: `yarn -s lint`, `yarn -s build` / 화면: `/health/diary`가 건강 일지를 보여준다 | 요청 2026-10-21 13:21 "라우트 고쳐줘" |

새 의존성: 없음

## 다음에 할 것

- 검증 루프 1회차 실패로 보관 중. 기획은 고치지 않는다. 루프를 버리려면 `! sh scripts/verify-loop.sh clear`
  - 1회차 실패 항목: `/health/diary` 라우트 없음(병합 때 빠짐) · 여러 마리 저장 안내에 '· ○○ 기록 보기' 없음
  - 안내 문구는 고쳤다(`HealthDiaryPage.jsx`, "… 저장했어요 · ○○ 기록 보기", 누르면 이동하는 링크는 SCR-HLT-005가 `state.savedCheckups`로 붙인다). 아직 다시 검증하지 않았다
  - 라우트: 사람이 "라우트 고쳐줘"라고 요청함(2026-10-21 13:21). 다음 세션에서 `### 추가 요청`에 먼저 적고 `routes/domains/healthRoutes.js`에 `HEALTH_DIARY`(HealthDiaryPage)와 `HEALTH_CHECKUP_DETAIL` 빈 라우트를 넣은 뒤 2회차 검증. `fbce8d8`에서 `AppRoutes.jsx`에 넣은 줄이 develop 병합(`de8ff5b`, LJS의 라우트 도메인 분리)에서 빠졌고 PR #37로 develop에도 들어가 develop에서도 빈 화면이다
- 검증 보고의 참고(실패 항목 아님): 약품 행 시작일·종료일은 인식 때 검진일로 고정돼 검진일을 고쳐도 따라 바뀌지 않는다. 저장 실패는 서버가 한 번에 처리한다고 보고 맨 앞에서만 낸다(기획의 반려동물별 되돌리기 `createCheckupsFromReceipt` 대신 `saveReceiptCheckups`). 가계부 함수는 `prepareReceiptSave`·`saveReceiptCheckups` 안에 합쳤다
- 알릴 것(LJS): `routes/domains/devRoutes.js`의 영수증 DEV 화면은 "건강 일지가 영수증 모달을 열면 지움"이라 이 마일스톤이 끝나면 지워도 된다
- 연결 남음: 반려동물 목록·프로필(체중 정상범위·목표 포함) `getPets` (SJM), 캐릭터 이미지 조회 (LJS), 케어 완료의 케어미션·포인트 반영 (SJM), 일정·케어·일상 기록·관찰·검진기록 API `features/health/api.js`·`diaryApi.js` 가짜 응답을 실제 호출로 교체 (JAJ 백엔드)
- 사이드 메뉴 "종합 건강기록"(`/health`)은 라우트가 아직 없어 누르면 빈 화면. SCR-HLT-011 작업 때 연결
- 결정 필요: 공용 `ConfirmModal`을 시안 스타일로 맞출지, 우측 아래 플로팅 버튼(시안은 고양이 이미지)을 맞출지(LJS 파일). 앱 전체 본문 줄 높이를 시안 1.6으로 할지(지금은 건강 일지 안에서만 맞춤). 식사량·음수량·산책 그래프의 "최근 14개"를 기록 14건이 걸친 날의 합계로 그렸는데 14일로 바꿀지
- 정리: `features/health/api.js` 주석에 "더보기"라는 옛 표현이 남아 있다(지금은 페이지 나눔). `HealthDiaryPage`의 `PageFrame`이 `CareCalendarPage`와 거의 같아 한 곳으로 합칠 수 있다. 오늘의 기록 아이콘 이름(`restaurant`·`water_drop`·`directions_walk`·`monitor_weight`·`wc`)은 시안에 정해진 것이 없어 내가 골랐다
- 영수증 등록 연결 남음: 영수증 인식 결과 전체(YAY, 지금은 LJS 인식 응답 + `receiptApi.js` `getReceiptDetail` 가짜), 가계부 지출 생성·중복 확인(SJM, `receiptApi.js` 가짜)
- 알릴 것(LJS): 공용 `layouts/UserHeader.jsx`·`NotificationDropdown.jsx`·`ProfileDropdown.jsx`를 시안 기준으로 수정(Material 아이콘, 새 `headerStyles.js`·`assets/user.svg`), `Card`·`buttonStyles`·`SideMenu`·`PetTabs` 줄 높이·색·비활성 스타일 수정, 로컬 Pretendard 글꼴 추가(`assets/fonts/PretendardVariable.woff2` 약 2MB, `index.css` `@font-face`), `eslint.config.js`에 `html` 제외
- 채팅 아이콘의 안 읽은 수 배지는 KSJ 채팅 API 연결 전이라 숨김
