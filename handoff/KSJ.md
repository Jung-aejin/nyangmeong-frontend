# KSJ 핸드오프

## 지금 하는 것

SCR-CMU-003 펫뉴스 (시작 2026-10-21) — 상태: 구현 중 (승인 2026-10-21 15:00, 추가 요청 2026-10-22)

- 근거: 커뮤니티_기능명세서_v0.7_20261019 FN-CMU-003-01~06, 커뮤니티_화면설계서_v0.7_20261019 SCR-CMU-003-01(리스트)·02(상세)
- 디자인: html/SCR-CMU-003-01.html(리스트)·html/SCR-CMU-003-02.html(상세). 디자인 폴더 `CMU/`에서 받은 것(CSS·폰트는 `html/SCR-CMU-003/`). Figma 파일 `JgHlZmTfvqbDfqfuX78OzA` 노드 `774-3`(CMU)이 같은 디자인이지만 토큰이 없어 HTML 기준
- API: 뉴스 API는 KSJ 백엔드인데 아직 없다 → 가짜 응답으로 먼저 만들고 나중에 연결. 가짜는 `features/news/api.js`(메모리 배열 약 25건: 외부 언론사 + 관리자 등록 섞음, 카테고리 4종). 키는 ERD 뉴스 테이블(`NEWS_*`)을 camelCase로 바꾼 것(`newsSn`·`newsClsfCd`·`newsSrcCd`·`newsTtl`·`newsCn`·`srcPressNm`·`orgtxtPath`·`pblcnDt`·`thmbUrlPath`·`atchFileSn`)이고 Swagger 전이라 변환 결과는 가정이다. 요약 컬럼이 없어 목록 요약은 `newsCn` 앞부분을 자른다. 카테고리 코드(`newsClsfCd`): 건강 `CMUC0018`·생활 `CMUC0019`·정책 `CMUC0020`·여행 `CMUC0021`, 출처 코드(`newsSrcCd`): 외부 언론사 `CMUC0022`·관리자 등록 `CMUC0023`(사람이 DB에서 확인함). 첨부 이미지(`atchFileSn`)는 응답 모양을 본 뒤로 미룬다
- URL: 상세 `/community/news/:newsSn`을 새로 둔다(`docs/routes.md` CMU-003 행을 먼저 고치고 `PATHS.COMMUNITY_NEWS_DETAIL` 추가). 목록 필터·검색·쪽은 쿼리(`?category=건강&keyword=…&page=2`, 값은 이름이고 서버에는 코드로 바꿔 보낸다). AI 대상 URL(`/community/news`)은 그대로라 AI 매핑은 안 바뀐다
- 겉틀: 커뮤니티 화면 4개가 같이 쓰는 하위 메뉴(펫이야기·우리동네 펫돌봄·실종센터·펫뉴스)를 `layouts/CommunityLayout.jsx`로 만들고 `routes/domains/community/communityRoutes.js`에 펫뉴스 라우트 2개를 붙인다(`ProtectedRoute` 없이, 로그인 구현 전 public)

| 기능 ID | 바꿀 파일 | API | 완료 조건 |
| --- | --- | --- | --- |
| FN-CMU-003-01 뉴스 목록 조회 | `features/news/{api,queries,NewsList,NewsSourceBadge}.js(x)`, `pages/news/NewsListPage.jsx`, `layouts/CommunityLayout.jsx`, 라우트·`paths.js` | 뉴스 목록(KSJ, 가짜) | 명령: `yarn -s lint`, `yarn -s build` / 화면: `/community/news`에 최신순 10건(썸네일·제목·출처·요약 2줄·작성일), `newsSrcCd`가 관리자 등록(`CMUC0023`)이면 「관리자 등록」 배지로 구분, 쪽 번호 최대 10개이고 첫 쪽에는 ‹ 없음(`BoardPagination`) |
| FN-CMU-003-02 카테고리 필터 | `features/news/NewsList.jsx` | 같은 목록(`category`) | 화면: 건강·생활·정책·여행 칩 하나만 선택되고 누르면 즉시 목록이 걸러지며 1쪽으로 간다. 선택한 칩을 다시 누르면 해제(전체) |
| FN-CMU-003-03 키워드 검색 | `features/news/NewsList.jsx`(`components/SearchInput` 재사용) | 같은 목록(`keyword`) | 화면: 제목 또는 본문에 든 단어로 검색되고 칩과 함께 적용, 0건이면 `EmptyResult` |
| FN-CMU-003-04 뉴스 상세 조회 | `features/news/NewsDetail.jsx`, `pages/news/NewsDetailPage.jsx` | 뉴스 상세·최신 5건(KSJ, 가짜) | 화면: [‹ 펫뉴스]가 보던 목록(쿼리 유지)으로 돌아가고, 출처·작성일, 외부 기사는 요약+[원문보기 ↗](새 창), 관리자 등록은 `newsCn` 전문만 있고 원문보기 없음(`newsSrcCd` 기준), 아래 최신 5건(제목·MM-DD)을 누르면 그 상세로 간다, 댓글·좋아요 없음, 없는 번호는 「없는 뉴스」 안내 |
| FN-CMU-003-05 공유하기 | `features/news/NewsShare.jsx` | 없음 | 화면: 상세에만 [공유하기]가 있고 누르면 패널에 [링크 복사](복사 뒤 토스트)와, 브라우저가 지원하면 [다른 앱으로 공유](`navigator.share`)가 나온다. 목록에는 없다 |
| FN-CMU-003-06 뉴스 수집 | 없음 | — | 화면 없음(서버 RSS 수집) |

