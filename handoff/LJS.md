# LJS 핸드오프

## 지금 하는 것

SCR-COM-002 이동 시 스크롤 맨 위로 · 공용 로딩 스켈레톤 (2026-10-22 시작) — 상태: 구현 중 (승인 2026-10-22 10:37)

배경(조사, dev 서버에서 재현): ① `BrowserRouter` + `useRoutes` 구조라 `<ScrollRestoration>`을 못 쓰고, 경로를 바꿔도 스크롤을 올리는 코드가 없다. `/main` 하단에서 푸터 공지사항·자주하는 질문·1:1 문의를 누르면 새 페이지 맨 아래에 그대로 있다(1280px: 1296 → 757·888·799). 모든 `Link`·`navigate` 이동이 같다. ② 첫 진입은 캐시가 없어 "불러오는 중이에요" 문구가 한 프레임 이상 그려졌다가 내용으로 바뀌고 페이지 높이도 출렁인다. 두 번째부터는 캐시라 안 깜빡인다. lazy·`Suspense`는 원인이 아니다(RR 7.18 `BrowserRouter`가 이동을 `startTransition`으로 처리)

- 결정(사람): 스크롤은 경로가 바뀌면 맨 위로, 뒤로·앞으로 가기는 제외. 깜빡임은 공용 스켈레톤 컴포넌트로
- 디자인: 없음(Figma 토큰 없음, `html/`에 SCR-COM-002 없음). 스켈레톤은 시안이 없어 이미 쓰는 색(`#e2e7e7`·`#f4f6f6` 계열)과 둥글림만 쓰고, 기본 `animate-pulse` 외 효과를 넣지 않는다
- S-01 스크롤 맨 위로: 새 `layouts/ScrollToTop.jsx`(`useLocation().pathname`이 바뀌고 `useNavigationType() !== 'POP'`이면 `window.scrollTo(0, 0)`, 렌더 없음)를 `UserLayout`·`AdminLayout`에 둔다. `AppRoutes.jsx`는 고정 파일이라 건드리지 않는다. bare 화면(채팅·AI 새 창, 인증)은 한 화면 창이거나 짧아 넣지 않는다. 쿼리스트링만 바뀌는 이동(목록 쪽 번호·검색)은 그대로 둔다
  - 완료 조건 — 화면: 1280px `/main` 맨 아래에서 푸터 공지사항·자주하는 질문·1:1 문의를 누르면 각 페이지의 `scrollY`가 0이다 / 헤더 GNB로 이동해도 0이다 / 공지 목록을 내려 상세로 간 뒤 브라우저 뒤로가기를 하면 목록의 원래 위치 근처로 돌아간다(브라우저 복원, 0으로 강제하지 않음) / 공지 목록에서 쪽 번호를 눌러도 `ScrollToTop`은 스크롤을 건드리지 않는다(게시판 쪽 번호의 맨 위 이동은 추가-1이 `BoardPagination`에서 함)
- S-02 공용 스켈레톤 두 개(원시값 props만, 도메인 모름). 화면을 가리는 장식이라 막대는 `aria-hidden`, 감싸는 쪽에 `aria-busy="true"`
  - `components/Skeleton.jsx`: 막대 하나 또는 여러 줄. props `className`(크기·모양은 Tailwind, 예: `h-5 w-40`), `lines`(여러 줄, 마지막 줄은 짧게). 페이지 안 한 구역(목록·카드·모달·사이드바)에 쓴다
  - `components/PageSkeleton.jsx`: 페이지 본문 기본형. 위에 짧은 막대 한 줄 + 목록 행 `rows`개(기본 5). 페이지 본문 전체를 대신하던 로딩 분기에 쓴다
  - 완료 조건 — 명령: `yarn -s lint`, `yarn -s build`
