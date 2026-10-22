# LJS 핸드오프

## 지금 하는 것

SCR-COM-009 채팅 셸 — 새 창 (2026-10-21) — 상태: 끝 (검증 `통과` 3회차, 사람 확인 2026-10-21)

- 결정(사람): 모달이 아니라 별도 브라우저 창 `/chat`(`docs/routes.md` 36행). 모달 파일 5개(`layouts/ChatModal*`·`context/ChatModal*`·`constants/chatModal.js`) 삭제
- 만든 것: `hooks/useChatWindow.js`(창 이름 `nyangmeong-chat`, `open({ otoChatRoomSn?, pstSn? })`·`closeChatWindow()`), `pages/chat/ChatPage.jsx`, `features/chat/`(가짜 `api.js`·`queries.js`·`room/` 목록·대화·입력), 헤더 배지 연결, 알림·로그아웃·AI 창 연결, `/dev/chat`
- 추가-1 탭이 아닌 팝업 창(1040x780, 본창 가운데). macOS 전체 화면이면 Chrome이 팝업을 탭으로 연다(코드로 못 바꿈)
- 추가-2 주소창으로 직접 연 `/chat`은 `window.close()`가 막혀 [✕]가 `/main`으로 이동

이전 작업: 공용 페이지 머리(경로 › 제목)·사이드 메뉴 — 끝(검증 `통과` 1회차, 사람 확인 2026-10-21). 사용법은 아래 다음에 할 것

## 다음에 할 것

- SCR-COM-009 연결 남음: 채팅 API(KSJ, 백엔드 `docs/api/community.md`)로 `features/chat/api.js` 가짜를 바꾸고 가짜 읽음 위치 `localStorage['fake-chat-read-seq']` 코드를 지운다. KSJ에 물을 것: `ChatMessageSummary`에 보낸 시각 필드가 없다(말풍선 시간·날짜 구분 못 그림). 009-18 알림 억제는 서버(YAY). 게시글 [채팅하기](SCR-CMU-004, KSJ)는 `useChatWindow()`의 `open({ pstSn })`를 클릭 핸들러에서 바로 부른다(요청을 기다린 뒤 열면 팝업 차단). 붙인 뒤 `/dev/chat`(`pages/dev/ChatDevPage.jsx`)을 지운다
- 사람이 고치는 문서(SCR-COM-009): 기능명세서 v0.4 FN-COM-009-03 "새 창이 아닌 모달" → 별도 창, 009-09·11·12와 화면설계서 v0.7 SCR-COM-009의 모달 문구도 같이. 백엔드 저장소 `docs/convention/milestone.md` 담당 표에 채팅 화면 LJS 이관 반영
- SCR-COM-009 남은 화면 일: 390px에서 `/chat` 목록 `w-[380px]` 고정이라 가로로 넘친다(모바일 전체 화면은 명세 미결). 목록 시간이 날짜만 나온다(Figma는 오늘 `HH:mm`·어제 `어제`, `utils/formatDate.js`에 함수 추가 필요). 디자인의 [내 글]·[지원한 글] 탭과 역할·거래 상태 배지는 목록 API에 필드가 없어 CMU-005에서
- 공용 페이지 머리·사이드 메뉴 적용(각 담당): 화면을 `@/layouts/SubPageLayout`으로 감싸고, 파일 안의 `PageFrame`·`Chevron`·픽셀 그림·`SideMenu` 호출을 지운다. 메뉴 이름·순서·그림은 `layouts/subMenus.js`(`SUB_MENUS`)만 고친다. 옮길 화면: 건강기록 4개(`HealthSummaryPage`·`HealthDiaryPage`·`CareCalendarPage`·`CheckupDetailPage`, JAJ), 마이페이지(SJM), 고객센터 `CustomerCenterLayout`(KSJ), 커뮤니티(KSJ, 화면 만들 때). 모두 옮기면 `SideMenu`의 `menuLabel` 호환과 `/dev/sub-page`(`pages/dev/SubPageDevPage.jsx`)를 지운다

  | prop | 기본값 | 하는 일 |
  | --- | --- | --- |
  | `section` | (필수) | `SUB_MENUS` 키: `health`·`community`·`mypage`·`support` |
  | `menu` | 현재 경로와 같은 메뉴 | 선택할 사이드 메뉴의 `to`. 경로가 메뉴 아래가 아닌 상세·글쓰기 화면에서 넘긴다 |
  | `title` | 선택 메뉴 이름 | 넘기면 3단계(섹션 › 메뉴 › 제목) |
  | `back` | `title`이 있으면 true | 본문 위 `‹ 목록으로`(선택 메뉴로) |
  | `description` | 없음 | 제목 아래 설명. 없어도 한 줄 높이를 비운다 |
  | `pixel` | true | false면 머리 그림을 끈다 |
  | `onLeave` | 없음 | 경로·목록으로 링크를 누르면 이동 대신 `onLeave(to)` 호출(작성 중 나가기 확인) |
  | `contentClassName` | `min-[1101px]:pt-6` | 본문 위 여백 바꾸기(펫이야기·펫뉴스 `min-[1101px]:pt-0`, 펫돌봄·실종센터 `min-[1101px]:pt-[7px]`) |

  ```jsx
  <SubPageLayout section="health" description="…">…</SubPageLayout>                                        {/** 목록: 건강기록 › 건강 일지, 761~1100px ▾ */}
  <SubPageLayout section="health" menu={PATHS.HEALTH_DIARY} title="검진상세">…</SubPageLayout>              {/** 3단계 + ‹ 목록으로 */}
  <SubPageLayout section="community" menu={PATHS.COMMUNITY} back>…</SubPageLayout>                          {/** 커뮤니티 상세: 커뮤니티 › 펫이야기 + ‹ 목록으로 */}
  ```

