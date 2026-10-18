# LJS 핸드오프

## 지금 하는 것

SCR-COM-006 GNB 2차 메뉴 드롭다운 (시작 2026-10-18 15:28) — 상태: 끝 (검증 `통과`, 사람 확인 2026-10-18). 구현은 Figma 기준(메뉴별 카드)이라 명세 006-03·004·화면설계서와 다름. 006-07 터치는 연결 남음

### 이번 세션에 끝낸 것 (플레이스 쿼리 값·키 수정, 2026-10-18 16:19~)

- 플레이스 2차 메뉴 링크 값을 AI매니저 명세 부록·`docs/routes.md`에 맞춤: 용품 `supplies` → `goods`, 동반 `companion` → `pet-friendly` (`src/layouts/gnbMenus.js`)
- 쿼리 키를 `cat` → `category`로 변경 (`gnbMenus.js`, `docs/routes.md` 15·40행). 결정: 헷갈리지 않게 `category`로 쓴다
- 결정: URL 구조(`/places` 하나에 쿼리로 탭을 구분할지)는 AIC 답이 올 때까지 그대로 둔다. 플레이스 기능명세서 v0.5·화면설계서 v0.7에는 쿼리 파라미터 정의가 없고, 탭마다 화면 ID(SCR-HOS-001, SCR-PLC-001~004)가 따로 있다
- 검증: `yarn -s lint` 0, `yarn -s build` 0, `grep -rn "cat=" src docs` 0줄, 판정 `통과`(회차 1)

### 추가 요청 (플레이스 쿼리 값·키 수정)

| 추가-1 | `src/layouts/gnbMenus.js`, `docs/routes.md` | 명령: `yarn -s lint`, `yarn -s build` 종료 코드 0, `grep -rn "cat=" src docs` 결과 0줄 / 화면: 용품 → `/places?category=goods`, 동반 → `/places?category=pet-friendly` | 요청 2026-10-18 16:27 "쿼리 키를 헷갈리지 않게 category로 수정하자" |

## 다음에 할 것

- 플레이스 URL 구조 확인(AIC, HOS-001): 5개 화면을 `/places?category=…` 하나로 만들지, 탭마다 별도 URL로 할지. 답에 따라 `gnbMenus.js`와 `docs/routes.md`의 해당 값을 같이 고친다
- 사람이 고치는 문서 (`?cat` → `?category`):
  - AI매니저 기능명세서 v0.7: FN-AIM-004-10, 「부록_라우팅매핑표」 No.2·3·17~20행, 제.개정내역 새 버전 행
  - AI매니저 화면설계서 v0.9: 부록 라우팅 표의 `?cat=hospital`, `?cat=…` 2곳
- SCR-COM-006 문서 불일치(공통레이아웃): 기능명세서 v0.4 006-03(3열 한 패널)·006-04(건강기록 = 건강 종합·검진기록관리·건강상태관리, 커뮤니티 순서)와 화면설계서 v0.7 SCR-COM-006(같은 내용)이 구현(메뉴별 카드, 건강기록 = 종합 건강기록·건강 일지·케어 캘린더)과 다름. 작성자가 어느 쪽이 맞는지 정해 문서를 고친다. Figma 플레이스 프레임은 없음
- 화면설계서 v0.7 SCR-COM-006의 건강기록 첫 화면 ID `SCR-HLT-001`은 결번이다. `SCR-HLT-011`로 고친다(AI매니저 명세 부록 No.43 기준)
- 범위 밖에서 본 것(말만): 공통레이아웃 기능명세서 FN-COM-004-07의 케어 일정 알림 이동 대상(건강상태관리 정기관리)이 AI매니저 FN-AIM-006-13(케어 캘린더 SCR-HLT-003)과 다름
- SCR-COM-006 연결 남음: 006-07 터치 동작 명세 확정(반응형 범위 확정 후, 명세 작성자)
- SCR-COM-002 연결 남음: 002-02 `ProtectedRoute`로 감싸기(로그인 연결 때), 002-06 GNB 대상 페이지를 `UserLayout` 아래 라우트로 붙이기(각 담당), 002-09 알림 미확인 수 API(YAY), 002-11 채팅 안 읽은 수 조회 위치를 KSJ와 맞추고 연결(KSJ), 002-15 회원 프로필 이미지, 002-24 세션 만료 토스트(SCR-COM-003과 함께)
