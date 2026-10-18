# LJS 핸드오프

## 지금 하는 것

SCR-COM-002 기본 레이아웃 (시작 2026-10-17 14:57) — 상태: 끝 (검증 `확인 못 함 있음` 회차 2, 사람 확인 2026-10-18)

### 기획

기준: 공통레이아웃_기능명세서_v0.4_20261001, 공통레이아웃_화면설계서_v0.7_20261001
디자인: Figma 노드 265:3463, `.cache/figma/SCR-COM-002__265-3463.png`
로그인 연결 때 `ProtectedRoute`로 감쌀 화면: `UserLayout` 아래 전부(랜딩 제외)

- FN-COM-002-01 공통 골격: `layouts/UserLayout.jsx`(헤더+`<Outlet/>`+푸터+플로팅), `layouts/UserHeader.jsx`, `layouts/UserFooter.jsx`, `layouts/FloatingButtons.jsx` 신설. 화면: `/`에서 헤더·본문·푸터·플로팅이 보인다
- FN-COM-002-02 로그인 필수: 이번엔 코드 없음(로그인 전 `ProtectedRoute` 금지). 연결 남음 → 다음에 할 것
- FN-COM-002-03 헤더 고정: `UserHeader.jsx` sticky·h-16. 화면: 스크롤해도 헤더가 위에 있고 높이 64px
- FN-COM-002-04 로고 이동: `UserHeader.jsx`, `routes/paths.js`에 `MAIN`(SCR-MAN-001) 추가. 화면: 로고 클릭 시 URL이 메인 경로로 바뀐다
- FN-COM-002-05 GNB 3개: `UserHeader.jsx`. 화면: 건강기록·플레이스·커뮤니티 3개만 보인다
- FN-COM-002-06 현재 메뉴 표시: `UserHeader.jsx`(`NavLink`의 active). 화면: 현재 경로 메뉴가 굵게+하단 2px 선
- FN-COM-002-07 GNB 첫 화면: `paths.js`에 건강 종합(SCR-HLT-011)·플레이스 병원 탭(SCR-HOS-001 ?cat=hospital)·펫이야기(SCR-CMU-001-01) 경로 추가. 화면: 클릭 시 URL이 바뀐다(페이지는 각 담당이 만든다)
- FN-COM-002-08 GNB 호버: `UserHeader.jsx`에서 호버 시 빈 2차 메뉴 패널 열기. 내용·지연은 SCR-COM-006. 화면: 호버 시 패널이 열린다
- FN-COM-002-09 알림 배지: `components/CountBadge.jsx`(0 숨김, 99 초과 `99+`), `features/notification/api.js`·`queries.js`에 미확인 수 조회. API YAY — 가짜 응답으로 먼저 만들고 나중에 연결(가짜는 `features/notification/api.js`). 화면: 가짜 3 → `3`, 가짜 0 → 배지 없음, 가짜 120 → `99+`
- FN-COM-002-10 알림 드롭다운 열기: `UserHeader.jsx`에서 빈 패널 열기. 내용은 SCR-COM-004. 화면: 아이콘 클릭 시 패널이 열린다
- FN-COM-002-11 채팅 아이콘·배지: `UserHeader.jsx`에서 `CountBadge.jsx` 재사용. 안 읽은 수 조회(KSJ)는 `features/chat/`을 만들지 않고 연결 남음 — 지금은 숫자 0(배지 숨김). 화면: 채팅 아이콘이 보이고 배지는 없다
- FN-COM-002-12 채팅 모달 열기: `context/ChatModalContext.jsx`에 열림 상태만 둔다. 모달 셸은 SCR-COM-009·KSJ. 화면: 아이콘 클릭 시 열림 상태가 바뀐다(열린 드롭다운이 닫힘으로 확인)
- FN-COM-002-13 배지 독립: 알림·채팅 숫자를 각각 따로 `CountBadge`에 넘긴다(합산 코드 없음). 화면: 알림 가짜 3이면 알림 아이콘에만 `3`, 채팅 아이콘엔 배지가 없다
- FN-COM-002-14 아이콘 순서: `UserHeader.jsx`. 화면: 좌→우 알림·채팅·프로필
- FN-COM-002-15 프로필 아이콘: `UserHeader.jsx`, 기본 이미지는 lucide 아이콘. 회원 이미지는 회원 요약 조회(LJS 백엔드) 연결 때. 화면: 기본 이미지가 보이고 클릭 시 빈 프로필 패널이 열린다
- FN-COM-002-16 드롭다운 단일 노출: `UserHeader.jsx`에 열린 드롭다운 하나만 담는 상태(`gnb`·`notification`·`profile`·없음). 화면: 프로필을 연 채 알림을 누르면 프로필이 닫히고 알림이 열린다
- FN-COM-002-17 채팅 모달과 드롭다운: 채팅 아이콘 클릭 시 열린 드롭다운을 닫는다. 화면: 알림을 연 채 채팅 아이콘을 누르면 알림이 닫힌다
- FN-COM-002-18 푸터 링크: `UserFooter.jsx`, `paths.js`에 공지 목록(SCR-CSC-001)·FAQ 목록(SCR-CSC-002-01) 추가. 화면: 클릭 시 URL이 바뀐다
- FN-COM-002-19 플로팅 AI: `FloatingButtons.jsx`에 [AI] 버튼(점선 테두리). 새 창 열기는 SCR-COM-007. 화면: 버튼이 보인다
- FN-COM-002-20 플로팅 TOP: `FloatingButtons.jsx`. 화면: 스크롤 후 클릭 시 최상단으로 간다
- FN-COM-002-21 플로팅 위치 고정: `FloatingButtons.jsx` fixed 우측 하단. 지도 페이지 조정은 PLC 몫. 화면: 스크롤해도 우측 하단에 있다
- FN-COM-002-22 브레드크럼 미사용: 만들지 않는다. 화면: 브레드크럼이 없다
- FN-COM-002-23 햄버거 미사용: 만들지 않는다. 화면: 헤더 우측에 [≡]가 없다
- FN-COM-002-24 세션 만료: API AIC. 이번엔 코드 없음 — 만료 토스트는 `api/axios.js`의 랜딩 이동과 함께 바꿔야 해서 SCR-COM-003과 함께. 연결 남음 → 다음에 할 것
- 공통 완료 조건 — 명령: `yarn -s lint`, `yarn -s build` 종료 코드 0