- 하네스 확인: 다음 화면 작업 PR의 `/end`에서 처음으로 `pr-assets` 릴리스를 만들고(사람 확인 후) 캡처 업로드·Screenshots 표 채우기가 되는지 본다. 검증 루프가 `.claude/skills/`도 기준 파일로 잠가 하네스 작업은 실패 뒤 고칠 수 없다(이번엔 사람이 clear). 하네스 작업이면 예외를 둘지 팀과 정한다

- KSJ 확인: 펫이야기 작성·수정 URL을 `/community/posts/new`·`/community/posts/:pstSn/edit`로 해석해 `paths.js`에 넣음
- 범위 밖 1px 경계(말만, 각 담당): `layouts/SideMenu.jsx`·`SubPageLayout`·`SubPageHead`(`min-[1101px]`·`max-[1101px]`, 디자인 ≤1100 기준. 헤더는 1100에서 GNB라 정확히 1100px에서 GNB와 `▾`가 같이 보임), `features/pet/list/PetSlide.jsx`(SJM)·`pages/health/CareCalendarPage.jsx`(JAJ)의 `min-[1101px]`·`min-[761px]`
- 선택: Figma MCP 한도가 풀리면 헤더 아이콘 원본 SVG(317:2097·317:2106·317:2087)와 비교해 바꾸고, 색을 바꿀 일이 생기면 `currentColor` 인라인 SVG로. AI 대화창 모바일·바텀 네비는 시안 없이 만들었으니 디자인 담당과 맞춘다
- SCR-AIM-006 연결 남음(가짜로 끝남): 006-01~08·10·15~18·20 사전 알림 배치(LJS 백엔드) — 매일 09:00 KST 스캔으로 케어 캘린더 병원 일정 D-N 대상 추출, 연동 양육자 전원(탈퇴 제외)별 설정(채널·D-0/1/3/7·케어 일정 유형) 적용, 이메일(가입 주소, 제목 `[냥멍케어] {반려동물명}의 {검진유형} 일정이 {D-N} 남았어요`, 당일은 "오늘이에요")·인앱(`CARE_SCHDL`, `mvmnPath` `/health/calendar`) 생성, 이력·10분 간격 3회 재시도·(회원+일정+일정일+시점+채널) 중복 방지. 메일 [케어 캘린더에서 확인하기]는 `/health/calendar`, 수신 해제는 `/settings/notifications`. 006-09·11·12 프론트는 알림 목록·미확인 수 API(LJS 백엔드)로 가짜를 바꿀 때 같이(SCR-COM-004 연결). 006-13 메일 링크 미인증 복귀는 로그인 연결 때 `ProtectedRoute`·`getRedirectPath`(YAY). 배지 1분 polling은 KSJ 채팅 안 읽은 수 방식이 정해지면 맞춘다
- SCR-AIM-010 연결 남음(가짜로 끝남): 검진기록 등록·수정 모달(SCR-HLT-002, JAJ)이 `ReceiptUploadModal`의 `onManualInput({ rcptSn? })`으로 빈 폼을 연다. `rcptSn`이 있으면 저장 때 영수증 상태를 인식실패→저장완료로 바꾸는 일은 LJS 백엔드·JAJ 저장 API와 맞춘다(명세 10-06 [확인 필요]). 영수증 인식 결과 확인 모달(SCR-HLT-002, JAJ)은 `onRecognized(result)`를 받는다. 부분 인식은 `ckupYmd`·`ckupAmt`가 `null`일 수 있다
- 사람이 고치는 문서(SCR-AIM-010 추가 요청): 기능명세서 v0.7 FN-AIM-010-03 [다시 촬영]→[다시 올리기], FN-AIM-010-07 문구 2종 "다시 촬영하거나"→"다시 올리거나". 화면설계서 v0.9 SCR-AIM-010 ② 라벨과 같은 문구도 같이
- SCR-AIM-012 연결 남음: 대화 API(Python AI 서버, 담당 없음)로 `features/ai/api.js`의 `sendMessage`(REGISTER 분기)·`confirmRegister`·`cancelRegister` 가짜를 바꾸고 `fakeRegisterParser.js`·`fakeDrafts`·`fakePendingCards`·`fakeCareItems`는 지운다. 서버와 먼저 맞출 가정: 서버가 대화별로 되묻는 초안과 확정 전 최근 카드를 기억하고, 확정·취소는 `{aiCnvrsRoomSn, aiCnvrsMsgSn}`만 받는다(서버가 상태를 안 들면 [등록] 때 카드 내용을 같이 보내야 해서 `confirmRegister` 인자와 `RegisterCard`가 바뀐다). 카드 필드 이름은 `schdlCkupTypeCd`·`schdlHsptlNm`·`schdlNm`만 ERD 기준이고 `schdlKndNm`·`schdlYmd`·`schdlTm`·`schdlMemo`·`careArtclNm`·`careRpttTypeCd`·`careCycleNm`·`careLastYmd`·`careNextYmd`·`isDuplicate`는 추정이라 Swagger로 확인. 일정·케어 항목 저장(JAJ, 012-13·14), 반려동물 목록(SJM)으로 `fakePets`를 바꾼다
- SCR-AIM-008 연결 남음(가짜로 끝남, `ReceiptUploadModal`은 `features/ai/receipt/`, 같은 날 SCR-AIM-010도 이 모달을 고쳤다):
  - 영수증 인식 API(LJS 백엔드): `features/ai/api.js`의 `recognizeCheckupReceipt` 가짜를 `api.post`로 바꾼다. 경로(`POST /receipts/recognize/checkup`)와 응답 필드(`rcptSn`·`petSn`·`items[]`의 `ckupNm`·`ckupYmd`·`ckupAmt`)는 추정이라 Swagger로 확인한다. `signal`은 axios에 넘기고, `waitAbortable`은 지운다. 15초 시간 초과는 모달(`ANALYZE_TIMEOUT_MS`)이 판정하므로 서버 타임아웃(15초, 명세 008-07)과 맞춘다. [취소] 때 영수증 상태 '취소'를 서버에 알릴 API가 필요한지 확인한다
  - 건강 일지(JAJ, SCR-HLT-002): [영수증으로 등록하기]에서 모달을 연다. `pets`(`usePets`, SJM), `defaultPetSn`(건강 일지에서 선택 중인 반려동물), `onRecognized(result)`(영수증 인식 결과 확인 모달로), `onManualInput()`(검진기록 등록·수정 모달 빈 폼으로)를 넘긴다. 붙인 뒤 확인용 `pages/dev/ReceiptUploadDevPage.jsx`와 `routes/domains/dev/`(`/dev/receipt-upload`)를 지운다
  - 반려동물 목록(SJM): 모달은 `petNm`과 `vrtyNm`(있으면 "초코 (말티즈)")을 쓴다. `vrtyNm`이 미정 키라 확정되면 확인한다
  - 실패 사유별 문구(FN-AIM-010-07)는 SCR-AIM-010에서 한다. 지금 모달의 실패 3종(`FAILURE`: 추출 0건·15초 초과·API 오류)을 거기서 맞춘다
  - 팀에 알릴 것: SJM에게 `receiptFile.js`를 `src/utils/`로 옮겼다고 PR에 적는다(사전 공지 메시지는 보냄). `common.md` "비동기" 절 추가는 팀 합의 문서라 PR에서 알린다
