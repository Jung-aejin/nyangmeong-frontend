# LJS 핸드오프

## 지금 하는 것

SCR-AIM-001 대화창 · 새 대화 (첫 열기) (시작 2026-10-19) — 상태: 끝 (검증 `통과` 2회차, 사람 확인 2026-10-19). 1회차 실패는 코드가 아니라 기획 밖 `AGENTS.md` 변경 때문이었고 따로 커밋해 풀었다. 입력창은 새 대화뿐 아니라 기존 대화에서도 보인다(이어 쓰기, 011-10). 타이핑으로 1,000자를 넘겨도 붙여넣기와 같은 안내가 뜬다

고른 이유: "다음에 할 것" 맨 위 항목(SCR-AIM-011 연결 남음)은 대화 API가 없어 지금 할 수 없고, 그 항목이 다음 화면으로 SCR-AIM-001을 지목한다.

- 범위: SCR-AIM-011이 비워 둔 대화 영역의 새 대화 상태(웰컴·칩 7종·입력창). 응답 말풍선·스트리밍(002), 라우팅 안내·3초 유예(004), 폴백(005), 일정 카드(012)는 각 화면에서 한다
- 디자인: Figma 노드 `259:3311`, PNG `.cache/figma/SCR-AIM-001__259-3311.png`
- 기능별
  - 001-01 웰컴 메시지: `features/ai/WelcomeMessage.jsx`(새). 닉네임은 `useMemberSummary`의 `mbrNcnm`(기존), 반려동물명은 선택된 칩의 `petNm`. API 새로 없음. 완료 조건 — 명령: `yarn -s lint`·`yarn -s build` 0 / 화면: `/ai` 새 대화에 "안녕하세요, {닉네임}님! {반려동물명}에 대해 …"가 보이고 칩을 바꾸면 이름이 바뀐다
  - 001-02 바로가기 칩: `features/ai/shortcutChips.js`(새, 7종 이름·URL 상수)와 `WelcomeMessage.jsx`. URL은 `docs/routes.md` 기준 — 건강기록 `/health`, 동물병원 찾기 `/places?category=hospital`, 플레이스 `/places`, 커뮤니티 `/community`, 마이페이지 `/mypage`, 캐릭터 꾸미기 `/mypage/characters`(`routes/paths.js`에 `MYPAGE_CHARACTERS` 추가), 고객센터 `/notices`. 완료 조건 — 화면: 칩 7개가 순서대로 보인다
  - 001-03 칩 즉시 이동: `features/ai/openInMainWindow.js`(새, 본창 이동 후 `window.close()`, 본창이 없으면 새 탭). 002-05·004-06·012-15가 같은 함수를 쓴다. 완료 조건 — 화면: 플로팅 [AI]로 연 창에서 칩을 누르면 본창 URL이 바뀌고 AI 창이 닫힌다
  - 001-04 입력·전송: `features/ai/ChatInput.jsx`(새). Enter 전송·Shift+Enter 줄바꿈(한글 조합 중 Enter 무시), 공백만이면 전송 비활성, `n/1,000` 표시, 1,000자 넘는 타이핑 차단, 붙여넣기 초과분 잘라내고 안내. 전송은 `features/ai/api.js`에 가짜 `sendMessage({ aiCnvrsRoomSn, petSn, aiCnvrsMsgCn })` + `queries.js`에 `useSendMessage` 추가(대화 API, Python AI 서버, 담당 없음 — 가짜로 먼저 만들고 나중에 연결). 새 대화면 가짜가 방을 만들어 `aiCnvrsRoomSn`을 돌려주고, 화면은 그 방을 선택해 목록·상세를 무효화한다. 완료 조건 — 화면: 1,001자 타이핑이 막히고, 1,200자 붙여넣기는 1,000자로 잘리며 안내가 뜬다 / 공백만 입력 시 [전송] 비활성 / 전송하면 사이드바 "오늘"에 새 대화가 생기고 내 메시지가 보인다(가짜 응답 기준)
  - 001-05 의도 분기: 판정은 AI 서버가 한다(규칙 → AI 분류). 프론트는 가짜 응답에 분기 결과 필드(`intent` 추정: `REGISTER`·`ROUTE`·`SEARCH`·`FALLBACK`)만 받아 두고, 표시는 012·004·002·005에서 채운다. 이번 완료 조건 — 명령: lint·build 0 (화면 확인 대상 아님)
  - 001-06 히어로 경유 첫 메시지: `pages/ai/AiChatPage.jsx`. `?q=`가 있으면 웰컴 직후 한 번만 자동 전송(StrictMode 이중 실행에도 한 번). 완료 조건 — 화면: `/ai?q=병원 찾아줘`로 열면 새 대화가 하나만 생기고 첫 메시지가 그 문장이다
- 바꿀 파일: 새 `features/ai/WelcomeMessage.jsx`·`ChatInput.jsx`·`shortcutChips.js`·`openInMainWindow.js` / 수정 `features/ai/api.js`·`queries.js`, `pages/ai/AiChatPage.jsx`, `routes/paths.js`
- 경로: 한 세션(파일 3개 이상이라 큰 변경이지만 `.sap/config` 없음)

