# JAJ 핸드오프

## 지금 하는 것

SCR-HLT-002 건강 일지 (시작 2026-10-21 10:14) — 상태: 끝남 (승인 2026-10-21 10:30, 검증 통과 회차 9, 사람 확인 2026-10-21, 추가-1~17 사람 확인)

기준: 건강기록_기능명세서_v1.0_20261018, 건강기록_화면설계서_v1.0_20261018 (DMS)

디자인: `html/hlt-diary.html`이 최우선(사람 지정 2026-10-21). 시안과 다르게 한 곳은 모두 사람 요청이고 아래 추가 요청에 있다

기능 FN-HLT-002-01·05·06·09·10·11·12·13·14·15~25·26~33 구현과 검증 통과. 기획 줄은 끝나서 지웠다. 기능별 내용은 `milestones/JAJ.md`와 기능명세서

- 가짜 확인용 쿼리(개발 환경만): `?fakePets=1`(반려동물 1마리), `?fakeDaily=0`(일상 기록·관찰 항목·검진기록 0건), `?fakeDaily=1`(일상 기록 종류마다 1건, 관찰 1건 1회차)
- 범위 밖: 영수증 경로 FN-HLT-002-34~46은 `milestones/JAJ.md`의 "SCR-HLT-002 건강 일지 · 영수증 등록" 절로 뺐다. 검진기록 수정·반려동물 변경 시 케어 항목 이동은 SCR-HLT-005에서 연결한다. 검진기록 저장 뒤 이동하는 `/health/checkups/:ckupRcdSn`은 SCR-HLT-005 전이라 빈 화면

새 의존성: 없음

### 추가 요청