- 선택: `src/utils/formatDate.js`로 바꿀 수 있는 곳 — `ConversationHeader.jsx`의 `formatDate`는 `formatDate(crtDt)`, `features/expense/shared/expenseFormat.js`의 `formatMonthDay`는 `formatDate(expndYmd, { hasYear: false, separator: '-' })`. 이번에 안 건드렸다
- 범위 밖에서 본 것(말만): `ConversationMessages.jsx`의 `{children && <li>…}`가 항상 참이라 대화 목록 끝에 빈 `<li>`가 생긴다
- 사람이 고치는 문서(SCR-COM-002 반응형): 기능명세서 v0.4 FN-COM-002-23 "햄버거 메뉴 미사용"을 "≤1100px에서 햄버거 사용"으로, FN-COM-002-20 TOP에 "≤760px 미노출"을, FN-COM-006-07 터치 동작의 "반응형 범위 확정 후"를 범위 확정(≤1100px·≤760px)으로. 화면설계서 v0.7 SCR-COM-002 "햄버거[≡]를 두지 않는다", SCR-COM-006 터치(잠정) 문구도 같이
- SCR-COM-002 반응형 남은 것: 실제 대표전화·팩스 번호를 디스코드로 받아 `UserFooter.jsx`의 `TEL_PLACEHOLDER`·`FAX_PLACEHOLDER`에 넣는다. drawer 슬라이드 애니메이션(시안에 있음)·Tab 포커스 가두기는 안 했다. AI 플로팅 버튼의 고양이 이미지(시안 `.fab-ai`, `src/assets/ai-character.png`)는 디자인 담당과 맞춘다
- SCR-AIM-005 연결 남음: 대화 API(Python AI 서버, 담당 없음)로 `features/ai/api.js`의 `sendMessage` 가짜를 바꾸고 `FALLBACK` 판정 필드와 실패 안내 메시지 구분 필드를 Swagger로 확인(`FallbackBubble`을 고르는 `ConversationMessages.jsx`의 문구 비교를 그 필드로 바꾼다). 005-02 새로고침 뒤 실패 안내 문구가 이력에 남는지는 그때 확인한다. 고객센터 버튼은 `/faqs`(SCR-CSC-002, KSJ)가 만들어진 뒤 화면 이동을 확인한다
- SCR-AIM-004 연결 남음: 대화 API(Python AI 서버, 담당 없음)로 `features/ai/api.js`의 `sendMessage` 가짜를 바꾸고 `route`·`aiCnvrsMsgSn` 필드 이름을 Swagger로 확인(`fakeRoutingMap.js`는 지운다). 004-03 새로고침 뒤에도 안내 문구가 이력에 남는지는 그때 확인한다. 본창이 닫혀 있을 때 새 탭으로 여는 `/main`은 라우트가 아직 없다(MAN-001, YAY)
- SCR-AIM-002 연결 남음: 대화 API(Python AI 서버, 담당 없음)로 `features/ai/api.js`의 `streamAnswer` 가짜를 바꾸고 스트리밍 방식(SSE 등)·`rltdShrtcts`·`aiCnvrsMsgCmptnYn` 필드 이름을 Swagger로 확인. 웰컴에 Figma의 고양이 캐릭터를 넣을지(`src/assets/ai-character.png`는 이미 있음)는 디자인 담당과 맞춘다
- SCR-AIM-001 연결 남음: 대화 API(Python AI 서버, 담당 없음)로 `features/ai/api.js`의 `sendMessage` 가짜를 바꾸고 `intent` 필드 이름·값(`REGISTER·ROUTE·SEARCH·FALLBACK`은 추정)을 Swagger로 확인. Figma의 고양이 캐릭터 이미지(`ai-character.png`)는 저장소에 파일이 없어 웰컴에 넣지 못했다(파일을 받으면 `WelcomeMessage.jsx`에 추가). 직접 주소창으로 연 `/ai`에서는 칩을 눌러도 브라우저가 `window.close()`를 막아 창이 남는다(설계대로)
- SCR-AIM-011 연결 남음: 대화 API(Python AI 서버, 담당 없음)로 `features/ai/api.js`의 가짜(`getConversations`·`getConversation`·`deleteConversation`)를 바꾸고 필드 이름(`aiCnvrs…` 추정)을 Swagger로 확인. 011-08 반려동물 목록 API(SJM)로 `AiChatPage.jsx`의 `fakePets`를 `features/pet` 훅으로 바꾼다. 011-03·17④ 세션 만료 시 AI 창 닫기는 로그인 연결 때(SCR-COM-003 003-10과 함께)
- SCR-COM-008 연결 남음: 알림 설정 API(LJS 백엔드, `GET`·`PUT /members/me/notification-settings`)로 `features/notification/api.js`의 설정 가짜를 바꾼다. 008-12 캐릭터 완료 알림을 설정 가능하게 할지는 명세 확정 대기(명세 작성자)
- SCR-COM-004 연결 남음: 알림 API(LJS 백엔드)로 `features/notification/api.js` 가짜를 바꾸고 AIMG02 코드값 확정 뒤 `notiTabs.js`의 가짜 코드를 고친다. 004-08 공동양육 [수락]·[거절]은 응답에 초대 식별자(`jntBrupInvtnSn`)가 있어야 한다(LJS 백엔드·SJM, 백엔드 issues 14번). 004-09 펫돌봄은 채팅방 식별자(`otoChatRoomSn`)로 방을 열어야 한다(SCR-COM-009, KSJ). 시간 표시("10분 전")는 `NotificationSummary`에 수신 일시 필드가 없어 LJS 백엔드에서 추가. 가짜 공지 `mvmnPath`가 `/notices/1`이라 `docs/routes.md` 75행(`/notices`)과 다르다(가짜라 동작 영향 없음)
- SCR-COM-003 연결 남음: 003-08 로그인 상태로 랜딩에 오면 `/main`으로(`useMe` 필요, 로그인 연결 때, YAY). 003-10 AI 대화창이 401이면 인증 오류 표시 후 창 닫기(SCR-AIM-011). 로그인 화면(ACC-002, YAY)은 성공 뒤 `routes/redirect.js`의 `getRedirectPath(location.search)`로 이동 경로를 정한다(YAY에 알릴 것). 테스트 러너가 없어 이 함수의 회귀 테스트가 없다(러너 추가는 의존성이라 팀 결정)
- SCR-COM-005 연결 남음: 005-02 회원 요약 조회 API(LJS 백엔드)로 `getMemberSummary`를 바꾸고 응답 키(`maskedAcntEml`, 명세 기준)를 Swagger로 확인, 005-07 로그아웃 API(YAY)로 `logout`을 바꾼다(로그인 연결 때)
- SCR-COM-007 연결 남음: 007-03 메인 히어로 검색바가 `useAiWindow`의 `open(문장)`을 부르게 연결(YAY, MAN-001). `/ai`가 `?q=`를 새 대화의 첫 메시지로 보내는 일(SCR-AIM-001, 읽기까지는 `AiChatPage.jsx`가 한다). 이미 열린 `/ai` 창에서는 `open(firstMessage)`의 첫 메시지가 무시되므로(`useAiWindow.js` else 분기) 그때 처리 방식을 정한다
- 사람이 고치는 문서 (`?cat` → `?category`):
  - AI매니저 기능명세서 v0.7: FN-AIM-004-10, 「부록_라우팅매핑표」 No.2·3·17~20행, 제.개정내역 새 버전 행
  - AI매니저 화면설계서 v0.9: 부록 라우팅 표의 `?cat=hospital`, `?cat=…` 2곳
