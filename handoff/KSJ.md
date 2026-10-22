# KSJ 핸드오프

## 지금 하는 것

SCR-CMU-003 펫뉴스 (시작 2026-10-21, 끝 2026-10-22) — 상태: 끝 (검증 판정 `통과`, 사람 확인 2026-10-22)

- 만든 것: `features/news/{api,queries,newsCodes,NewsList,NewsDetail,NewsShare,NewsCategoryBadge,NewsThumb}`, `pages/news/{NewsListPage,NewsDetailPage}`, 라우트 `/community/news`·`/community/news/:newsSn`(`ProtectedRoute` 없이), `PATHS.COMMUNITY_NEWS_DETAIL`. 목록·상세는 LJS의 `SubPageLayout`(`section="community"`, 목록 `contentClassName="min-[1101px]:pt-0"`)을 쓴다
- 디자인: `html/SCR-CMU-003-01·02.html`(디자인 폴더 `CMU/`에서 복사, git 제외). 뉴스 API가 없어 가짜 응답(`features/news/api.js`, 메모리 25건)이고 키는 ERD 뉴스 테이블 컬럼을 camelCase로 바꾼 가정이다(`newsSn`·`newsClsfCd`·`newsSrcCd`·`newsTtl`·`newsCn`·`srcPressNm`·`orgtxtPath`·`pblcnDt`·`thmbUrlPath`). 카테고리 코드 건강 `CMUC0018`·생활 `0019`·정책 `0020`·여행 `0021`, 출처 코드 외부 `CMUC0022`·관리자 등록 `CMUC0023`(사람이 DB에서 확인)
- 결정: 상세 PK `newsSn`(ERD `NEWS_SN`), 요약 컬럼이 없어 목록 요약은 `newsCn` 앞부분, 카테고리 URL은 이름(`?category=건강`)·서버에는 코드, 「목록으로」는 본문 하단에서 보던 목록 쿼리를 이어 감, 공유하기는 [링크 복사]·[다른 앱으로 공유](`navigator.share` 지원 시), 카테고리 배지와 「관리자 등록」 배지는 `NewsCategoryBadge` 하나가 같이 그림(사람이 유지로 결정)
- 추가 요청(유효): 추가-1 카드 박스 리스트(썸네일 세로 늘어남·모바일 맨 위), 추가-2 검색 0건 화면, 추가-3 「많이 본 뉴스」는 넣었다가 기획에 없어 뺌, 추가-4 간격·굵기, 추가-5 `SubPageLayout` 적용, 추가-6 「목록으로」 본문 하단·최신 기사 날짜 MM.DD
- 검증: `yarn -s lint` 0, `yarn -s build` 0 (1회차 `실패`: 공유하기 패널 없음·상세 「목록으로」 중복, 이후 모든 회차 `통과`)

## 다음에 할 것

- SCR-CMU-003 연결 남음: 뉴스 API(KSJ 백엔드)로 `features/news/api.js` 가짜 교체(응답 키·코드 값·썸네일 URL 확인, 수집은 RSS), 첨부 이미지(`atchFileSn`) 표시(응답 모양을 본 뒤), 로그인 연결 후 `ProtectedRoute`로 감싸기(AIC)
- 펫뉴스 「많이 본 뉴스」 레일: 디자인에는 있으나 기능명세서에 FN이 없고 ERD에 조회수 컬럼도 없어 뺐다(사람 결정 2026-10-22). 사람이 기능명세서에 FN(조회수 집계·기준 기간)과 ERD 컬럼을 추가하면 목록 오른쪽(1100px 이하는 목록 아래)과 상세 레일에 넣는다(디자인 `.st-rail`·`.rank`)
- LJS 요청: `SubPageLayout`에 `back={false}`를 넘기면 머리에 목록용 메뉴 전환 ▾(761~1100px)가 켜진다(`hasSwitch = !title && !hasBack`). 본문 하단에 「목록으로」를 두는 상세(펫뉴스·공지)는 ▾와 위 「목록으로」를 모두 끄는 prop(예: `back="none"`)이 필요한지 정한다
- CMU 화면은 `SubPageLayout`(`section="community"`)으로 만든다(사람 결정 2026-10-22): 상세는 `title` 없이 제목이 메뉴 이름이고 「목록으로」는 본문 하단, 글쓰기·수정은 `title="글쓰기"`와 `onLeave`로 「작성을 그만둘까요?」 확인, 본문 위 여백은 펫이야기 목록 `min-[1101px]:pt-0`, 펫돌봄·실종센터 목록 `min-[1101px]:pt-[7px]`
- 고객센터(`CustomerCenterLayout`, KSJ)도 `SubPageLayout`(`section="support"`)으로 옮긴다(LJS 핸드오프). 옮기면 `SideMenu`의 `menuLabel` 호환과 `/dev/sub-page`를 지운다
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
- 마일스톤 순서: CMU-001 → CMU-002 → CMU-004 (`milestones/KSJ.md`). COM-009·CMU-005 화면은 2026-10-21 LJS로 이관(채팅 API는 KSJ). 고객센터 겉틀(`CustomerCenterLayout`)의 메뉴·헤더는 FAQ·1:1 문의가 같이 쓴다. 부제는 그 화면 Figma 문구를 `MENUS`에 넣는다
- (2026-10-21 화면은 LJS로 이관, 채팅 API는 KSJ. 목록·대화·읽음·소켓 이벤트의 요청·응답 모양을 LJS와 먼저 맞춘다) SCR-COM-009 연결 남음(LJS 핸드오프에서 넘어옴): `ChatModalPlaceholder.jsx`를 실제 셸로 교체하고 `ChatModal.jsx`의 DEV 조건 제거, 헤더 안 읽은 수 배지(002-11), 004-09 펫돌봄 알림이 채팅방을 열게 하는 방 식별자(`otoChatRoomSn`, YAY), 마지막에 본 방을 새로고침 뒤에도 기억할지
- 다른 PC에서 이어 갈 때: `.env.local`에 `DMS_MCP_URL`·`FIGMA_FILE_URL`을 디스코드 최신 파일로 채운다(`FIGMA_TOKEN`은 비어도 됨). `.cache/`는 git 제외라 화면설계서는 `/start`가 DMS에서 다시 받고 Figma PNG는 노드를 Figma MCP로 다시 받는다
