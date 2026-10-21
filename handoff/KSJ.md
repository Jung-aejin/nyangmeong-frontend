# KSJ 핸드오프

## 지금 하는 것

SCR-CSC-002 자주 묻는 질문(FAQ) (시작 2026-10-21) — 끝 2026-10-21 — 상태: 끝 (검증 판정 `통과` 1회차, 사람 확인 2026-10-21)

기준: 고객센터_기능명세서_v0.4_20261019, 고객센터_화면설계서_v0.3_20261019 (DMS)

- 직전 마일스톤 SCR-CSC-001 공지사항은 2026-10-21에 끝났다(사람 확인). 그 화면의 겉틀(`CustomerCenterLayout`), 검색창, 결과 없음 박스, `BoardPagination`, 반응형 기준(760px·1100px)을 이 화면에도 그대로 쓴다
- 디자인: Figma 파일 `JgHlZmTfvqbDfqfuX78OzA` 노드 `815:12699`(SCR-CSC-002, 1440x2009) + `html/SCR-CSC-002.html`(디자인 폴더 `CSC/SCR-CSC-002.html`에서 복사함). 모양·문구는 HTML, 정책은 기능명세서가 기준이고 다르면 보고한다. 구현 때 Figma MCP로 노드를 읽는다(기획 단계에서는 읽지 않음)
- API: FAQ API는 KSJ 백엔드인데 아직 없다. 가짜 응답으로 먼저 만들고 나중에 연결한다. 가짜는 `features/faq/api.js`에 둔다(공지 `features/notice/api.js`와 같은 방식). 키 `faqSn`·`faqClsfNm`(분류)·`qstnCn`(질문)·`ansCn`(답변)은 가정이고, 연결할 때 서버 키로 바꾼다
- 공통: 검색창과 결과 없음 박스는 공지와 FAQ가 같이 쓰므로 `components/SearchInput.jsx`·`components/EmptyResult.jsx`로 올리고, `NoticeList.jsx`도 이 둘을 쓰게 바꾼다(겉모양은 그대로)
- FN-CSC-002-01 FAQ 목록 조회: `features/faq/{api,queries,FaqList}.js(x)`, `pages/faq/FaqListPage.jsx`, `routes/domains/customerCenterRoutes.js`에 `PATHS.FAQS` 연결(`ProtectedRoute` 없이), `CustomerCenterLayout`의 `MENUS`에 FAQ 부제. 한 쪽 10건. 분류 배지는 Figma·HTML 디자인에 없어 그리지 않는다(기능명세서 002-01·화면설계서에는 있음, 디자인 기준을 따르고 사람이 정한다) 명령: `yarn -s lint`, `yarn -s build` / 화면: `/faqs`에 「고객센터 › 자주 묻는 질문」 헤더와 왼쪽 메뉴 선택, 10건이 보인다
- FN-CSC-002-02 분류별 필터 조회: `FaqList.jsx`. 전체·이용방법·계정·신고 · 제재·기타 칩 단일 선택, 누르면 즉시 반영하고 1쪽으로 간다. 분류·검색어·쪽은 URL 쿼리(`category`·`keyword`·`page`)에 둔다. 화면: 칩을 바꾸면 목록이 그 분류만 남는다
- FN-CSC-002-03 키워드 검색: `FaqList.jsx` + `SearchInput`. 질문과 답변 내용을 대상으로 검색하고 분류와 AND로 적용한다. 0건이면 「찾는 질문이 없어요」와 [전체 질문 보기](분류·검색어를 지우고 1쪽). 화면: 분류 칩과 검색어가 함께 적용된다 / 0건이면 결과 없음 박스가 나오고 [전체 질문 보기]로 전체 목록에 돌아간다
- FN-CSC-002-04 답변 아코디언 펼침 조회: `FaqList.jsx`. 질문은 Q, 답변은 A로 표시, 펼침 상태는 항목별로 따로 두어 여러 개 동시에 펼치고 다시 누르면 접힌다(▼/▲). 별도 상세 페이지는 만들지 않는다. 쪽·분류·검색이 바뀌면 모두 접는다. 화면: 질문 두 개를 연달아 눌러 둘 다 펼쳐지고, 다시 누르면 접힌다
- FN-CSC-002-05 페이지네이션: 기존 `components/BoardPagination.jsx`. 번호 최대 10개, 첫 쪽에서는 이전 화살표 없이 다음(›)만. 화면: 2쪽으로 가면 다른 10건이 나오고 URL `page=2`가 된다
- 새 의존성: 없음
- 결정: 질문 목록에 분류 배지는 그리지 않는다(Figma·HTML에 없음, 사람이 확인함). 분류는 URL 쿼리 `category`에 분류 글자 그대로 둔다
- 검증: `yarn -s lint` 0, `yarn -s build` 0