- SCR-COM-006 문서 불일치(공통레이아웃): 기능명세서 v0.4 006-03(3열 한 패널)·006-04(건강기록 = 건강 종합·검진기록관리·건강상태관리, 커뮤니티 순서)와 화면설계서 v0.7 SCR-COM-006(같은 내용)이 구현(메뉴별 카드, 건강기록 = 종합 건강기록·건강 일지·케어 캘린더)과 다름. 작성자가 어느 쪽이 맞는지 정해 문서를 고친다. Figma 플레이스 프레임은 없음
- 화면설계서 v0.7 SCR-COM-006의 건강기록 첫 화면 ID `SCR-HLT-001`은 결번이다. `SCR-HLT-011`로 고친다(AI매니저 명세 부록 No.43 기준)
- 범위 밖에서 본 것(말만): 공통레이아웃 기능명세서 FN-COM-004-07의 케어 일정 알림 이동 대상(건강상태관리 정기관리)이 AI매니저 FN-AIM-006-13(케어 캘린더 SCR-HLT-003)과 다름
- SCR-COM-006 연결 남음: 006-07 터치 동작 명세 확정(반응형 범위는 ≤1100px·≤760px로 정해졌다. 명세 작성자가 문구를 갱신하면 구현할 내용을 정한다)
- SCR-COM-002 연결 남음: 002-02 `ProtectedRoute`로 감싸기(로그인 연결 때), 002-06 GNB 대상 페이지를 `UserLayout` 아래 라우트로 붙이기(각 담당), 002-09 알림 미확인 수 API(LJS 백엔드), 002-11 채팅 안 읽은 수 조회 위치를 KSJ와 맞추고 연결(KSJ), 002-15 회원 프로필 이미지, 002-24 세션 만료 토스트(SCR-COM-003과 함께)
