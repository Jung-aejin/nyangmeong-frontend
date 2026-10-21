# KSJ 핸드오프

## 지금 하는 것

SCR-CSC-003 1:1 문의 (시작 2026-10-21, 끝 2026-10-21) — 상태: 끝 (검증 판정 `확인 못 함 있음`: 내 것 없음, 연결 남음만. 사람 확인 2026-10-21)

- 만든 것: `features/inquiry/{api,queries,InquiryList,InquiryDetail,InquiryForm,InquiryImages,InquiryStatusBadge}`, `pages/inquiry/{InquiryListPage,InquiryWritePage,InquiryDetailPage,InquiryEditPage}`, `components/DropdownSelect.jsx`, 라우트 `/inquiries`·`/inquiries/new`·`/inquiries/:otoInqrySn`·`/inquiries/:otoInqrySn/edit`(`ProtectedRoute` 없이), `PATHS.INQUIRY_NEW·INQUIRY_DETAIL·INQUIRY_EDIT`, `CustomerCenterLayout`의 1:1 문의 부제와 하위 제목(「문의 작성」·「문의 수정」)
- 디자인: Figma 파일 `JgHlZmTfvqbDfqfuX78OzA` 리스트 `815:13136`·작성 `815:13525`·상세 `815:13880`·수정 `815:14191` + 디자인 폴더 `CSC/SCR-CSC-003-01~04.html`(`html/`에 복사, git 제외). 문의 API가 없어 가짜 응답(`features/inquiry/api.js`, 메모리 배열 12건, 첫 로드 `?fakeEmpty`면 0건)이고 `otoInqrySn` 외 키(`inqryTyNm`·`inqryTtl`·`inqryCn`·`atchFiles`·`ansCn`·`ansDt`·`crtDt`)는 가정이다
- 결정: 0건이면 목록 대신 작성 화면으로 `replace` 이동(003-03), 수정 중 이탈 확인은 [취소]·[목록으로] 모달과 새로고침·닫기 브라우저 확인창까지(앱이 `BrowserRouter`라 `useBlocker`를 못 써서 메뉴·헤더 링크 이동은 못 막음), 답변 완료 문의는 [문의 수정] 버튼을 숨기고 문구만 표시(추가-3), 문의 유형은 직접 그리는 `DropdownSelect`(추가-9)
- 추가 요청(유효): 추가-1 버튼 왼쪽 아이콘 삭제, 추가-2 「선택」 삭제·개수 이동, 추가-3 답변 완료 시 수정 버튼 숨김, 추가-4·6·11·12 제목·내용 칸 글 길이에 맞춰 늘고 줄어듦(내용 최소 300px·상한 600px, 창 크기 변경에도 다시 맞춤, 제목은 Enter 불가), 추가-5 10장이면 추가 칸 숨김, 추가-7·8 모바일 제목 줄바꿈·썸네일 X 항상 표시, 추가-9 유형 드롭다운 디자인, 추가-10 「* 표시는…」 문장 삭제
- 검증: `yarn -s lint` 0, `yarn -s build` 0 (1회차 `실패`: 제출 뒤 목록 대신 작성 화면으로 튕김 → `InquiryListPage`가 다시 가져오는 중에는 옛 0건으로 판단하지 않게 고침, 이후 모든 회차 `통과`)

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
- 마일스톤 순서: CMU-003 → CMU-001 → CMU-002 → CMU-004 → COM-009 → CMU-005 (`milestones/KSJ.md`). 고객센터 겉틀(`CustomerCenterLayout`)의 메뉴·헤더는 FAQ·1:1 문의가 같이 쓴다. 부제는 그 화면 Figma 문구를 `MENUS`에 넣는다
- SCR-COM-009 연결 남음(LJS 핸드오프에서 넘어옴): `ChatModalPlaceholder.jsx`를 실제 셸로 교체하고 `ChatModal.jsx`의 DEV 조건 제거, 헤더 안 읽은 수 배지(002-11), 004-09 펫돌봄 알림이 채팅방을 열게 하는 방 식별자(`otoChatRoomSn`, YAY), 마지막에 본 방을 새로고침 뒤에도 기억할지
- 다른 PC에서 이어 갈 때: `.env.local`에 `DMS_MCP_URL`·`FIGMA_FILE_URL`을 디스코드 최신 파일로 채운다(`FIGMA_TOKEN`은 비어도 됨). `.cache/`는 git 제외라 화면설계서는 `/start`가 DMS에서 다시 받고 Figma PNG는 노드를 Figma MCP로 다시 받는다