### 추가 요청

| 번호 | 바꿀 파일 | 완료 조건 | 요청 |
| --- | --- | --- | --- |
| 추가-1 | `features/news/NewsList.jsx` | 화면: 기사마다 따로 떨어진 카드 박스(안쪽 여백 24·28px, 테두리, 큰 둥근 모서리, 옅은 그림자, 카드 사이 12px, 마우스를 올리면 테두리·그림자 강조). 썸네일은 카드 높이만큼 세로로 늘어나고(최소 124px) 출처·날짜 줄은 왼쪽 정렬. 모바일(760px 이하)은 썸네일이 카드 맨 위에 가로로 꽉 차고 카드 여백 16px | 요청 2026-10-22 "리스트 박스형태가 디자인과 다르다, CMU 폴더 뉴스 페이지를 모두 확인해 적용" |
| 추가-2 | `features/news/NewsList.jsx` | 화면: 검색 0건은 카드 같은 박스 안에 64px 동그란 아이콘 배경, 굵은 제목 「해당하는 뉴스가 없어요」, 보조 문구, 작은 보조 버튼 [전체 뉴스 보기] | 요청 2026-10-22 "검색 0건일 때 화면도 디자인 확인" |
| 추가-3 | `features/news/{NewsList,NewsDetail,PopularNews}.jsx`, `features/news/{api,queries}.js` | 화면: 목록 오른쪽(1100px 이하는 아래)과 상세 오른쪽 레일에 「많이 본 뉴스」 5건(번호·제목 2줄 말줄임)이 나오고 누르면 그 상세로 간다. 조회수 컬럼이 ERD에 없어 가짜 순서로만 쓴다 | 요청 2026-10-22 "CMU 폴더 뉴스 관련 페이지 모두 확인해서 적용" |
| 추가-4 | `features/news/{NewsDetail,NewsList}.jsx`, `pages/news/NewsListPage.jsx` | 화면: 디자인 CSS 최종값에 맞춰 목록 탭·검색줄·레일 제목, 상세 카드·최신 기사 레일 간격과 글꼴 굵기를 맞춘다 | 요청 2026-10-22 "CMU 폴더 뉴스 관련 페이지 모두 확인해서 적용" |

- 질문: 디자인 파일이 없습니다. 1:1 문의 때처럼 디자인 폴더(`CMU/SCR-CMU-003-*.html`)나 Figma 노드가 있으면 경로를 알려 주세요. `html/SCR-CMU-003-01.html` 등으로 복사해 씁니다. AI가 초안을 만들거나 화면설계서 기준으로 갈 수도 있습니다. (추천: 경로가 있으면 경로, 없으면 공지사항·1:1 문의 화면의 모양을 따라 화면설계서 기준)
  - 결정: 디자인 폴더 `CMU/SCR-CMU-003-01·02.html`을 쓴다(사람이 경로 제공 2026-10-21)
- 질문: 상세 URL의 PK 이름을 `nwsSn`으로 가정했습니다. 백엔드 테이블 PK가 다르면 알려 주세요(`/community/news/:<PK>`). (추천: 정해진 게 없으면 `nwsSn`)
  - 결정: `newsSn` (ERD 뉴스 테이블 PK `NEWS_SN`, 사람이 확인 2026-10-21)
- 새 의존성: 없음 (카카오톡 공유 SDK는 넣지 않고 링크 복사 + `navigator.share`만)

## 다음에 할 것

- SCR-CSC-003 연결 남음: 문의 API(KSJ 백엔드)로 가짜 교체(응답 키, 목록 `status` 필터·`totalAll`, 첨부 이미지 업로드), FN-003-10 픽셀 캐릭터 화면(MYP-010, SJM)에서 `/inquiries/new?type=픽셀 캐릭터`로 들어오는 링크, FN-003-14 답변 알림 저장(YAY `notification`)과 알림에서 상세로 가는 링크, FN-003-16 로그인 연결 후 `ProtectedRoute`로 감싸기(AIC), 직접 그리는 `DropdownSelect`를 다른 화면의 `Select`에도 쓸지 정하기
- SCR-CSC-003 사람이 고치는 문서: 기능명세서 FN-CSC-003-13의 「[문의 수정] 비활성」을 「버튼 숨김 + 안내 문구」로, 화면설계서 SCR-CSC-003-03 ③의 같은 문구

