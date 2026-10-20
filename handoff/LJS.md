# LJS 핸드오프

## 지금 하는 것

SCR-AIM-005 대화창 · 매칭 실패 폴백 (시작 2026-10-20 18:41) — 상태: 끝 (검증 `확인 못 함 있음`(연결 남음뿐) 2회차, 사람 확인 2026-10-20). 1회차 실패는 가짜 대화 번호가 새로고침마다 100부터 다시 시작해 새 대화가 이전 세션의 실패 횟수를 이어받은 것과 FAQ 버튼 문구 불일치였다

- 범위: 매칭 실패 입력에 대한 실패 안내·대표 칩 재노출·연속 실패 카운트·2회 연속 시 FAQ 버튼. 등록 요청 확인 카드(012)는 그 화면에서 한다
- 디자인: Figma 노드 `259:2357`, PNG `.cache/figma/SCR-AIM-005__259-2357.png`
- 기능별
  - 005-01 매칭 실패 판정: 판정은 AI 서버가 한다. `features/ai/api.js`의 가짜 `sendMessage`가 등록·룰 매칭에 걸리지 않고 완성형 한글·영문 단어가 없는 입력(`ㅁㄴㅇㄹ`, `???`)이면 `intent: 'FALLBACK'`을 준다. 그 밖은 지금처럼 `SEARCH`. DEV 쿼리 `?fakeAiFallback=1`이면 모든 입력을 실패로 판정. 대화 API(Python AI 서버, 담당 없음) — 가짜로 먼저 만들고 나중에 연결. 완료 조건 — 화면: `ㅁㄴㅇㄹ` 전송 시 실패 안내가 나오고 `강아지 예방접종 순서` 전송 시 기존 검색 응답이 나온다
  - 005-02 실패 안내 표출: 가짜가 안내 문구 "질문을 이해하지 못했어요. 다시 입력하거나 아래에서 선택해 주세요."를 AI 메시지로 저장하고 `aiCnvrsMsgSn`을 돌려준다(AIM-004 이동 안내와 같은 방식). 새 `features/ai/FallbackBubble.jsx`, `ConversationMessages.jsx`가 그 메시지를 말풍선으로 그린다. 완료 조건 — 화면: 실패 안내가 AI 말풍선으로 보이고 새로고침 뒤에도 문구가 이력에 남는다
  - 005-03 칩 재노출: `FallbackBubble.jsx`가 `shortcutChips` 7종을 그리고 누르면 `openInMainWindow(path)`. 칩은 응답 시점에만(최신 실패 메시지일 때) 보이고 저장하지 않는다(AIM-002 바로가기와 같은 규칙). 완료 조건 — 화면: 실패 안내 아래 칩 7개가 순서대로 보이고 누르면 본창이 이동한다
  - 005-04 연속 실패 카운트: 새 `features/ai/fallbackCount.js`(`sessionStorage`에 대화 ID별 `get`·`increase`·`reset`, 읽기·쓰기 실패 시 0으로 동작). `AiChatPage.jsx`가 `FALLBACK`이면 올린다. 완료 조건 — 화면: 1회 실패 → 새로고침 → 다시 실패하면 FAQ 버튼이 나온다
  - 005-05 고객센터 안내: 카운트 2 이상이면 `FallbackBubble.jsx`에 "찾으시는 내용이 없다면 고객센터를 이용해 주세요." + [자주하는 질문 보기 →] (`openInMainWindow(PATHS.FAQS)`, `/faqs`). 완료 조건 — 화면: 같은 대화 1회 실패에는 없고 2회 연속 실패에 나온다
  - 005-06 카운트 초기화: `AiChatPage.jsx`에서 `ROUTE`·`REGISTER` 응답과 `SEARCH` 답변 완료 시 `reset`. 새 대화는 키가 없어 0. 이동 [취소]는 실패로 세지 않는다(`ROUTE`에서 이미 초기화). 완료 조건 — 화면: 실패 → 검색 성공 → 실패면 FAQ 버튼이 없다 / 다른 대화로 옮기면 그 대화의 카운트를 쓴다
  - 005-07 부적절 입력 처리: 별도 필터 없음(범위 외). 가짜 판정 규칙을 그대로 따른다. 완료 조건 — 명령: `yarn -s lint`·`yarn -s build` 0 (화면 확인 대상 아님)
- 바꿀 파일: 새 `features/ai/FallbackBubble.jsx`·`fallbackCount.js` / 수정 `features/ai/api.js`·`ConversationMessages.jsx`, `pages/ai/AiChatPage.jsx`
- 경로: 한 세션(파일 3개 이상이라 큰 변경이지만 `.sap/config` 없음)

새 의존성: 없음

질문: 1) AIM-004 결정("매칭 실패는 `SEARCH`")을 바꿔, 의미 없는 입력만 `FALLBACK`으로 가짜 판정해도 될까요? 2) FAQ 버튼도 칩처럼 최신 실패 메시지에만 보이게 할까요? (추천: 둘 다 예)
결정: 1) 예 2) 예

