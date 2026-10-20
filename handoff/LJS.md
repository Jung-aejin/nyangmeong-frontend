# LJS 핸드오프

## 지금 하는 것

SCR-AIM-012 대화창 · 일정 생성 확인 (2026-10-20) — 상태: 끝 (검증 `통과` 1회차(새 루프), 사람 확인 2026-10-20). 앞 루프 실패: 취소 카드에 버튼이 남음·REGISTER 응답 뒤 검색 답변 말풍선 잔존(고침), 결과 날짜 기획 `10-27(화)`가 Figma `10.27(화)`와 어긋남(기획을 고침)

- 만든 것: 가짜 `sendMessage`의 `REGISTER` 분기(되물음·반려동물 칩·미리보기 카드)와 `confirmRegister`·`cancelRegister`, `shared/fakeRegisterParser.js`, `chat/RegisterCard.jsx`·`PetChoiceChips.jsx`, `useConfirmRegister`·`useCancelRegister`, `AiChatPage.jsx`의 카드 state(메시지 번호별, 대화를 옮기면 버림)
- 추가 요청(사람이 직접 요청, 확인함): 추가-1 `features/ai/api.js`를 `async`·`return`·`throw`로 / 추가-2 `src/utils/formatDate.js`(옵션형 `formatDate`·`parseYmd`·`toYmd`·`WEEKDAYS`), `RegisterCard`·`fakeRegisterParser`가 사용
- 결정: [등록]은 AI 서버 확정 API로(재검증·결과 이력 저장이 서버 일). 카드 테두리는 Figma 실선, 결과 날짜는 Figma `MM.DD(요일)`. [케어 캘린더에서 보기]는 응답 시점(카드가 대화의 마지막 메시지일 때)에만(명세 012-15)
- 검증: `yarn -s lint` 0, `yarn -s build` 0. 새 의존성 없음

이전 작업: SCR-COM-002 기본 레이아웃 반응형 — 끝(검증 `통과` 1회차(새 루프), 사람 확인 2026-10-20. `layouts/NavDrawer.jsx`, `LogoutConfirm` 공유, 구간 ≤1100px·≤760px, 푸터 번호는 자리표시 `000-0000-0000`·`02-0000-0000`, 추가 요청 4건(푸터 링크 간격·대표전화 줄·≤760px TOP 숨김·AI 버튼 52px))
이전 작업: SCR-AIM-005 대화창 · 매칭 실패 폴백 — 끝(검증 `확인 못 함 있음`(연결 남음뿐) 2회차. `features/ai/chat/FallbackBubble.jsx`, `features/ai/shared/fallbackCount.js`(sessionStorage 대화별 횟수), 가짜 `sendMessage`의 `intent: 'FALLBACK'`과 DEV 전용 `?fakeAiFallback=1`. 실패 안내는 서버 저장 문구와 `FALLBACK_MESSAGE` 비교로 알아보고, 칩·FAQ 버튼은 최신 실패 메시지에만 보인다)

## 다음에 할 것