새 의존성: 없음

질문: 1) [전체] 선택 시 웰컴 문구(반려동물명 없이) 2) 가짜 `intent` 필드 이름·값 추정
결정: 추천안대로

이전 작업: SCR-COM-009 공통 채팅 모달 — 끝(`layouts/ChatModal.jsx`·`ChatModalPlaceholder.jsx`, `context/ChatModalProvider.jsx`. 마지막에 본 방은 Provider state로만 기억, 딤은 헤더 아래 `z-20`이라 모달 중에도 헤더를 누를 수 있다, 가짜 방 목록은 DEV에서만)
이전 작업: SCR-COM-008 설정 (알림) — 끝(`pages/settings/NotificationSettingsPage.jsx`, `features/notification/NotificationSettingsForm.jsx`, 공통 `Toggle`·`SettingsCard`. 저장은 `SAVE_KEYS` 11개만, 가짜 쿼리 `?fakeLimitSet=0`·`?fakeSaveError=1`은 DEV 전용)
이전 작업: SCR-COM-004 알림 드롭다운 — 끝(`layouts/NotificationDropdown.jsx`, `features/notification`. 이동은 서버 `mvmnPath` 그대로, 펫돌봄만 채팅 모달. 가짜 쿼리 `?fakeUnread=N`, `?fakeNotifications=0`)
이전 작업: SCR-COM-003 인증 진입 흐름 — 끝(로그인 링크·`routes/redirect.js`의 `getRedirectPath`). SCR-COM-005 프로필 드롭다운 — 끝(`ConfirmModal`, `useAiWindow.closeAiWindow`, 가짜 키 `mbrNcnm`·`maskedAcntEml`)
이전 작업: SCR-COM-007 AI 매니저 진입 — 끝(히어로 연결 남음). 서로 다른 본창 탭에서 같은 AI 창을 쓰는지는 실측 후 정한다
이전 작업: SCR-COM-006 GNB 2차 메뉴 — 끝. 구현은 Figma 기준(메뉴별 카드)이라 명세 006-03·004·화면설계서와 다름. 플레이스 링크는 `/places?category=…`(용품 `goods`, 동반 `pet-friendly`)

## 다음에 할 것

- 다음 화면은 SCR-AIM-002(`대기`, 응답 말풍선·스트리밍). `features/ai/openInMainWindow.js`는 002-05·004-06·012-15가 그대로 쓴다. 가짜 `sendMessage`는 `intent: 'SEARCH'`만 돌려주고 AI 응답 메시지는 만들지 않는다
- SCR-AIM-001 연결 남음: 대화 API(Python AI 서버, 담당 없음)로 `features/ai/api.js`의 `sendMessage` 가짜를 바꾸고 `intent` 필드 이름·값(`REGISTER·ROUTE·SEARCH·FALLBACK`은 추정)을 Swagger로 확인. Figma의 고양이 캐릭터 이미지(`ai-character.png`)는 저장소에 파일이 없어 웰컴에 넣지 못했다(파일을 받으면 `WelcomeMessage.jsx`에 추가). 직접 주소창으로 연 `/ai`에서는 칩을 눌러도 브라우저가 `window.close()`를 막아 창이 남는다(설계대로)
- SCR-AIM-011 연결 남음: 대화 API(Python AI 서버, 담당 없음)로 `features/ai/api.js`의 가짜(`getConversations`·`getConversation`·`deleteConversation`)를 바꾸고 필드 이름(`aiCnvrs…` 추정)을 Swagger로 확인. 011-08 반려동물 목록 API(SJM)로 `AiChatPage.jsx`의 `fakePets`를 `features/pet` 훅으로 바꾼다. 011-03·17④ 세션 만료 시 AI 창 닫기는 로그인 연결 때(SCR-COM-003 003-10과 함께).- SCR-COM-009 연결 남음: 임시 내용(`ChatModalPlaceholder.jsx`)을 KSJ의 모달 셸로 바꾸고 `ChatModal.jsx`의 `import.meta.env.DEV` 조건을 없앤다(KSJ). 004-09 펫돌봄 알림이 `chatModal.open(방)`을 부르게 연결(알림 응답에 방 식별자 필요, LJS 백엔드·KSJ). 002-11 헤더 안 읽은 메시지 배지(KSJ). 마지막에 본 방을 새로고침 뒤에도 기억할지는 KSJ와 맞춘다
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
- SCR-COM-006 연결 남음: 006-07 터치 동작 명세 확정(반응형 범위 확정 후, 명세 작성자)
- SCR-COM-002 연결 남음: 002-02 `ProtectedRoute`로 감싸기(로그인 연결 때), 002-06 GNB 대상 페이지를 `UserLayout` 아래 라우트로 붙이기(각 담당), 002-09 알림 미확인 수 API(LJS 백엔드), 002-11 채팅 안 읽은 수 조회 위치를 KSJ와 맞추고 연결(KSJ), 002-15 회원 프로필 이미지, 002-24 세션 만료 토스트(SCR-COM-003과 함께)
