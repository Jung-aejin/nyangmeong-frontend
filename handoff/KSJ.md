# KSJ 핸드오프

## 지금 하는 것

SCR-CSC-001 공지사항 (시작 2026-10-19, 끝 2026-10-21) — 상태: 끝 (검증 판정 `확인 못 함 있음`: 내 것 없음, 연결 남음만. 사람 확인 2026-10-21)

- 만든 것: `layouts/CustomerCenterLayout.jsx`(「고객센터 › 제목」 헤더·부제·일러스트, 왼쪽 메뉴), `features/notice/{api,queries,NoticeList,NoticeDetail}`, `pages/notice/NoticeListPage·NoticeDetailPage`, `components/Pagination.jsx`, `utils/formatDate.js`, `assets/csc_header_pixel.svg`, 라우트 `/notices`·`/notices/:ntcMttrSn`(`ProtectedRoute` 없이), `PATHS.NOTICE_DETAIL`
- 디자인: Figma 파일 `JgHlZmTfvqbDfqfuX78OzA` 목록 노드 `815:11964`, 상세 노드 `815:12360`. 공지 API가 없어 가짜 응답(`features/notice/api.js`)이고 `ntcMttrSn` 외 키(`ntcMttrTtl`·`ntcMttrCn`·`fixYn`·`crtDt`·`vwCnt`)는 가정이다
- 결정: 검색은 제목과 내용(Figma 문구 「제목 또는 내용 검색」), 번호 열을 둔다, 고정 공지는 일반 공지와 별도로 첫 쪽 맨 위에 얹고 「전체 n건」·번호는 일반 공지 기준, 상세 본문 글 영역 최소 높이 200px + 아래 80px 여백 + 구분선 + 「‹ 목록으로」(상단 링크·[목록] 버튼은 없음), 반응형은 develop 공통 레이아웃과 같은 760px·1100px(모바일 Figma 없음), 푸터 일러스트 여백은 LJS가 정한다
- 추가 요청(유효): 추가-3 상세 하단 구분선·목록으로 링크, 추가-4 반응형, 추가-5 본문 영역 최소 높이 200px + 아래 80px, 추가-6 모바일 번호 숨김(고정 공지 배지는 남김), 추가-7 푸터 아래 여백 제거. 취소: 추가-1(목록 버튼 왼쪽 정렬), 추가-2(푸터 여백 100px)
- 검증: `yarn -s lint` 0, `yarn -s build` 0

## 다음에 할 것

- SCR-CSC-001 연결 남음: 공지 API(KSJ 백엔드)로 가짜 교체(제목·내용 `keyword` 검색, 고정 공지가 쪽 크기에 들어가는지, 응답 키 확인), 본문 이미지 표시(응답 모양을 본 뒤), 로그인 연결 후 `ProtectedRoute`로 감싸기
- 375px 페이지 가로 스크롤은 공용 푸터가 원인(`UserFooter.jsx`, LJS). develop의 LJS 반응형 작업이 들어오면 다시 본다(FN 추가-4 연결 남음). 푸터 일러스트와 내용 사이 여백도 LJS가 푸터 공통 레이아웃에서 정하고, 그 전까지 고객센터 화면은 내용이 띠에 붙어 보인다
- 사람이 고치는 문서: 기능명세서 FN-CSC-001-03 「공지 제목 검색」→ 제목·내용 검색, FN-CSC-001-01 「제목·작성일만 노출」→ 번호 포함, 화면설계서 SCR-CSC-001-01 ② 검색 문구
- 모든 게시판(펫이야기·실종센터·펫돌봄·펫뉴스 상세 등)의 본문 영역은 공지 상세와 같게 한다: 글 영역 최소 높이 200px(긴 글은 늘어남) + 본문 아래 항상 80px 여백 + 구분선과 「‹ 목록으로」. `NoticeDetail.jsx`의 본문 블록이 기준이고, 여러 게시판이 쓰면 `components/`로 올린다
- 고객센터 헤더 일러스트 크기는 나중에 다시 정한다(지금은 760px 초과에서 160px, 이하는 숨김)
- 마일스톤 순서: SCR-CSC-002 → CMU-003 → CMU-001 → CSC-003 → CMU-002 → CMU-004 → COM-009 → CMU-005 (`milestones/KSJ.md`). 다음은 `/start`로 SCR-CSC-002(FAQ). 고객센터 겉틀(`CustomerCenterLayout`)의 메뉴·헤더는 FAQ·1:1 문의가 같이 쓴다. 부제는 그 화면 Figma 문구를 `MENUS`에 넣는다
- SCR-COM-009 연결 남음(LJS 핸드오프에서 넘어옴): `ChatModalPlaceholder.jsx`를 실제 셸로 교체하고 `ChatModal.jsx`의 DEV 조건 제거, 헤더 안 읽은 수 배지(002-11), 004-09 펫돌봄 알림이 채팅방을 열게 하는 방 식별자(`otoChatRoomSn`, YAY), 마지막에 본 방을 새로고침 뒤에도 기억할지
- 다른 PC에서 이어 갈 때: `.env.local`에 `DMS_MCP_URL`·`FIGMA_FILE_URL`을 디스코드 최신 파일로 채운다(`FIGMA_TOKEN`은 비어도 됨). `.cache/`는 git 제외라 화면설계서는 `/start`가 DMS에서 다시 받고 Figma PNG는 노드를 Figma MCP로 다시 받는다