| 번호 | 바꿀 파일 | 완료 조건 | 요청 |
| --- | --- | --- | --- |
| 추가-1 | `features/health/diary/TodayRecordCard.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 오늘의 기록 카드의 종류 줄(식사량·음수량·산책·체중·배변상태) 이름 앞에 종류마다 다른 이모지가 나온다 | 요청 2026-10-21 "오늘의 기록 앞에 이모지를 넣어서 구별해주기"(`docs/convention/ui.md`의 이모지 금지보다 사람 요청을 따름) |
| 추가-2 | `features/health/diary/` 아래 화면 파일과 `pages/health/HealthDiaryPage.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 건강 일지의 글자 크기·굵기·색·자간·줄 높이가 `html/hlt-diary.html`과 `html/nyangmung.css`·`hlt.css` 값과 같다 | 요청 2026-10-21 "전체 글자와 자간 등을 html을 기준으로 바꿔" |
| 추가-3 | `features/health/diary/TodayRecordCard.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 오늘의 기록 카드의 종류 줄 앞 이모지가 없고 시안과 같은 Material Symbols 아이콘(식사량 `restaurant`, 음수량 `water_drop`, 산책 `directions_walk`, 체중 `monitor_weight`, 배변상태 `wc`)이 나온다 | 요청 2026-10-21 "기준이 되는 이모지로 넣어야지"(시안에 정해진 이모지가 없음을 알림) → "시안의 Material 아이콘으로 바꿔줘"(추가-1의 이모지를 대체) |
| 추가-4 | `layouts/UserHeader.jsx`·`NotificationDropdown.jsx`·`ProfileDropdown.jsx`(공용 헤더, LJS 작업 파일), `assets/user.svg`(새 파일, `html/assets/user.svg` 복사) | 명령: `yarn -s lint`, `yarn -s build`. 화면: 공통 헤더의 GNB 높이·굵기·간격·현재 메뉴 밑줄 위치, 오른쪽 알림·채팅·프로필·메뉴 아이콘이 `html/nyangmung-com.css`의 `.hd`·`.gnb-menu`·`.hd-btn`·`.hd-profile`과 같다 | 요청 2026-10-21 "공통헤더부분이 다르잖아 같게 변경해줘" |
| 추가-5 | `features/health/diary/TodayRecordCard.jsx`, `AnchorBar.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 반려동물 탭과 앵커 탭 사이 간격이 시안(`.sec-h+.anchor` 36px)과 같고, [오늘 기록추가] 버튼이 시안 `btn-sm`(높이 32px, 옆 여백 12px)이고, 오늘의 기록 종류 줄의 "합계" 글자와 값이 줄마다 같은 세로선에 맞는다 | 요청 2026-10-21 "카드 섹션 부분과 탭 사이 간격 맞추고 오늘의기록세션 버튼의 크기 및 합계부분 라인맞춰서 진행해줘" |
| 추가-6 | `features/health/diary/TodayRecordCard.jsx`·`RecentRecordTable.jsx`·`Card.jsx`(줄 높이)와 `pages/health/HealthDiaryPage.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 오늘의 기록 종류 줄에서 "합계"가 숫자 위에 놓이고 [전체 보기]가 없다, 오늘의 기록·표 글자의 줄 높이가 시안(1.6)과 같고 오늘 상세 종류명 색이 `#1a3234`이다 | 요청 2026-10-21 "합계를 숫자 위로 옮기고 전체보기삭제해 그리고 오늘의 기록 전체 디자인을 html과 맞추라니깐?"(FN-HLT-002-12의 [전체 보기]는 사람 요청으로 뺌, 검증 보고의 줄 높이·종류명 색 지적 포함) |
| 추가-7 | `features/health/diary/` 아래 화면 파일, `pages/health/HealthDiaryPage.jsx`, `features/health/PetTabs.jsx`, `layouts/SideMenu.jsx`, `assets/index.css`(로컬 Pretendard `@font-face`), `assets/fonts/PretendardVariable.woff2`(새 파일, `html/fonts/` 복사) | 명령: `yarn -s lint`, `yarn -s build`. 화면: 건강 일지 안 글꼴(CDN이 막힌 환경에서도 Pretendard)과 글자의 크기·굵기·줄 높이·색이 `html/hlt-diary.html`과 같다(같은 글자를 시안과 나란히 계산 스타일로 대조), 버튼 크기가 시안 `btn-sm`(32px)이다 | 요청 2026-10-21 "전체적인 글자 사이즈 및 폰트가 달라 다시 확인해줘"(추가-5 버튼 크기 실패 포함) |
| 추가-8 | `features/health/diary/RecentRecordTable.jsx`, `ObservationCard.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 최근 건강기록 펼친 상세가 시안 `.dt-grid`처럼 1101px 이상에서 5칸 한 줄(체중·식사량·음수량·산책·배변상태 순), 1100px 이하 3칸, 760px 이하 2칸이고 칸 간격 12px·안쪽 여백 16px이다, 지속 관찰 목록·상세 분할이 시안 `.obs-split`(목록 242px, 간격 20px, 1100px 이하 1열)과 같다 | 요청 2026-10-21 "전체 기록 보는 칸에서 체중 식사량 음수량 기록을 html과 같이 한줄로 보이게 해야지 니맘대로 여백주고 바꾸면 어떡해 맞춰" |
| 추가-9 | `features/health/diary/RecentRecordTable.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 최근 건강기록 날짜 행의 화살표뿐 아니라 행 어느 곳을 눌러도 상세가 펼쳐지고 접힌다(화살표는 키보드용으로 남음) | 요청 2026-10-21 "전체 기록에서 화살표만 눌렀을 때 내용이 펼쳐지는게 아니라 리스트칸 아무곳이나 눌렀을 때 열려야지" |
| 추가-10 | `features/health/diary/RecentRecordTable.jsx`, `CheckupListCard.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 최근 건강기록 카드 제목과 조회기간(7일·14일) 선택의 크기·위치가 시안 `#c-recent` 머리와 같다(선택 128px 폭이 오른쪽 끝, 제목은 왼쪽), 검진기록 조회 연도 선택 폭도 시안 120px이다 | 요청 2026-10-21 "최근 건강기록 제목과 7일 필터하는거 크기 및 위치 html과 맞춰" |
| 추가-11 | `features/health/diary/LineChart.jsx`, `BarChart.jsx`, `DailyTrendCard.jsx`, `ObservationDetail.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 건강기록 변화 그래프가 시안 `nyangmung-chart.js`·`nyangmung-chart.css`와 같다(단조 곡선·연한 그라데이션 영역, 범위 점선 + 오른쪽 둥근 라벨, 왼쪽 눈금 글자, 목표 촘촘한 점선, 최근 값 흰 말풍선, 막대는 연한 색·마지막 진하게·평균 점선) | 요청 2026-10-21 "건강기록변화 전체 차트 디자인 한번 더 확인해서 변경해주고" |
| 추가-12 | `features/health/diaryApi.js`, `features/health/diary/ObservationModal.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 지속 관찰 목록·필름스트립에 반려동물 캐릭터 이미지가 없고 시안처럼 이미지 아이콘 칸이 나온다(사진이 없는 기존 회차는 수정할 때 사진을 다시 요구하지 않음) | 요청 2026-10-21 "지속관찰부분에 왜 캐릭터 이미지를 넣는거야 빼"(가짜 데이터에 넣은 샘플 사진을 뺌) |
| 추가-13 | `features/health/diary/CheckupListCard.jsx`, `features/health/diaryApi.js`(가짜 검진기록 추가), `pages/health/HealthDiaryPage.jsx`, `components/buttonStyles.js`, `features/health/diary/ObservationCard.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 검진기록 리스트가 한 페이지에 10건씩 고정으로 나오고 아래에 시안 `.pager`(페이지 번호·이전/다음) 페이지 나눔이 있다(안쪽 스크롤 없음, 연도·칩·반려동물을 바꾸면 1쪽), 비활성 버튼 색이 시안 `.btn:disabled`와 같고 [관찰 항목 등록]의 테두리 두께가 시안과 같다 | 요청 2026-10-21 "기록추가버튼 색상 맞춰주고 아래 검진기록도 페이지네이션적용하고 고정으로 출력되는 리스트 개수는 10개야"(건수 제한 없는 스크롤 리스트 명세를 사람 요청으로 바꿈) |
| 추가-14 | `features/health/diary/ObservationCard.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 지속 관찰 카드 머리의 [관찰 항목 등록] 버튼이 [오늘 기록추가]와 같은 진한 청록 채운 버튼(높이 32px)이다 | 요청 2026-10-21 "관찰항목 등록버튼 색상변경해야지"(시안 btn-soft와 다르게 사람이 채운 버튼으로 정함) |
| 추가-15 | `features/health/diary/ObservationCard.jsx`, `recordUtils.js` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 회차를 삭제해도 항목이 남으면 같은 항목이 선택된 채 번호가 다시 매겨진다, 식사량·음수량·산책 그래프의 첫 날 합계가 최근 건강기록 표의 그날 합계와 같다 | 사람이 `/verify`를 직접 실행해 나온 실패 지적 2건(회차 삭제 뒤 선택, 그래프 첫 날 합계 잘림) 수정 |
| 추가-16 | `features/health/diary/ObservationDetail.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 사진 없는 필름스트립 칸이 시안 `.ph-box.film-ph`(배경 #f4f6f6, 점선 테두리·선택 시 실선, 52px 이미지 아이콘 아래 16px "n회차" 가운데)와 같다 | 요청 2026-10-21 "필름스트립칸은 시안형태로 가줘"(검증 6회차 지적) |
| 추가-17 | `features/health/diary/ObservationCard.jsx`, `ObservationDetail.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 마지막 항목의 마지막 회차를 지워도 오류 없이 빈 상태 안내가 나온다(삭제 확인 창이 지울 때의 항목 정보를 가진다), 사진 없는 필름스트립 칸의 아이콘·글자 간격(gap 0)과 아이콘 굵기(opsz 24)가 시안과 같다 | 검증 7·8회차 지적 2건 수정 |