- SCR-AIM-012 연결 남음: 대화 API(Python AI 서버, 담당 없음)로 `features/ai/api.js`의 `sendMessage`(REGISTER 분기)·`confirmRegister`·`cancelRegister` 가짜를 바꾸고 `fakeRegisterParser.js`·`fakeDrafts`·`fakePendingCards`·`fakeCareItems`는 지운다. 서버와 먼저 맞출 가정: 서버가 대화별로 되묻는 초안과 확정 전 최근 카드를 기억하고, 확정·취소는 `{aiCnvrsRoomSn, aiCnvrsMsgSn}`만 받는다(서버가 상태를 안 들면 [등록] 때 카드 내용을 같이 보내야 해서 `confirmRegister` 인자와 `RegisterCard`가 바뀐다). 카드 필드 이름은 `schdlCkupTypeCd`·`schdlHsptlNm`·`schdlNm`만 ERD 기준이고 `schdlKndNm`·`schdlYmd`·`schdlTm`·`schdlMemo`·`careArtclNm`·`careRpttTypeCd`·`careCycleNm`·`careLastYmd`·`careNextYmd`·`isDuplicate`는 추정이라 Swagger로 확인. 일정·케어 항목 저장(JAJ, 012-13·14), 반려동물 목록(SJM)으로 `fakePets`를 바꾼다
- 다음 화면은 SCR-AIM-008(`대기`, 영수증 촬영·업로드. 영수증 인식 API(LJS 백엔드)·pet 목록(SJM) 필요). 기획이 막히면 `milestones/LJS.md`의 `대기` 중 맨 위
- 선택: `src/utils/formatDate.js`로 바꿀 수 있는 곳 — `ConversationHeader.jsx`의 `formatDate`는 `formatDate(crtDt)`, `features/expense/shared/expenseFormat.js`의 `formatMonthDay`는 `formatDate(expndYmd, { hasYear: false, separator: '-' })`. 이번에 안 건드렸다
- 범위 밖에서 본 것(말만): `ConversationMessages.jsx`의 `{children && <li>…}`가 항상 참이라 대화 목록 끝에 빈 `<li>`가 생긴다
- 사람이 고치는 문서(SCR-COM-002 반응형): 기능명세서 v0.4 FN-COM-002-23 "햄버거 메뉴 미사용"을 "≤1100px에서 햄버거 사용"으로, FN-COM-002-20 TOP에 "≤760px 미노출"을, FN-COM-006-07 터치 동작의 "반응형 범위 확정 후"를 범위 확정(≤1100px·≤760px)으로. 화면설계서 v0.7 SCR-COM-002 "햄버거[≡]를 두지 않는다", SCR-COM-006 터치(잠정) 문구도 같이
- SCR-COM-002 반응형 남은 것: 실제 대표전화·팩스 번호를 디스코드로 받아 `UserFooter.jsx`의 `TEL_PLACEHOLDER`·`FAX_PLACEHOLDER`에 넣는다. drawer 슬라이드 애니메이션(시안에 있음)·Tab 포커스 가두기는 안 했다. AI 플로팅 버튼의 고양이 이미지(시안 `.fab-ai`, `src/assets/ai-character.png`)는 디자인 담당과 맞춘다. 채팅 모달 모바일 전체 화면 전환은 명세 미결(SCR-COM-009)
- SCR-AIM-005 연결 남음: 대화 API(Python AI 서버, 담당 없음)로 `features/ai/api.js`의 `sendMessage` 가짜를 바꾸고 `FALLBACK` 판정 필드와 실패 안내 메시지 구분 필드를 Swagger로 확인(`FallbackBubble`을 고르는 `ConversationMessages.jsx`의 문구 비교를 그 필드로 바꾼다). 005-02 새로고침 뒤 실패 안내 문구가 이력에 남는지는 그때 확인한다. 고객센터 버튼은 `/faqs`(SCR-CSC-002, KSJ)가 만들어진 뒤 화면 이동을 확인한다
- 주석 컨벤션: 프론트 반영과 `src` 전체 정리 끝(추가-1·2). `common.md` 변경은 팀 합의 문서라 PR에서 알린다. 백엔드 세션(backend-d8)에는 "프론트 반영, JSX는 `{/** */}`, ESLint 지시는 `/* … */`"를 알린다
- SCR-AIM-004 연결 남음: 대화 API(Python AI 서버, 담당 없음)로 `features/ai/api.js`의 `sendMessage` 가짜를 바꾸고 `route`·`aiCnvrsMsgSn` 필드 이름을 Swagger로 확인(`fakeRoutingMap.js`는 지운다). 004-03 새로고침 뒤에도 안내 문구가 이력에 남는지는 그때 확인한다. 본창이 닫혀 있을 때 새 탭으로 여는 `/main`은 라우트가 아직 없다(MAN-001, YAY)
- SCR-AIM-002 연결 남음: 대화 API(Python AI 서버, 담당 없음)로 `features/ai/api.js`의 `streamAnswer` 가짜를 바꾸고 스트리밍 방식(SSE 등)·`rltdShrtcts`·`aiCnvrsMsgCmptnYn` 필드 이름을 Swagger로 확인. 웰컴에 Figma의 고양이 캐릭터를 넣을지(`src/assets/ai-character.png`는 이미 있음)는 디자인 담당과 맞춘다
- SCR-AIM-001 연결 남음: 대화 API(Python AI 서버, 담당 없음)로 `features/ai/api.js`의 `sendMessage` 가짜를 바꾸고 `intent` 필드 이름·값(`REGISTER·ROUTE·SEARCH·FALLBACK`은 추정)을 Swagger로 확인. Figma의 고양이 캐릭터 이미지(`ai-character.png`)는 저장소에 파일이 없어 웰컴에 넣지 못했다(파일을 받으면 `WelcomeMessage.jsx`에 추가). 직접 주소창으로 연 `/ai`에서는 칩을 눌러도 브라우저가 `window.close()`를 막아 창이 남는다(설계대로)
- SCR-AIM-011 연결 남음: 대화 API(Python AI 서버, 담당 없음)로 `features/ai/api.js`의 가짜(`getConversations`·`getConversation`·`deleteConversation`)를 바꾸고 필드 이름(`aiCnvrs…` 추정)을 Swagger로 확인. 011-08 반려동물 목록 API(SJM)로 `AiChatPage.jsx`의 `fakePets`를 `features/pet` 훅으로 바꾼다. 011-03·17④ 세션 만료 시 AI 창 닫기는 로그인 연결 때(SCR-COM-003 003-10과 함께)
- SCR-COM-009 연결 남음: 임시 내용(`ChatModalPlaceholder.jsx`)을 KSJ의 모달 셸로 바꾸고 `ChatModal.jsx`의 `import.meta.env.DEV` 조건을 없앤다(KSJ). 004-09 펫돌봄 알림이 `chatModal.open(방)`을 부르게 연결(알림 응답에 방 식별자 필요, LJS 백엔드·KSJ). 002-11 헤더 안 읽은 메시지 배지(KSJ). 마지막에 본 방을 새로고침 뒤에도 기억할지는 KSJ와 맞춘다
- SCR-COM-008 연결 남음: 알림 설정 API(LJS 백엔드, `GET`·`PUT /members/me/notification-settings`)로 `features/notification/api.js`의 설정 가짜를 바꾼다. 008-12 캐릭터 완료 알림을 설정 가능하게 할지는 명세 확정 대기(명세 작성자)
- SCR-COM-004 연결 남음: 알림 API(LJS 백엔드)로 `features/notification/api.js` 가짜를 바꾸고 AIMG02 코드값 확정 뒤 `notiTabs.js`의 가짜 코드를 고친다. 004-08 공동양육 [수락]·[거절]은 응답에 초대 식별자(`jntBrupInvtnSn`)가 있어야 한다(LJS 백엔드·SJM, 백엔드 issues 14번). 004-09 펫돌봄은 채팅방 식별자(`otoChatRoomSn`)로 방을 열어야 한다(SCR-COM-009, KSJ). 시간 표시("10분 전")는 `NotificationSummary`에 수신 일시 필드가 없어 LJS 백엔드에서 추가. 가짜 공지 `mvmnPath`가 `/notices/1`이라 `docs/routes.md` 75행(`/notices`)과 다르다(가짜라 동작 영향 없음)
- SCR-COM-003 연결 남음: 003-08 로그인 상태로 랜딩에 오면 `/main`으로(`useMe` 필요, 로그인 연결 때, YAY). 003-10 AI 대화창이 401이면 인증 오류 표시 후 창 닫기(SCR-AIM-011). 로그인 화면(ACC-002, YAY)은 성공 뒤 `routes/redirect.js`의 `getRedirectPath(location.search)`로 이동 경로를 정한다(YAY에 알릴 것). 테스트 러너가 없어 이 함수의 회귀 테스트가 없다(러너 추가는 의존성이라 팀 결정)
- SCR-COM-005 연결 남음: 005-02 회원 요약 조회 API(LJS 백엔드)로 `getMemberSummary`를 바꾸고 응답 키(`maskedAcntEml`, 명세 기준)를 Swagger로 확인, 005-07 로그아웃 API(YAY)로 `logout`을 바꾼다(로그인 연결 때). 005-08 채팅 모달 닫기는 SCR-COM-009에서 화면으로 확인(KSJ)
- SCR-COM-007 연결 남음: 007-03 메인 히어로 검색바가 `useAiWindow`의 `open(문장)`을 부르게 연결(YAY, MAN-001). `/ai`가 `?q=`를 새 대화의 첫 메시지로 보내는 일(SCR-AIM-001, 읽기까지는 `AiChatPage.jsx`가 한다). 이미 열린 `/ai` 창에서는 `open(firstMessage)`의 첫 메시지가 무시되므로(`useAiWindow.js` else 분기) 그때 처리 방식을 정한다
- 플레이스 URL 구조 확인(YAY, HOS-001): 5개 화면을 `/places?category=…` 하나로 만들지, 탭마다 별도 URL로 할지. 답에 따라 `gnbMenus.js`와 `docs/routes.md`의 해당 값을 같이 고친다
- 사람이 고치는 문서 (`?cat` → `?category`):
  - AI매니저 기능명세서 v0.7: FN-AIM-004-10, 「부록_라우팅매핑표」 No.2·3·17~20행, 제.개정내역 새 버전 행
  - AI매니저 화면설계서 v0.9: 부록 라우팅 표의 `?cat=hospital`, `?cat=…` 2곳
