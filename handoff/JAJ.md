# JAJ 핸드오프

## 지금 하는 것

SCR-HLT-003 케어 캘린더 (시작 2026-10-19) — 상태: 끝남 (승인 2026-10-19 10:14, 사람 확인 2026-10-19)

기준: 건강기록_기능명세서_v1.0_20261014, 건강기록_화면설계서_v1.0_20261014 (DMS)

디자인: 없음, 화면설계서 기준 (`.env.local`에 `FIGMA_TOKEN` 없음)

### 기획

URL은 `PATHS.HEALTH_CALENDAR`(`/health/calendar`, 이미 있음). `routes/AppRoutes.jsx`의 health 구획에 `UserLayout` 아래로 붙인다. 로그인 구현 전이라 `ProtectedRoute`로 감싸지 않는다.

API는 모두 아직 없다. 일정·케어 항목은 내 백엔드(JAJ), 반려동물 목록·캐릭터는 남의 것이다. 전부 `features/health/api.js`에 가짜 응답으로 먼저 만들고 나중에 연결한다. 필드 이름은 ERD 약어 기준 가안(`schdlSn`, `petSn`, `careItemSn` 등)이고 백엔드 DTO가 나오면 맞춘다. 가짜는 메모리 배열이라 새로고침하면 처음 상태로 돌아간다.

- 화면 뼈대: `pages/health/CareCalendarPage.jsx`(제목·설명, 위에서 아래로 캘린더 카드 → 반려동물 탭 → 토탈 케어리스트). `features/health/queries.js`에 `healthKeys`와 훅
- 날짜 공통: `utils/formatDate.js`(새 파일, 구현 전 사람 승인 2026-10-19). `"2026-10-12"` 문자열을 날짜로 읽기·더하기·차이·표시("8월 12일(수)", "오전 10:00")를 한곳에 둔다. 컴포넌트에서 `new Date()`로 직접 바꾸지 않는다(`docs/convention/api.md` 날짜와 시간)
- 기능 FN-HLT-003-29·30·31·39·40·01·12·13·37·34·32·35·36·33·21·22·23·24·38 구현과 검증 통과(`/verify` 2026-10-19). 기획 줄은 끝나서 지웠다. 기능별 내용은 `milestones/JAJ.md`와 기능명세서

- 완료 조건 — 명령: `yarn -s lint`, `yarn -s build`
- 가짜 확인용 쿼리(개발 환경만): `?fakePets=1`(반려동물 1마리), `?fakeSchedules=0`(일정 0건), `?fakeRecords=0`(완료 기록 0건)
- 연결은 "다음에 할 것"에 남긴다: 반려동물 목록(SJM), 캐릭터 이미지(LJS), 케어 완료의 케어미션·포인트 반영(SJM), 일정·케어 API(JAJ 백엔드)
- 범위 밖: [검진기록 없음] 뱃지를 누르면 열리는 검진기록 등록 모달은 SCR-HLT-002라 이번에는 뱃지만 표시한다

새 의존성: 없음

### 추가 요청