## 다음에 할 것

- 연결 남음: 반려동물 목록·프로필(체중 정상범위·목표 포함) `getPets` (SJM), 캐릭터 이미지 조회 (LJS), 케어 완료의 케어미션·포인트 반영 (SJM), 일정·케어·일상 기록·관찰·검진기록 API `features/health/api.js`·`diaryApi.js` 가짜 응답을 실제 호출로 교체 (JAJ 백엔드)
- 사이드 메뉴 "종합 건강기록"(`/health`)은 라우트가 아직 없어 누르면 빈 화면. SCR-HLT-011 작업 때 연결
- 결정 필요: 공용 `ConfirmModal`을 시안 스타일로 맞출지, 우측 아래 플로팅 버튼(시안은 고양이 이미지)을 맞출지(LJS 파일). 앱 전체 본문 줄 높이를 시안 1.6으로 할지(지금은 건강 일지 안에서만 맞춤). 식사량·음수량·산책 그래프의 "최근 14개"를 기록 14건이 걸친 날의 합계로 그렸는데 14일로 바꿀지
- 정리: `features/health/api.js` 주석에 "더보기"라는 옛 표현이 남아 있다(지금은 페이지 나눔). `HealthDiaryPage`의 `PageFrame`이 `CareCalendarPage`와 거의 같아 한 곳으로 합칠 수 있다. 오늘의 기록 아이콘 이름(`restaurant`·`water_drop`·`directions_walk`·`monitor_weight`·`wc`)은 시안에 정해진 것이 없어 내가 골랐다
- 다음 마일스톤: SCR-HLT-005 검진상세(`/start HLT-005`). 영수증 등록은 AIM-008(LJS)·영수증 인식(YAY)·가계부(SJM) 뒤
- 알릴 것(LJS): 공용 `layouts/UserHeader.jsx`·`NotificationDropdown.jsx`·`ProfileDropdown.jsx`를 시안 기준으로 수정(Material 아이콘, 새 `headerStyles.js`·`assets/user.svg`), `Card`·`buttonStyles`·`SideMenu`·`PetTabs` 줄 높이·색·비활성 스타일 수정, 로컬 Pretendard 글꼴 추가(`assets/fonts/PretendardVariable.woff2` 약 2MB, `index.css` `@font-face`), `eslint.config.js`에 `html` 제외
- 채팅 아이콘의 안 읽은 수 배지는 KSJ 채팅 API 연결 전이라 숨김