- S-03 전체 교체(남의 담당 파일 포함, 로딩 분기 한 줄만 바꾼다. 다른 줄은 건드리지 않는다): 본문 전체를 대신하던 곳은 `PageSkeleton`, 페이지 안 한 구역은 `Skeleton`
  - "불러오는 중이에요" 문구: 고객센터 `NoticeListPage`·`NoticeDetailPage`·`FaqListPage`·`InquiryListPage`(`isPending`·`isFetching` 둘)·`InquiryDetailPage`·`InquiryEditPage`(KSJ) / 건강기록 `HealthSummaryPage`(2)·`HealthDiaryPage`(2)·`CheckupDetailPage`·`CareCalendarPage`·`LabInputPage`·`features/health/CareList`·`features/health/diary/ReceiptResultStep`(JAJ) / `NotificationSettingsPage`·`ChatRoomList`·`ChatConversation`·`AddressShareModal`·`ConversationSidebar`(LJS)
  - 아무것도 안 그리다 튀어나오던 곳(`return null`·`isPending ? null`): `CheckupListCard`·`ObservationCard`(JAJ), `PetListPage`·`FamilySection`·`SentInvitations`·`InvitationAccept`(SJM) → `Skeleton`
  - 완료 조건 — 화면: `grep -rn "불러오는 중이에요" src`가 `PlaceMap`의 "지도를 불러오는 중이에요"만 남긴다 / 가짜 API 지연을 잠시 늘려(되돌린다) Playwright로 공지 목록·FAQ·건강 일지·알림 설정·채팅 목록의 로딩 상태를 캡처하면 문구 대신 스켈레톤이 보이고, 내용이 뜰 때 위쪽 요소가 크게 밀리지 않는다 / 1440·390px에서 가로 스크롤이 없다 / 캐시가 있는 두 번째 진입은 스켈레톤 없이 바로 내용이 나온다
- S-04 담당자 안내: "다음에 할 것"에 `Skeleton`·`PageSkeleton` props·예시, "기본형으로 바꿔 두었으니 높이가 어긋나면 `Skeleton`을 조합해 다듬는다"와 담당별 바뀐 파일 목록을 적는다. PR 전에 디스코드로 알릴 문구(한두 줄)도 같이 적는다
  - 완료 조건 — 명령: `grep -n "PageSkeleton" handoff/LJS.md`에 안내가 나온다
- 범위 밖: `ProtectedRoute`의 `return null`(로그인 구현 전이라 쓰이지 않음), 제출 중복 막기용 `if (isPending) return;`(로딩 표시가 아님), `PlaceMap` 지도 로딩 문구(지도 SDK)
- 결정(사람): 스켈레톤은 기본형까지 만들어 LJS가 전체를 한 번에 교체한다(B안). 세밀한 높이 맞춤은 각 담당

새 의존성: 없음

### 추가 요청