| 번호 | 바꿀 파일 | 완료 조건 | 요청 |
| --- | --- | --- | --- |
| 추가-1 | `index.html`(Material Symbols Rounded 글꼴), `assets/index.css`(`.icon`), `components/Icon.jsx`(새 파일), `features/health/scheduleTypes.js`·`api.js`·`CareTile.jsx`·`CareRecordList.jsx`·`CareItemModal.jsx`·`UpcomingSchedules.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 케어 타일·기록 내용·다가오는 일정·관리 항목 추가 모달에 이모지 없이 `html/hlt-calendar.html`과 같은 Material Symbols 아이콘(예: 귀 청소 `hearing`, 양치 `dentistry`, 예방접종 `vaccines`)이 나오고, 관리 항목 추가의 "기타"는 이모지 입력칸 없이 기본 아이콘 `task_alt`, ★ 메인 표시도 `star` 아이콘 | 요청 2026-10-19 10:52 "html 폴더의 hlt-calendar.html이 최신 정본이니 이 기준으로 이모지를 고치고, 기존 이모지는 쓰지 말 것" |
| 추가-2 | `eslint.config.js`(`globalIgnores`에 `html` 추가) | 명령: `yarn -s lint`가 `html/` 퍼블리싱 JS를 검사하지 않고 0으로 끝난다 | 요청 2026-10-19 11:00 "ESLint에서 html 제외"(html/ 때문에 lint 실패, 사람이 고름) |
| 추가-3 | `components/Card.jsx`(새 파일), `pages/health/CareCalendarPage.jsx`, `features/health/MonthCalendar.jsx`·`PetFilterChips.jsx`·`ScheduleDayDetail.jsx`·`UpcomingSchedules.jsx`·`PetTabs.jsx`·`CareList.jsx`·`CareTile.jsx`·`CareRecordList.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 레이아웃이 `html/hlt-calendar.html`과 같다 — 위쪽은 왼쪽 캘린더 카드(제목·‹ ›·필터·달력)와 오른쪽 날짜 상세 카드·다가오는 일정 카드 2열(좁으면 1열), 아래는 반려동물 탭 칩 → 토탈 케어리스트 카드(정기관리 → 일상관리 순 2열 목록, 기록 내용) | 요청 2026-10-19 11:11 "현재 레이아웃 구성을 html 폴더의 hlt-calendar.html 기준으로 수정" |
| 추가-4 | `layouts/SideMenu.jsx`(새 파일), `components/Badge.jsx`(새 파일), `pages/health/CareCalendarPage.jsx`, `features/health/CareTile.jsx`·`ScheduleDayDetail.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 1101px 이상에서 왼쪽에 건강기록 사이드 메뉴(종합 건강기록·건강 일지·케어 캘린더, 현재 화면 강조)가 나오고 본문이 그 오른쪽에 온다, 뱃지 높이 24px·안쪽 여백이 `html/nyangmung.css`의 `.badge`와 같다, 이후 CSS 값은 html 기준 | 요청 2026-10-19 11:25 "사이드메뉴 누락, 뱃지 패딩이 기준과 다름, css 기준은 html에 맞춰서" |
| 추가-5 | `assets/head_hlt.svg`(새 파일, `html/assets/pixel/head-hlt.svg` 복사), `pages/health/CareCalendarPage.jsx`, `features/health/PetFilterChips.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 제목 줄 오른쪽에 건강기록 픽셀 그림이 나온다(1100px 이하 0.8배, 760px 이하 숨김), 경로 "건강기록 › 케어 캘린더"의 글자·화살표 간격이 시안과 같다, 캘린더 안 반려동물 칩 크기가 시안 `.chip`(높이 36px, 옆 여백 14px, 글자 16px)과 같다 | 요청 2026-10-19 11:45 "브레드크럼 단어 사이 패딩·마진, 캘린더 안 반려동물 칩 사이즈, 우측 상단 그림이 빠져 있다. 우측 최상단 채팅 모양도"(채팅 아이콘은 LJS의 헤더라 이번에 안 고침) |
| 추가-6 | `layouts/UserHeader.jsx`(공용 헤더, LJS 작업 파일), `features/health/MonthCalendar.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: GNB 글자 굵기·높이·간격·밑줄 위치와 채팅 아이콘이 `html/nyangmung-com.css`의 `.gnb-menu`·`.hd-btn`과 같다, 캘린더 날짜 칸은 일정 2건까지만 보이고 그 이상은 "…"로 줄여 칸 높이가 고정된다 | 요청 2026-10-19 11:55 "네비바 글자 사이즈, 우측 최상단 채팅 모양, 캘린더 일정은 2개만 보여주고 그 이상은 ...으로 달력 크기 고정, 나머지는 html에 맞춰서" |
| 추가-7 | `features/health/scheduleTypes.js`(톤 색 표), `MonthCalendar.jsx`, `ScheduleDayDetail.jsx`, `UpcomingSchedules.jsx`, `ScheduleModal.jsx`, `components/Badge.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 달력 태그·상세 색 막대·다가오는 일정 아이콘이 시안 톤 색(연한 바탕 + 진한 글자, 6색)이고, 검진기록 뱃지가 시안(`badge-ok` 초록 점 / `badge-outline`)과 같고, 일정 등록·수정 모달이 시안 `.pm`(머리 아이콘·입력칸·구분 버튼·색 견본·하단 줄)과 같다 | 요청 2026-10-19 12:05 "달력 안 글자 및 색상, 다가오는 일정, 일정 등록도 html에 맞춰서" |
| 추가-8 | `layouts/UserHeader.jsx`(공용 헤더), `features/health/MonthCalendar.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 채팅 아이콘이 시안 `.hd-btn .icon`(24px, opsz 24)과 같고, 날짜 칸 높이가 시안(일정 2건이 찬 칸 112px)과 같다 | 요청 2026-10-19 12:25 "우측상단 채팅아이콘 크기, 캘린더 칸 크기 html과 맞춰" |
| 추가-9 | `features/health/MonthCalendar.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 날짜 칸 높이가 모든 폭에서 80px로 고정이다, 일정은 한 줄 태그 2건까지 보이고 3건 이상이면 날짜 옆에 …가 나온다, 태그에는 반려동물 이름만 보이고 "나비 · 정기검진" 전체는 마우스를 올리면(title)·스크린리더로 나온다(색은 종류 톤) | 요청 2026-10-19 12:40 "달력 칸 80 고정, 절충안(태그를 한 줄로 하되 반려동물 이름만)으로 고쳐줘" (추가-8의 칸 높이 112px를 대체) |
| 추가-10 | `features/health/MonthCalendar.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 달력 일정 태그가 한 줄이고 "나비 · 정기검진"처럼 이름 · 종류가 함께 보이며 칸보다 길면 …로 잘린다, 칸 높이 80px와 2건 표시는 그대로다 | 요청 2026-10-19 "캘린더에 일정을 표시할 때 한줄태그로 바꿔줘" (추가-9의 이름만 표시를 대체) |
| 추가-11 | `features/health/MonthCalendar.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 날짜 칸에 일정 태그는 1건만 보이고 2건 이상이면 날짜 옆에 …가 나온다, 태그는 두 줄(1줄 반려동물 이름, 2줄 종류)이다, 칸 높이 80px는 그대로다 | 요청 2026-10-19 "일정은 하나만 보이게 하고 더 있으면 ...표시해줘 두줄로 바꿔주고" (추가-9의 2건 표시, 추가-10의 한 줄 태그를 대체) |
| 추가-12 | `features/health/MonthCalendar.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 일정이 2건 이상인 칸은 날짜 옆에 나머지 일정의 종류 색 점(최대 3개)과 `+n`이 나온다, `…`는 없다, 칸 높이 80px는 그대로다 | 요청 2026-10-19 "A+C 조합으로 적용해줘" (추가-11의 …를 대체, 시안에 없는 표시) |
| 추가-13 | `features/health/MonthCalendar.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 일정이 2건 이상인 칸에는 날짜 옆에 `+n`만 나오고 색 점은 없다 | 요청 2026-10-19 "색점줄은 빼" (추가-12의 색 점을 제외) |

## 다음에 할 것

- 연결 남음: 반려동물 목록·프로필 조회 `getPets` (SJM), 캐릭터 이미지 조회 (LJS), 케어 완료의 케어미션·포인트 반영 (SJM), 일정·케어 API `features/health/api.js` 가짜 응답을 실제 호출로 교체 (JAJ 백엔드)
- 사이드 메뉴 "종합 건강기록"(`/health`)·"건강 일지"(`/health/diary`)는 라우트가 아직 없어 누르면 빈 화면. 해당 화면 작업 때 연결
- 결정 필요: `CareItemModal`·공용 `ConfirmModal`을 시안 스타일로 맞출지, 우측 아래 플로팅 버튼(시안은 고양이 이미지)을 맞출지(LJS 파일)
- 채팅 아이콘의 안 읽은 수 배지는 KSJ 채팅 API 연결 전이라 숨김
- 다음 마일스톤: SCR-HLT-002 건강 일지(`/start HLT-002`)
- 알릴 것(LJS): 공용 `layouts/UserHeader.jsx` 수정, `eslint.config.js`에 `html` 제외, 새 공용 컴포넌트 `Card`·`Badge`·`Icon`·`SideMenu`
