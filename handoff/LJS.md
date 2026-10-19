# LJS 핸드오프

## 지금 하는 것

SCR-AIM-011 AI 대화창 (새 창) (시작 2026-10-19) — 상태: 끝 (검증 `통과` 2회차, 사람 확인 2026-10-19). 내 범위는 창 겉틀(사이드바·대화 헤더·대화 영역 자리)뿐이고 대화 영역 안은 SCR-AIM-001·002·004·005·012. 연결 남음은 "다음에 할 것"

- 만든 것: `pages/ai/AiChatPage.jsx`(`UserLayout` 밖 전체 화면, `?q=`는 `data-first-message`에 보관, [설정]은 `window.opener`를 `/settings/notifications`로 보내고 없으면 새 탭), `features/ai/`의 `ConversationSidebar`(접기·펼치기 슬라이드, 칩 [전체]·반려동물, 날짜 묶음 목록)·`ConversationHeader`(제목·펫 태그·날짜·삭제, `ConfirmModal`)·`ConversationMessages`(읽기만)·`groupConversations.js`·`api.js`(가짜)·`queries.js`·`fakePets.js`
- 결정: 대화 API 가짜 필드는 ERD 컬럼명에서 따온 추정(`aiCnvrsRoomSn`, `aiCnvrsRoomCnvrsTtl`, `aiCnvrsMsgRoleCd` 등). 메시지 조회는 대화 상세 하나(`getConversation`, 방 정보 + `messages`)로 묶었다. 대화는 첫 메시지 때 생성이라 [＋ 새 대화]는 서버 요청 없이 선택만 비운다. [설정]은 플로팅 [AI]로 연 창에서만 본창을 바꾼다(주소창으로 직접 연 `/ai`는 `opener`가 없어 새 탭, 설계대로). 본창 확인은 `/` 또는 `/settings/notifications`에서 한다(`/main`은 라우트 없음)
- 추가 요청(모두 `features/ai/ConversationSidebar.jsx`, 검증 통과): 추가-1 칩 순서 [전체] 맨 왼쪽, 추가-2 [☰] 접기·펼치기 슬라이드(둘 다 사람 요청 2026-10-19 23:14)
- 검증: `yarn -s lint` 0, `yarn -s build` 0, 판정 `통과`

이전 작업: SCR-COM-009 공통 채팅 모달 — 끝(`layouts/ChatModal.jsx`·`ChatModalPlaceholder.jsx`, `context/ChatModalProvider.jsx`. 마지막에 본 방은 Provider state로만 기억, 딤은 헤더 아래 `z-20`이라 모달 중에도 헤더를 누를 수 있다, 가짜 방 목록은 DEV에서만)
이전 작업: SCR-COM-008 설정 (알림) — 끝(`pages/settings/NotificationSettingsPage.jsx`, `features/notification/NotificationSettingsForm.jsx`, 공통 `Toggle`·`SettingsCard`. 저장은 `SAVE_KEYS` 11개만, 가짜 쿼리 `?fakeLimitSet=0`·`?fakeSaveError=1`은 DEV 전용)
이전 작업: SCR-COM-004 알림 드롭다운 — 끝(`layouts/NotificationDropdown.jsx`, `features/notification`. 이동은 서버 `mvmnPath` 그대로, 펫돌봄만 채팅 모달. 가짜 쿼리 `?fakeUnread=N`, `?fakeNotifications=0`)
이전 작업: SCR-COM-003 인증 진입 흐름 — 끝(로그인 링크·`routes/redirect.js`의 `getRedirectPath`). SCR-COM-005 프로필 드롭다운 — 끝(`ConfirmModal`, `useAiWindow.closeAiWindow`, 가짜 키 `mbrNcnm`·`maskedAcntEml`)
이전 작업: SCR-COM-007 AI 매니저 진입 — 끝(히어로 연결 남음). 서로 다른 본창 탭에서 같은 AI 창을 쓰는지는 실측 후 정한다
이전 작업: SCR-COM-006 GNB 2차 메뉴 — 끝. 구현은 Figma 기준(메뉴별 카드)이라 명세 006-03·004·화면설계서와 다름. 플레이스 링크는 `/places?category=…`(용품 `goods`, 동반 `pet-friendly`)

## 다음에 할 것

- SCR-AIM-011 연결 남음: 대화 API(Python AI 서버, 담당 없음)로 `features/ai/api.js`의 가짜(`getConversations`·`getConversation`·`deleteConversation`)를 바꾸고 필드 이름(`aiCnvrs…` 추정)을 Swagger로 확인. 011-08 반려동물 목록 API(SJM)로 `AiChatPage.jsx`의 `fakePets`를 `features/pet` 훅으로 바꾼다. 011-03·17④ 세션 만료 시 AI 창 닫기는 로그인 연결 때(SCR-COM-003 003-10과 함께). 011-05 `?q=` 첫 메시지 자동 전송은 SCR-AIM-001(001-06)에서(`AiChatPage.jsx`의 `data-first-message` 자리). 다음 화면은 SCR-AIM-001(`대기`)
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
- SCR-COM-006 연결 남음: 006-07 터치 동작 명세 확정(반응형 범위 확정 후, 명세 작성자)
- SCR-COM-002 연결 남음: 002-02 `ProtectedRoute`로 감싸기(로그인 연결 때), 002-06 GNB 대상 페이지를 `UserLayout` 아래 라우트로 붙이기(각 담당), 002-09 알림 미확인 수 API(LJS 백엔드), 002-11 채팅 안 읽은 수 조회 위치를 KSJ와 맞추고 연결(KSJ), 002-15 회원 프로필 이미지, 002-24 세션 만료 토스트(SCR-COM-003과 함께)