| 번호 | 바꿀 파일 | 완료 조건 | 요청 |
| --- | --- | --- | --- |
| 추가-1 | `components/BoardPagination.jsx`(쪽 번호·‹·› 누르면 `onChange` 뒤 `window.scrollTo(0, 0)`. 카드 안 `Pagination`은 그대로) | 명령: `yarn -s lint`, `yarn -s build` / 화면: 1280px `/notices`·`/faqs`·`/inquiries`를 내린 뒤 쪽 번호 [2]를 누르면 `?page=2`이고 `scrollY` 0 / ‹·›도 0 | 요청 2026-10-22 10:51 "페이지네이션 1 → 2쪽 넘어갈 때도 상단으로 올리기" |
| 추가-2 | `components/Pagination.jsx`(쪽 번호·‹·› 누르면 `onChange` 뒤 `window.scrollTo(0, 0)`, 추가-1과 같은 방식) | 명령: `yarn -s lint`, `yarn -s build` / 화면: 1280px `/mypage/expenses/all`(가계부 전체 내역, SJM)을 내린 뒤 쪽 번호 [2]·‹·›를 누르면 `scrollY` 0 / `/health/diary` 검진 카드(JAJ)의 쪽 번호도 0 | 요청 2026-10-22 11:24 "전체 페이지 다 적용, 맨 위로 올리는 거" |
| 추가-3 | `docs/convention/ui.md`("로딩 표시" 절: 첫 진입은 겉틀만 남기고 본문 전체 스켈레톤, 화면 안 탭·검색·쪽 이동은 `placeholderData: keepPreviousData`로 이전 내용 유지, 문구·`return null` 금지, 쪽 이동 시 맨 위로) | 명령: `grep -n "keepPreviousData" docs/convention/ui.md`에 나온다 / `grep -n "PageSkeleton" docs/convention/ui.md`에 나온다 | 요청 2026-10-22 11:58 "겉틀 빼고 내부 컨텐츠는 서버 데이터든 아니든 스켈레톤으로 통일, 컨벤션 수정" |
| 추가-4 | 줄 단위 → 카드 단위 공용 스켈레톤: 새 `components/SkeletonCard.jsx`(흰 카드 + 제목 막대 + 본문 블록, `className`으로 높이·칸), `components/PageSkeleton.jsx`를 `chips`·`tabs`(개수) + 카드(`children`, 없으면 큰 카드 1장)로 바꿈. `pages/health/HealthDiaryPage.jsx`: 첫 진입(펫·일일 기록·지속 관찰 대기)은 칩·탭까지 본문 전체를 대시보드 틀(위 2칸 카드 + 카드 3장) 스켈레톤으로. `features/health/queries.js` `useDailyRecords`·`useObservations`·`useCheckups`에 `placeholderData: keepPreviousData`(펫을 바꿀 때 칩이 사라지지 않게). `docs/convention/ui.md` 로딩 표시 절에 `SkeletonCard` 반영 | 명령: `yarn -s lint`, `yarn -s build` / 화면: 1440px `/health/diary` 첫 진입 로딩 중 칩·탭 자리가 스켈레톤이고, 본문은 위 2칸(1.7:1) 카드 + 아래 카드 3장, 내용이 뜨면 같은 자리에 대시보드가 나온다 / 로딩 뒤 펫 칩을 바꾸면 칩·탭이 사라지지 않는다 / `/notices` 등 다른 화면 로딩은 큰 카드 1장 / 390px 가로 스크롤 없음 | 요청 2026-10-22 12:05 "칩·탭도 스켈레톤, 대시보드 틀처럼 줄 단위가 아니라 카드 단위 공용 스켈레톤" |
| 추가-5 | `components/PageSkeleton.jsx`에 `top`(칩·탭 위에 놓을 카드, 예: 히어로) 추가. `pages/health/HealthSummaryPage.jsx`: 로딩 두 분기(펫·요약 대기)를 실제 배치 스켈레톤으로 — 히어로 카드, 탭 4개, 구역 머리(제목·설명 막대) 4개, 진료·예방(왼쪽 큰 카드 + 오른쪽 카드 2장), 검사·수치(2칸), 처방·투약(1장), 관찰·첨부(2장) | 명령: `yarn -s lint`, `yarn -s build` / 화면: 1440px `/health` 첫 진입 로딩 중 위 배치가 보이고, 내용이 뜨면 같은 자리에 같은 크기의 카드가 나온다 / 390px 가로 스크롤 없음 | 요청 2026-10-22 12:12 "종합 건강기록 페이지 기준으로 스켈레톤" |
| 추가-6 | 큰 카드 1장(기본형)이던 페이지 로딩을 각 페이지의 실제 카드 배치로: `pages/health/CareCalendarPage`·`CheckupDetailPage`·`LabInputPage`(JAJ), `pages/notice/NoticeListPage`·`NoticeDetailPage`, `pages/faq/FaqListPage`, `pages/inquiry/InquiryListPage`·`InquiryDetailPage`·`InquiryEditPage`(KSJ), `pages/settings/NotificationSettingsPage`(LJS), `pages/mypage/PetListPage`, `features/pet/invite/InvitationAccept`(SJM). 케어 캘린더는 이번 달·다가오는 일정까지 첫 진입으로 보고(`features/health/queries.js` `useSchedules`에 `keepPreviousData`), 아래 `features/health/CareList`는 카드 자리 `SkeletonCard`로. 배치는 각 페이지 파일 안 작은 함수로, 공용 `PageSkeleton`·`SkeletonCard`·`Skeleton`만 조합. 같은 방법(재기·배치·모바일 높이·첫 진입 조건·빈 상태 금지·확인 기준)을 `docs/convention/ui.md` 로딩 표시 절에 적음 | 명령: `yarn -s lint`, `yarn -s build` / 화면: 1440px에서 위 페이지마다 로딩 중 카드 배치(칩·탭·검색줄·카드 수와 칸)가 다 불러온 화면과 같고, 로딩 중 본문 높이가 다 불러온 화면의 ±20% 안 / 390px 가로 스크롤 없음 | 요청 2026-10-22 12:16 "각각 페이지에 전체 적용, 종합 건강기록·건강 일지처럼" |
| 추가-7 | `pages/health/CareCalendarPage.jsx`: 이번 달·다가오는 일정 조회가 실패하면 첫 진입 스켈레톤을 끝낸다(`isError`면 기다리지 않음, 실패 뒤 화면은 바꾸기 전과 같음). `docs/convention/ui.md` 로딩 표시 절의 같은 예시·규칙도 고침 | 명령: `yarn -s lint`, `yarn -s build` / 화면: 일정 조회를 실패시키면(Playwright로 `getSchedules` 모듈 응답을 throw로 바꿈) `/health/calendar`가 스켈레톤에 머물지 않고 달력이 나온다 / 정상일 때 로딩 중 높이 비율 ±20% 그대로 | 요청 2026-10-22 13:40 검증 비고 "일정 조회 실패 시 스켈레톤이 끝나지 않음" 고치기로 함(사람이 잠금 해제 후 진행) |
| 추가-8 | `handoff/LJS.md` 다음에 할 것의 스켈레톤 안내를 지금 상태로: "기본형" → 각 페이지 실제 배치로 바꿔 둠, `PageSkeleton` props에 `top`, 규칙은 `ui.md` 로딩 표시 절 | 명령: `grep -n "top" handoff/LJS.md`에 `PageSkeleton` 안내가 나온다 / 안내에 "기본형으로 바꿔 두었다"가 없다 | 요청 2026-10-22 13:40 검증 비고 "S-04 안내가 추가-6 뒤 상태와 안 맞음" 고치기로 함 |