- 만든 것: `features/ai/fallbackCount.js`(실패 안내 문구 상수·`sessionStorage` 대화별 횟수 `get`·`increase`·`reset`), `FallbackBubble.jsx`(안내 말풍선·칩 7종·고객센터 안내), 가짜 `sendMessage`의 `intent: 'FALLBACK'`과 안내 AI 메시지 저장, `ConversationMessages.jsx`(안내 문구와 같은 AI 메시지를 `FallbackBubble`로 그림), `AiChatPage.jsx`(횟수 상태, `ROUTE`·`REGISTER`·검색 답변 완료 시 초기화, 대화 전환 시 그 대화의 횟수 읽기)
- 결정: 실패 안내 메시지는 서버가 저장한 문구와 `FALLBACK_MESSAGE`가 같은지로 알아본다(실제 API는 구분 필드가 생기면 그것으로 바꾼다). 가짜 대화 번호를 `Date.now()`로 바꿔 새로고침 뒤 번호가 겹치지 않게 했다. `FALLBACK`이면 `answer.reset()`을 불러 이전 답변 말풍선이 실패 안내 아래로 밀려 나오지 않게 했다. 칩 마크업은 `AnswerBubble.jsx`와 같은 모양을 `FallbackBubble.jsx`에 따로 썼다(공통화는 이번 범위 밖). 가짜 쿼리 `?fakeAiFallback=1`은 DEV 전용
- 검증: `yarn -s lint` 0, `yarn -s build` 0. 검증 루프는 2회차 통과 때 검증 에이전트가 비웠다(`status`: 잠금 없음)

이전 작업: SCR-AIM-004 대화창 · 페이지 라우팅 (시작 2026-10-20) — 상태: 끝 (검증 `확인 못 함 있음`(연결 남음뿐) 2회차, 사람 확인 2026-10-20). 1회차 실패는 기획 밖 변경(`openInMainWindow.js`에 채팅 모달 함수 추가)이었고 `AiChatPage.jsx` 안으로 옮겼다
이전 작업: SCR-AIM-002 대화창 · 검색 질문/응답 — 끝(검증 `통과` 2회차. `useAnswerStream`·`AnswerBubble`·`ConversationMessages`, 가짜 `streamAnswer`와 DEV 쿼리 `?fakeAiFirstDelay=11`·`?fakeAiError=1`·`?fakeAiCut=1`·`?fakeAiNoShortcut=1`. 의료 고지 "※"는 점선 아래, 고양이 캐릭터는 응답 아바타에만)
이전 작업: SCR-AIM-001 대화창 · 새 대화 — 끝(검증 `통과` 2회차. `WelcomeMessage`·`ChatInput`·`shortcutChips`·`openInMainWindow`, 가짜 `sendMessage`의 `intent`, 히어로 `?q=` 첫 메시지 자동 전송)
이전 작업: SCR-COM-009 공통 채팅 모달 — 끝(`layouts/ChatModal.jsx`·`ChatModalPlaceholder.jsx`, `context/ChatModalProvider.jsx`. 마지막에 본 방은 Provider state로만 기억, 딤은 헤더 아래 `z-20`이라 모달 중에도 헤더를 누를 수 있다, 가짜 방 목록은 DEV에서만)
이전 작업: SCR-COM-008 설정 (알림) — 끝(`pages/settings/NotificationSettingsPage.jsx`, `features/notification/NotificationSettingsForm.jsx`, 공통 `Toggle`·`SettingsCard`. 저장은 `SAVE_KEYS` 11개만, 가짜 쿼리 `?fakeLimitSet=0`·`?fakeSaveError=1`은 DEV 전용)
이전 작업: SCR-COM-004 알림 드롭다운 — 끝(`layouts/NotificationDropdown.jsx`, `features/notification`. 이동은 서버 `mvmnPath` 그대로, 펫돌봄만 채팅 모달. 가짜 쿼리 `?fakeUnread=N`, `?fakeNotifications=0`)
이전 작업: SCR-COM-007 AI 매니저 진입 — 끝(히어로 연결 남음). 서로 다른 본창 탭에서 같은 AI 창을 쓰는지는 실측 후 정한다

## 다음에 할 것

- SCR-AIM-005 연결 남음: 대화 API(Python AI 서버, 담당 없음)로 `features/ai/api.js`의 `sendMessage` 가짜를 바꾸고 `FALLBACK` 판정 필드와 실패 안내 메시지 구분 필드를 Swagger로 확인(`FallbackBubble`을 고르는 `ConversationMessages.jsx`의 문구 비교를 그 필드로 바꾼다). 005-02 새로고침 뒤 실패 안내 문구가 이력에 남는지는 그때 확인한다. 고객센터 버튼은 `/faqs`(SCR-CSC-002, KSJ)가 만들어진 뒤 화면 이동을 확인한다
- 주석 컨벤션: 프론트 반영과 `src` 전체 정리 끝(추가-1·2). `common.md` 변경은 팀 합의 문서라 PR에서 알린다. 백엔드 세션(backend-d8)에는 "프론트 반영, JSX는 `{/** */}`, ESLint 지시는 `/* … */`"를 알린다
- SCR-AIM-004 연결 남음: 대화 API(Python AI 서버, 담당 없음)로 `features/ai/api.js`의 `sendMessage` 가짜를 바꾸고 `route`·`aiCnvrsMsgSn` 필드 이름을 Swagger로 확인(`fakeRoutingMap.js`는 지운다). 004-03 새로고침 뒤에도 안내 문구가 이력에 남는지는 그때 확인한다. 본창이 닫혀 있을 때 새 탭으로 여는 `/main`은 라우트가 아직 없다(MAN-001, YAY)
- 다음 화면은 SCR-AIM-012(`대기`, 일정 생성 확인). 등록 요청(`REGISTER`)을 가짜 `sendMessage`가 이미 주므로 `AiChatPage.jsx`에서 그 분기를 채운다. 기획이 막히면 `milestones/LJS.md`의 `대기` 중 맨 위
- SCR-AIM-002 연결 남음: 대화 API(Python AI 서버, 담당 없음)로 `features/ai/api.js`의 `streamAnswer` 가짜를 바꾸고 스트리밍 방식(SSE 등)·`rltdShrtcts`·`aiCnvrsMsgCmptnYn` 필드 이름을 Swagger로 확인. 웰컴에 Figma의 고양이 캐릭터를 넣을지(`src/assets/ai-character.png`는 이미 있음)는 디자인 담당과 맞춘다
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