- 커뮤니티(CMU) 글쓰기·수정은 1:1 문의 폼과 같게 만든다(사람 결정 2026-10-21): 이미지 첨부(최대 10장·미리보기·개별 삭제·가득 차면 추가 칸 숨김, 모바일 X 항상 표시), 제목 칸 줄바꿈 늘어남, 내용 칸 글 길이에 맞춰 늘고 줄어듦(최소 300px·상한 600px), 문의 유형식 `DropdownSelect`, 나가기 확인 모달. 지금은 `features/inquiry/{InquiryImages,InquiryForm}.jsx` 안에 있어 `features/community`가 가져다 쓸 수 없다(features끼리 import 금지). CMU를 시작할 때 이미지 첨부·자동 높이 입력칸·`fitHeight`를 `components/`·`hooks/`로 올린다

- SCR-CSC-002 연결 남음: FAQ API(KSJ 백엔드)로 가짜(`features/faq/api.js`) 교체, 응답 키(`faqSn`·`faqClsfNm`·`qstnCn`·`ansCn`)와 분류 값 확인, 로그인 연결 후 `ProtectedRoute`로 감싸기
- 사람이 고치는 문서: 기능명세서 FN-CSC-002-01 「카테고리 배지 표시」와 화면설계서 SCR-CSC-002 ④의 배지 문구를 디자인(배지 없음)에 맞춘다

- SCR-CSC-001 연결 남음: 공지 API(KSJ 백엔드)로 가짜 교체(제목·내용 `keyword` 검색, 고정 공지가 쪽 크기에 들어가는지, 응답 키 확인), 본문 이미지 표시(응답 모양을 본 뒤), 로그인 연결 후 `ProtectedRoute`로 감싸기
- 375px 페이지 가로 스크롤은 공용 푸터가 원인(`UserFooter.jsx`, LJS). develop의 LJS 반응형 작업이 들어오면 다시 본다(FN 추가-4 연결 남음). 푸터 일러스트와 내용 사이 여백도 LJS가 푸터 공통 레이아웃에서 정하고, 그 전까지 고객센터 화면은 내용이 띠에 붙어 보인다
- 사람이 고치는 문서: 기능명세서 FN-CSC-001-03 「공지 제목 검색」→ 제목·내용 검색, FN-CSC-001-01 「제목·작성일만 노출」→ 번호 포함, 화면설계서 SCR-CSC-001-01 ② 검색 문구
- 모든 게시판(펫이야기·실종센터·펫돌봄·펫뉴스 상세 등)의 본문 영역은 공지 상세와 같게 한다: 글 영역 최소 높이 200px(긴 글은 늘어남) + 본문 아래 항상 80px 여백 + 구분선과 「‹ 목록으로」. `NoticeDetail.jsx`의 본문 블록이 기준이고, 여러 게시판이 쓰면 `components/`로 올린다
- 고객센터 헤더 일러스트 크기는 나중에 다시 정한다(지금은 760px 초과에서 160px, 이하는 숨김)
- 마일스톤 순서: CMU-003 → CMU-001 → CMU-002 → CMU-004 (`milestones/KSJ.md`). COM-009·CMU-005 화면은 2026-10-21 LJS로 이관(채팅 API는 KSJ). 고객센터 겉틀(`CustomerCenterLayout`)의 메뉴·헤더는 FAQ·1:1 문의가 같이 쓴다. 부제는 그 화면 Figma 문구를 `MENUS`에 넣는다
- (2026-10-21 화면은 LJS로 이관, 채팅 API는 KSJ. 목록·대화·읽음·소켓 이벤트의 요청·응답 모양을 LJS와 먼저 맞춘다) SCR-COM-009 연결 남음(LJS 핸드오프에서 넘어옴): `ChatModalPlaceholder.jsx`를 실제 셸로 교체하고 `ChatModal.jsx`의 DEV 조건 제거, 헤더 안 읽은 수 배지(002-11), 004-09 펫돌봄 알림이 채팅방을 열게 하는 방 식별자(`otoChatRoomSn`, YAY), 마지막에 본 방을 새로고침 뒤에도 기억할지
- 다른 PC에서 이어 갈 때: `.env.local`에 `DMS_MCP_URL`·`FIGMA_FILE_URL`을 디스코드 최신 파일로 채운다(`FIGMA_TOKEN`은 비어도 됨). `.cache/`는 git 제외라 화면설계서는 `/start`가 DMS에서 다시 받고 Figma PNG는 노드를 Figma MCP로 다시 받는다