이전 작업: SCR-CMU-005 우리동네 펫돌봄 채팅 — 끝(검증 `통과` 1회차, 사람 확인 2026-10-22). 결정·추가 요청은 `milestones/LJS.md` 그 절


## 다음에 할 것

- 로딩 스켈레톤 확인(각 담당): "불러오는 중이에요" 문구와 `return null` 로딩 분기를 각 페이지의 실제 카드 배치 스켈레톤으로 바꿔 두었다(LJS, SCR-COM-002, 1440·390px에서 높이 ±20% 확인). 화면 배치를 바꾸면 그 페이지 파일 안 `XxxSkeleton`(또는 로딩 분기)도 같이 고친다. 새 화면·새 로딩 분기는 `docs/convention/ui.md` "로딩 표시" 절대로 만든다

  | 컴포넌트 | props | 쓰는 곳 |
  | --- | --- | --- |
  | `@/components/PageSkeleton` | `top`(칩·탭 위 카드, 예: 히어로), `chips`·`tabs`(개수), `children`(카드 배치, 없으면 큰 카드 1장) | 페이지 본문 전체를 대신하는 로딩 |
  | `@/components/SkeletonCard` | `className`(높이·칸, 기본 `h-64`) | 카드 한 장 자리. 대시보드는 실제 그리드에 놓는다(예: `HealthDiaryPage`) |
  | `@/components/Skeleton` | `className`(크기·모양, 예: `h-5 w-40`), `lines`(여러 줄, 마지막 줄 짧게) | 카드가 아닌 작은 요소(검색창·버튼·탭 글자·쪽 번호·구역 제목)나 카드 안 한 구역 |

  ```jsx
  /** 첫 진입: 페이지 파일 안 XxxSkeleton으로 실제 배치 */
  if (isPending) return <XxxListSkeleton />;
  function XxxListSkeleton() {
    return (
      <PageSkeleton>
        <Skeleton className="h-12 w-[300px]" /> {/** 검색 줄 */}
        <SkeletonCard className="h-[754px]" /> {/** 목록 카드 */}
      </PageSkeleton>
    );
  }
  /** 페이지 안 컴포넌트가 따로 조회: 그 카드와 같은 크기 */
  if (isPending) return <SkeletonCard className="h-64" />;
  ```

  - KSJ: `pages/notice/NoticeListPage`·`NoticeDetailPage`, `pages/faq/FaqListPage`, `pages/inquiry/InquiryListPage`(로딩 분기 2곳이 같은 `InquiryListSkeleton`)·`InquiryDetailPage`·`InquiryEditPage`
  - JAJ: `pages/health/HealthSummaryPage`(`SummarySkeleton`)·`HealthDiaryPage`·`CheckupDetailPage`·`CareCalendarPage`(`CalendarSkeleton`, 일정 실패 시 대기 안 함)·`LabInputPage`, `features/health/CareList`·`diary/ReceiptResultStep`·`diary/CheckupListCard`·`diary/ObservationCard`, `features/health/queries.js`(`useDailyRecords`·`useObservations`·`useCheckups`·`useSchedules`에 `keepPreviousData`)
  - SJM: `pages/mypage/PetListPage`, `features/pet/list/FamilySection`·`list/SentInvitations`·`invite/InvitationAccept`
  - 공용(LJS): `components/Pagination`(카드 쪽 번호, 가계부 전체 내역·건강 일지 검진 카드)도 누르면 맨 위로 간다
  - PR 전 디스코드 알림: "페이지를 이동하면 스크롤이 맨 위로 가도록 `UserLayout`·`AdminLayout`에 넣었어요(뒤로가기는 원래 위치로 돌아가요). 쪽 번호(`BoardPagination`·`Pagination`)를 눌러도 맨 위로 가요. 첫 진입에 깜빡이던 '불러오는 중이에요'와 로딩 중 `return null`은 각 페이지의 실제 카드 배치 스켈레톤(`PageSkeleton`·`SkeletonCard`·`Skeleton`)으로 바꿨어요. 위 파일들이 바뀌었으니 화면 배치를 바꾸면 그 페이지의 `XxxSkeleton`도 같이 고쳐 주세요. 규칙은 `docs/convention/ui.md` '로딩 표시' 절, 사용법은 `handoff/LJS.md`에 있어요"