새 의존성: 없음

질문:
1. `features/chat/`은 KSJ 화면 도메인이다. 헤더 배지용 안 읽은 수 조회(가짜 응답) 하나 때문에 이 폴더를 먼저 만들어도 되는가? 아니면 KSJ와 먼저 맞추는가?
2. `routes/paths.js`에 다른 도메인 경로(메인, 건강 종합, 플레이스 병원 탭, 펫이야기, 공지 목록, FAQ 목록)를 각 도메인 구획 안에 한 줄씩 추가해도 되는가?
추천안: 1은 만든다(조회 함수 2개뿐이고 KSJ가 실제 API를 붙일 때 같은 파일을 덮어쓴다), 2는 추가한다(GNB·푸터가 이 경로 없이는 링크를 못 건다).
결정: 1. KSJ와 먼저 맞춘다 → `features/chat/`을 만들지 않는다. 채팅 배지는 숫자를 props로 받기만 하고, 조회 연결은 KSJ와 맞춘 뒤(연결 남음). 2. 추가한다.

### 추가 요청

| 추가-1 | `index.html`, `src/assets/index.css` | 명령: `yarn -s lint`, `yarn -s build` 종료 코드 0 | 요청 2026-10-18 15:08 "Pretendard 폰트 적용을 이 마일스톤에 포함" |
| 추가-2 | `src/layouts/UserFooter.jsx`, `src/routes/paths.js` | 명령: `yarn -s lint`, `yarn -s build` 종료 코드 0 / 화면: 푸터 [1:1 문의] 클릭 시 URL이 `/inquiries`로 바뀐다 | 요청 2026-10-18 15:14 "푸터 1:1 문의 링크를 남긴다" |

## 다음에 할 것

- SCR-COM-002 연결 남음: 002-02 `ProtectedRoute`로 감싸기(로그인 연결 때), 002-06 GNB 대상 페이지를 `UserLayout` 아래 라우트로 붙이기(각 담당), 002-09 알림 미확인 수 API(YAY), 002-11 채팅 안 읽은 수 조회 위치를 KSJ와 맞추고 연결(KSJ), 002-15 회원 프로필 이미지, 002-24 세션 만료 토스트(SCR-COM-003과 함께)
