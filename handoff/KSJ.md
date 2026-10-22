# KSJ 핸드오프

## 지금 하는 것

SCR-CMU-001 펫이야기 (시작 2026-10-22, 끝 2026-10-22) — 상태: 끝 (검증 판정 `통과`, 사람 확인 2026-10-22)

- 만든 것: `features/community/{api,queries,postCodes,PostList,PostBadges,StoryRail,PostDetail,CommentSection,PostForm,PostWriteGuide,useLeaveGuard}`, `pages/community/{PostListPage,PostDetailPage,PostWritePage,PostEditPage}`, 라우트 `/community`·`/community/posts/new`·`/community/posts/:pstSn`·`.../edit`(`ProtectedRoute` 없이). 공통으로 올린 것: `components/{ImageAttach,AutoTextarea,SharePanel,PostBody,ReportModal}`, `utils/fitHeight`, `formatDate.js`의 `formatDateTime`·`formatRelativeTime`. 문의·뉴스·공지는 새 위치를 쓴다
- 디자인: `html/SCR-CMU-001-01·02·02-M1·03·04.html`(디자인 폴더 `nmcare-design-v5-scr/CMU/`에서 복사, git 제외). 게시글·댓글 API가 없어 가짜 응답(`features/community/api.js`, 메모리)이고 키는 ERD(PST·CMNT)를 camelCase로 바꾼 것이다(`pstSn`·`bbsCd`·`pstTtl`·`pstCn`·`inqCnt`·`rcmdtnCnt`·`hlthInfoExpsrSeq`, `cmntSn`·`prntCmntSn`·`cmntCn`·`delYn` 등). ERD에 없어 서버가 계산한다고 가정한 값: `wrtrNcknm`·`popYn`·`cmntCnt`·`thmbUrlPath`·`atchFiles`·`likeYn`·`mineYn`. 게시판 코드는 `postCodes.js`의 가정 값(`CMUC0001` 펫정보·`CMUC0002` 펫일상, `CMUG01`)
- 결정: 검색 URL `?q=`·탭 `?board=`·정렬 `?sort=hot`, 날짜는 하이픈 대신 점(`2026.08.10`·`MM.DD`), 내 댓글 삭제는 [답글쓰기] 옆 버튼(ERD `DEL_YN`, 기능명세서에는 없음), 남의 댓글만 ⋮ → 신고하기, 본문 최소 200px은 사진과 글을 합친 영역 기준, 글쓰기·글수정은 둘 다 `title="글쓰기"`
- 추가 요청(유효): 추가-1 상세 하단·댓글 디자인, 추가-2 본문 최소 높이, 추가-3 이미지 10장이면 추가 칸 비활성, 추가-4 댓글 입력창 위 가로선 삭제, 추가-5 내 댓글 삭제 버튼·남의 댓글 ⋮ 신고, 추가-6 목록 썸네일을 펫뉴스 크기로, 추가-7 1100px 미만에서 오늘의 한마디를 위로, 추가-8 이미지 첨부 한 줄 6개, 추가-9 최신글 박스 없음·날짜 아래, 추가-10 「이렇게 써 주세요」 디자인
- 검증: `yarn -s lint` 0, `yarn -s build` 0 (1회차 `실패`: 최신글 게시판 섞임·검색 URL, 2회차: 본문 200px·「목록 으로」 간격, 3회차: 내 댓글 ⋮, 이후 모든 회차 `통과`)

## 다음에 할 것