- SCR-CMU-005·COM-009 연결 남음: 채팅·매칭 API(KSJ, 백엔드 `docs/api/community.md`)로 `features/chat/api.js` 가짜를 바꾸고 가짜 읽음 위치 `localStorage['fake-chat-read-seq']` 코드를 지운다. 붙인 뒤 `room/FakePeerTools.jsx`·`fakePeerAct`·`/dev/chat`(`pages/dev/ChatDevPage.jsx`)·`fakeChat*` 쿼리 코드를 지운다. 009-18 알림 억제는 서버(YAY). 장소 검색은 YAY(`searchChatPlaces` → `GET /places`, 주소 검색 범위는 백엔드 issues 99번 13)
- KSJ에 물을 것(CMU-005 가짜가 추정한 것): ① 목록 `ChatRoomSummary`에 내 역할(`myRole`)·거래 상태(`mtchDlngSttsCd`)가 없다(탭·배지에 필요) ② 방 응답에 모집글 일정·비용 요약이 없다(카드 펼침 `rcrtSummary`) ③ 메시지 보낸 시각 필드(사람이 DDL 확인 후 정함) ④ 시스템 안내 메시지 유형과 강조(`sysToneCd`), 요청 취소 사유 표시(`tagCn`) ⑤ 주소 공유 필드 배치(가짜는 `shrnAddr`=장소, `msgCn`=상세 주소) ⑥ 매칭 요청 `CareMatchCreateRequest`의 조건 필드를 화면이 어디서 받나(시안은 "현재 모집글 조건으로 요청") ⑦ 완료 요청이 입력 없이 가능한지(백엔드는 회차·종료 시각·내용·사진을 받는다) ⑧ 채팅방 나가기·다시 요청·무응답 종료 API 없음(백엔드 issues 17) ⑨ 사진 업로드 방식(issues 15)
- 게시글 상세(SCR-CMU-004, KSJ): [채팅하기]는 `useChatWindow()`의 `open({ pstSn })`, 보호자 [채팅 목록 보기]는 `open({ listPstSn })`를 클릭 핸들러에서 바로 부른다(요청을 기다린 뒤 열면 팝업 차단)
- 사람이 고치는 문서: 기능명세서 v0.4 FN-COM-009-03 "새 창이 아닌 모달" → 별도 창, 009-09·11·12와 화면설계서 v0.7 SCR-COM-009의 모달 문구. 커뮤니티 기능명세서 v0.7 FN-CMU-005-01 "채팅 모달"·화면설계서 v0.7 SCR-CMU-005 모달 문구(시안은 한 칸 새 창). 백엔드 저장소 `docs/convention/milestone.md` 담당 표에 채팅 화면 LJS 이관 반영
- SCR-CMU-005 남은 화면 일(선택): 거래 버튼을 아주 빠르게 두 번 누르면 두 번째 요청이 서버에 가 거절 토스트가 뜬다(`useDealAction`의 `onSettled`가 `invalidateQueries`를 반환하지 않음). 메시지 시각·날짜 구분선은 `msgDt`가 정해지면 `ChatConversation.jsx`에 날짜 구분선 추가
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