- SCR-COM-006 문서 불일치(공통레이아웃): 기능명세서 v0.4 006-03(3열 한 패널)·006-04(건강기록 = 건강 종합·검진기록관리·건강상태관리, 커뮤니티 순서)와 화면설계서 v0.7 SCR-COM-006(같은 내용)이 구현(메뉴별 카드, 건강기록 = 종합 건강기록·건강 일지·케어 캘린더)과 다름. 작성자가 어느 쪽이 맞는지 정해 문서를 고친다. Figma 플레이스 프레임은 없음
- 화면설계서 v0.7 SCR-COM-006의 건강기록 첫 화면 ID `SCR-HLT-001`은 결번이다. `SCR-HLT-011`로 고친다(AI매니저 명세 부록 No.43 기준)
- 범위 밖에서 본 것(말만): 공통레이아웃 기능명세서 FN-COM-004-07의 케어 일정 알림 이동 대상(건강상태관리 정기관리)이 AI매니저 FN-AIM-006-13(케어 캘린더 SCR-HLT-003)과 다름
- SCR-COM-006 연결 남음: 006-07 터치 동작 명세 확정(반응형 범위는 ≤1100px·≤760px로 정해졌다. 명세 작성자가 문구를 갱신하면 구현할 내용을 정한다)
- SCR-COM-002 연결 남음: 002-02 `ProtectedRoute`로 감싸기(로그인 연결 때), 002-06 GNB 대상 페이지를 `UserLayout` 아래 라우트로 붙이기(각 담당), 002-09 알림 미확인 수 API(LJS 백엔드), 002-11 채팅 안 읽은 수 조회 위치를 KSJ와 맞추고 연결(KSJ), 002-15 회원 프로필 이미지, 002-24 세션 만료 토스트(SCR-COM-003과 함께)