## 다음에 할 것

- SCR-CSC-002 연결 남음: FAQ API(KSJ 백엔드)로 가짜(`features/faq/api.js`) 교체, 응답 키(`faqSn`·`faqClsfNm`·`qstnCn`·`ansCn`)와 분류 값 확인, 로그인 연결 후 `ProtectedRoute`로 감싸기
- 사람이 고치는 문서: 기능명세서 FN-CSC-002-01 「카테고리 배지 표시」와 화면설계서 SCR-CSC-002 ④의 배지 문구를 디자인(배지 없음)에 맞춘다

- SCR-CSC-001 연결 남음: 공지 API(KSJ 백엔드)로 가짜 교체(제목·내용 `keyword` 검색, 고정 공지가 쪽 크기에 들어가는지, 응답 키 확인), 본문 이미지 표시(응답 모양을 본 뒤), 로그인 연결 후 `ProtectedRoute`로 감싸기
- 375px 페이지 가로 스크롤은 공용 푸터가 원인(`UserFooter.jsx`, LJS). develop의 LJS 반응형 작업이 들어오면 다시 본다(FN 추가-4 연결 남음). 푸터 일러스트와 내용 사이 여백도 LJS가 푸터 공통 레이아웃에서 정하고, 그 전까지 고객센터 화면은 내용이 띠에 붙어 보인다
- 사람이 고치는 문서: 기능명세서 FN-CSC-001-03 「공지 제목 검색」→ 제목·내용 검색, FN-CSC-001-01 「제목·작성일만 노출」→ 번호 포함, 화면설계서 SCR-CSC-001-01 ② 검색 문구
- 모든 게시판(펫이야기·실종센터·펫돌봄·펫뉴스 상세 등)의 본문 영역은 공지 상세와 같게 한다: 글 영역 최소 높이 200px(긴 글은 늘어남) + 본문 아래 항상 80px 여백 + 구분선과 「‹ 목록으로」. `NoticeDetail.jsx`의 본문 블록이 기준이고, 여러 게시판이 쓰면 `components/`로 올린다
- 고객센터 헤더 일러스트 크기는 나중에 다시 정한다(지금은 760px 초과에서 160px, 이하는 숨김)
- 마일스톤 순서: SCR-CSC-002 → CMU-003 → CMU-001 → CSC-003 → CMU-002 → CMU-004 → COM-009 → CMU-005 (`milestones/KSJ.md`). 다음은 `/start`로 SCR-CSC-002(FAQ). 고객센터 겉틀(`CustomerCenterLayout`)의 메뉴·헤더는 FAQ·1:1 문의가 같이 쓴다. 부제는 그 화면 Figma 문구를 `MENUS`에 넣는다
- SCR-COM-009 연결 남음(LJS 핸드오프에서 넘어옴): `ChatModalPlaceholder.jsx`를 실제 셸로 교체하고 `ChatModal.jsx`의 DEV 조건 제거, 헤더 안 읽은 수 배지(002-11), 004-09 펫돌봄 알림이 채팅방을 열게 하는 방 식별자(`otoChatRoomSn`, YAY), 마지막에 본 방을 새로고침 뒤에도 기억할지
- 다른 PC에서 이어 갈 때: `.env.local`에 `DMS_MCP_URL`·`FIGMA_FILE_URL`을 디스코드 최신 파일로 채운다(`FIGMA_TOKEN`은 비어도 됨). `.cache/`는 git 제외라 화면설계서는 `/start`가 DMS에서 다시 받고 Figma PNG는 노드를 Figma MCP로 다시 받는다