- SCR-CMU-001 연결 남음: 게시글·댓글·좋아요·신고·레일 API(KSJ 백엔드)로 `features/community/api.js` 가짜 교체(가정 키·게시판 코드 값 `CMUG01`·`popYn`·`cmntCnt`·`mineYn`·인기 포토·건강팁 응답 확인, 응답 키가 다르면 화면 코드의 키도 같이 바꾼다), 로그인 연결 후 글쓰기·수정 `ProtectedRoute`와 비로그인 좋아요·댓글·글쓰기 로그인 이동 후 복귀(AIC), 댓글 알림 저장(YAY `notification`). 기능명세서에 없는 「내 댓글 삭제」는 사람이 명세에 보완
- CMU 남은 화면(실종센터 CMU-002·펫돌봄 CMU-004)도 같은 공통 규칙(날짜 점 표기, 「목록으로」 본문 하단, `title`/`back`/`onLeave`, 실종센터·펫돌봄 목록 여백 `min-[1101px]:pt-[7px]`)과 `ReportModal`·`ImageAttach`·`AutoTextarea`·`SharePanel`·`PostBody`를 쓴다. 디자인은 Figma와 `nmcare-design-v5-scr/CMU`를 같이 본다

- SCR-CMU-003 연결 남음: 뉴스 API(KSJ 백엔드)로 `features/news/api.js` 가짜 교체(가정 키 `newsSn`·`newsClsfCd`·`newsSrcCd`·`newsTtl`·`newsCn`·`srcPressNm`·`orgtxtPath`·`pblcnDt`·`thmbUrlPath`, 카테고리 `CMUC0018~0021`·출처 `CMUC0022·0023`, 썸네일 URL 확인, 수집은 RSS), 첨부 이미지(`atchFileSn`) 표시(응답 모양을 본 뒤), 로그인 연결 후 `ProtectedRoute`로 감싸기(AIC)
- 펫뉴스 「많이 본 뉴스」 레일: 디자인에는 있으나 기능명세서에 FN이 없고 ERD에 조회수 컬럼도 없어 뺐다(사람 결정 2026-10-22). 사람이 기능명세서에 FN(조회수 집계·기준 기간)과 ERD 컬럼을 추가하면 목록 오른쪽(1100px 이하는 목록 아래)과 상세 레일에 넣는다(디자인 `.st-rail`·`.rank`)
- LJS 요청: `SubPageLayout`에 `back={false}`를 넘기면 머리에 목록용 메뉴 전환 ▾(761~1100px)가 켜진다(`hasSwitch = !title && !hasBack`). 본문 하단에 「목록으로」를 두는 상세(펫뉴스·공지)는 ▾와 위 「목록으로」를 모두 끄는 prop(예: `back="none"`)이 필요한지 정한다
- CMU 화면은 `SubPageLayout`(`section="community"`)으로 만든다(사람 결정 2026-10-22): 상세는 `title` 없이 제목이 메뉴 이름이고 「목록으로」는 본문 하단, 글쓰기·수정은 `title="글쓰기"`와 `onLeave`로 「작성을 그만둘까요?」 확인, 본문 위 여백은 펫이야기 목록 `min-[1101px]:pt-0`, 펫돌봄·실종센터 목록 `min-[1101px]:pt-[7px]`
- 고객센터(`CustomerCenterLayout`, KSJ)도 `SubPageLayout`(`section="support"`)으로 옮긴다(LJS 핸드오프). 옮기면 `SideMenu`의 `menuLabel` 호환과 `/dev/sub-page`를 지운다
- SCR-CSC-003 연결 남음: 문의 API(KSJ 백엔드)로 가짜 교체(응답 키, 목록 `status` 필터·`totalAll`, 첨부 이미지 업로드), FN-003-10 픽셀 캐릭터 화면(MYP-010, SJM)에서 `/inquiries/new?type=픽셀 캐릭터`로 들어오는 링크, FN-003-14 답변 알림 저장(YAY `notification`)과 알림에서 상세로 가는 링크, FN-003-16 로그인 연결 후 `ProtectedRoute`로 감싸기(AIC), 직접 그리는 `DropdownSelect`를 다른 화면의 `Select`에도 쓸지 정하기
- SCR-CSC-003 사람이 고치는 문서: 기능명세서 FN-CSC-003-13의 「[문의 수정] 비활성」을 「버튼 숨김 + 안내 문구」로, 화면설계서 SCR-CSC-003-03 ③의 같은 문구
- SCR-CSC-002 연결 남음: FAQ API(KSJ 백엔드)로 가짜(`features/faq/api.js`) 교체, 응답 키(`faqSn`·`faqClsfNm`·`qstnCn`·`ansCn`)와 분류 값 확인, 로그인 연결 후 `ProtectedRoute`로 감싸기
- 사람이 고치는 문서: 기능명세서 FN-CSC-002-01 「카테고리 배지 표시」와 화면설계서 SCR-CSC-002 ④의 배지 문구를 디자인(배지 없음)에 맞춘다
- SCR-CSC-001 연결 남음: 공지 API(KSJ 백엔드)로 가짜 교체(제목·내용 `keyword` 검색, 고정 공지가 쪽 크기에 들어가는지, 응답 키 확인), 본문 이미지 표시(응답 모양을 본 뒤), 로그인 연결 후 `ProtectedRoute`로 감싸기
- 375px 페이지 가로 스크롤은 공용 푸터가 원인(`UserFooter.jsx`, LJS). develop의 LJS 반응형 작업이 들어오면 다시 본다(FN 추가-4 연결 남음). 푸터 일러스트와 내용 사이 여백도 LJS가 푸터 공통 레이아웃에서 정하고, 그 전까지 고객센터 화면은 내용이 띠에 붙어 보인다
- 사람이 고치는 문서: 기능명세서 FN-CSC-001-03 「공지 제목 검색」→ 제목·내용 검색, FN-CSC-001-01 「제목·작성일만 노출」→ 번호 포함, 화면설계서 SCR-CSC-001-01 ② 검색 문구
- 본문 영역은 `components/PostBody`(최소 200px은 사진과 글을 합친 영역 기준 + 아래 80px 여백)로 맞춘다. 펫이야기·공지·펫뉴스 관리자 글은 적용됨. 남음: 1:1 문의 상세(CSC-003, 사람이 적용 예정이라 함), 실종센터·펫돌봄 상세. 「‹ 목록으로」와 구분선은 `PostBody` 안에 없고 각 상세가 둔다
- 고객센터 헤더 일러스트 크기는 나중에 다시 정한다(지금은 760px 초과에서 160px, 이하는 숨김)
- 마일스톤 순서: CMU-001 → CMU-002 → CMU-004 (`milestones/KSJ.md`). COM-009·CMU-005 화면은 2026-10-21 LJS로 이관(채팅 API는 KSJ). 고객센터 겉틀(`CustomerCenterLayout`)의 메뉴·헤더는 FAQ·1:1 문의가 같이 쓴다. 부제는 그 화면 Figma 문구를 `MENUS`에 넣는다
- (2026-10-21 화면은 LJS로 이관, 채팅 API는 KSJ. 목록·대화·읽음·소켓 이벤트의 요청·응답 모양을 LJS와 먼저 맞춘다) SCR-COM-009 연결 남음(LJS 핸드오프에서 넘어옴): `ChatModalPlaceholder.jsx`를 실제 셸로 교체하고 `ChatModal.jsx`의 DEV 조건 제거, 헤더 안 읽은 수 배지(002-11), 004-09 펫돌봄 알림이 채팅방을 열게 하는 방 식별자(`otoChatRoomSn`, YAY), 마지막에 본 방을 새로고침 뒤에도 기억할지
- 다른 PC에서 이어 갈 때: `.env.local`에 `DMS_MCP_URL`·`FIGMA_FILE_URL`을 디스코드 최신 파일로 채운다(`FIGMA_TOKEN`은 비어도 됨). `.cache/`는 git 제외라 화면설계서는 `/start`가 DMS에서 다시 받고 Figma PNG는 노드를 Figma MCP로 다시 받는다
