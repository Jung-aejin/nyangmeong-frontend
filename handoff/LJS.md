# LJS 핸드오프

## 지금 하는 것

SCR-COM-005 프로필 드롭다운 (시작 2026-10-18 17:06) — 상태: 끝 (검증 `통과` 2번째 검증, 사람 확인 2026-10-18). 연결 남음은 "다음에 할 것"

- 만든 것: `layouts/ProfileDropdown.jsx`(토글·바깥 클릭·ESC·메뉴 4개·로그아웃), `components/ConfirmModal.jsx`(`<dialog>` + `showModal()`), `features/member`(`getMemberSummary`·`logout` 가짜, `useMemberSummary`·`useLogout`), `hooks/useAiWindow.js`(`closeAiWindow`, 이름으로 찾아 닫음), `routes/paths.js`(`MYPAGE`, `SETTINGS_NOTIFICATIONS`), `UserHeader.jsx`(프로필 자리 교체)
- 결정: 로그아웃 확인 = 확인 모달, AI 창 닫기 = 이름으로 찾기(본창을 새로고침해도 찾는다), 가짜 요약 필드 `mbrNcnm`(ERD 확인)·`acntEml`(추정)
- 추가 요청(모두 통과): 추가-1 `showModal`로 교체, 추가-2 `src/` 영어 주석을 한글로(저장소 컨벤션), 추가-3 모달을 닫은 뒤 포커스를 프로필 아이콘으로 복귀(배경 클릭은 `ConfirmModal.jsx` `handleMouseDown`의 `preventDefault`)
- 검증: `yarn -s lint` 0, `yarn -s build` 0, 판정 `통과`
- COM 남은 순서("COM 먼저 다 마무리"): 003 → 004 → 008 → 009. SCR-AIM-011은 기획을 지우고 `대기`로 되돌렸다

이전 작업: SCR-COM-007 AI 매니저 진입 — 끝(히어로 연결 남음). 서로 다른 본창 탭에서 같은 AI 창을 쓰는지는 실측 후 정한다
이전 작업: SCR-COM-006 GNB 2차 메뉴 — 끝. 구현은 Figma 기준(메뉴별 카드)이라 명세 006-03·004·화면설계서와 다름. 플레이스 링크는 `/places?category=…`(용품 `goods`, 동반 `pet-friendly`)

## 다음에 할 것

- SCR-COM-005 연결 남음: 005-02 회원 요약 조회 API(LJS 백엔드)로 `getMemberSummary`를 바꾸고 응답 키(`acntEml`은 추정)를 Swagger로 확인, 005-07 로그아웃 API(AIC)로 `logout`을 바꾼다(로그인 연결 때). 005-08 채팅 모달 닫기는 SCR-COM-009에서 화면으로 확인(KSJ)
- SCR-COM-007 연결 남음: 007-03 메인 히어로 검색바가 `useAiWindow`의 `open(문장)`을 부르게 연결(YAY, MAN-001). `/ai`에서 `?q=`를 새 대화의 첫 메시지로 보내는 일(SCR-AIM-011). 이미 열린 `/ai` 창에서는 `open(firstMessage)`의 첫 메시지가 무시되므로(`useAiWindow.js` else 분기) 그때 처리 방식을 정한다
- 플레이스 URL 구조 확인(AIC, HOS-001): 5개 화면을 `/places?category=…` 하나로 만들지, 탭마다 별도 URL로 할지. 답에 따라 `gnbMenus.js`와 `docs/routes.md`의 해당 값을 같이 고친다
- 사람이 고치는 문서 (`?cat` → `?category`):
  - AI매니저 기능명세서 v0.7: FN-AIM-004-10, 「부록_라우팅매핑표」 No.2·3·17~20행, 제.개정내역 새 버전 행
  - AI매니저 화면설계서 v0.9: 부록 라우팅 표의 `?cat=hospital`, `?cat=…` 2곳
- SCR-COM-006 문서 불일치(공통레이아웃): 기능명세서 v0.4 006-03(3열 한 패널)·006-04(건강기록 = 건강 종합·검진기록관리·건강상태관리, 커뮤니티 순서)와 화면설계서 v0.7 SCR-COM-006(같은 내용)이 구현(메뉴별 카드, 건강기록 = 종합 건강기록·건강 일지·케어 캘린더)과 다름. 작성자가 어느 쪽이 맞는지 정해 문서를 고친다. Figma 플레이스 프레임은 없음
- 화면설계서 v0.7 SCR-COM-006의 건강기록 첫 화면 ID `SCR-HLT-001`은 결번이다. `SCR-HLT-011`로 고친다(AI매니저 명세 부록 No.43 기준)
- 범위 밖에서 본 것(말만): 공통레이아웃 기능명세서 FN-COM-004-07의 케어 일정 알림 이동 대상(건강상태관리 정기관리)이 AI매니저 FN-AIM-006-13(케어 캘린더 SCR-HLT-003)과 다름
- SCR-COM-006 연결 남음: 006-07 터치 동작 명세 확정(반응형 범위 확정 후, 명세 작성자)
- SCR-COM-002 연결 남음: 002-02 `ProtectedRoute`로 감싸기(로그인 연결 때), 002-06 GNB 대상 페이지를 `UserLayout` 아래 라우트로 붙이기(각 담당), 002-09 알림 미확인 수 API(YAY), 002-11 채팅 안 읽은 수 조회 위치를 KSJ와 맞추고 연결(KSJ), 002-15 회원 프로필 이미지, 002-24 세션 만료 토스트(SCR-COM-003과 함께)
