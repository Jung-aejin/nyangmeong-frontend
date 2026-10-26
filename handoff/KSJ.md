# KSJ 핸드오프

## 지금 하는 것

SCR-CMU-004 우리동네 펫돌봄 (시작 2026-10-22, 끝 2026-10-23) — 상태: 끝 (검증 판정 `통과`, 사람 확인 2026-10-23)

- 만든 것: `features/community/{careApi,careQueries,careCodes}.js`, `features/community/care/{CareList,CareCard,CareFilters,CareStatusBadge,CareGuideRail,CareDetail,CareSideBox,CareAreaMap,CareForm,CareFormParts,careFormStyles,CareWriteGuide,careUtils}`, `pages/community/Care{List,Detail,Write,Edit}Page.jsx`, 라우트 `/community/petcare`·`/new`·`/:petPrtcRcrtSn`·`/:petPrtcRcrtSn/edit`(`ProtectedRoute` 없이). 실종센터의 `BreedCombobox`·`PlaceSearchModal`(`title`·`confirmLabel` prop 추가)·`CheckList`와 `ImageAttach`·`ReportModal`·`PostBody`를 같이 쓴다. 채팅은 LJS의 `useChatWindow`만 부른다(`open({ pstSn })`·`open({ listPstSn })`)
- 디자인: `html/SCR-CMU-004-*.html`(디자인 폴더 `nmcare-design-v5-scr/CMU/`에서 복사, git 제외). 기능명세서·화면설계서는 DMS 인증이 막혀 디자인 폴더의 v0.7 파일을 `.cache/dms/`에 복사해 썼다
- 가짜 응답(`careApi.js`, 메모리): 키는 ERD(PST·PET_PRTC_RCRT·RCRT_PET_KND·RCRT_PRTC_SHP) 컬럼 camelCase. 좋아요·신고·채팅은 `pstSn`, 상세·수정·삭제는 `petPrtcRcrtSn`. 코드 값(`PCAG01~03`·`petSizeCd`)은 가정. 서버 계산을 가정한 값: `sggNm`·`emdNm`·`wrtrNcknm`·`chatCnt`·`chatYn`·`mtchSttrNcknm`·`likeYn`·`mineYn`·`thmbUrlPath`·`atchFiles`. 상세 주소·정확한 좌표는 공개 응답에 넣지 않는다
- 결정: 크기는 구간 코드(`petSizeCd`)로 두고 고양이는 비운다, 입력 요소 세로 간격 36px(`gap-9`)를 세 글쓰기 폼에 맞춤(사람이 직접 지정), 1100px·1280px 경계는 `max-[1101px]`·`max-[1281px]`(사람이 되돌리지 않기로 함)
- 추가 요청(유효): 추가-1~16(펫돌봄 목록·상세·글쓰기 디자인 맞춤, 세 글쓰기 폼의 「* 표시…」 삭제·간격·최소 높이, 실종센터 목록 필터 전체 너비, 펫이야기·펫돌봄 카드 썸네일 크롭·두 줄 높이·모바일 위치, `SideMenu`·`SubPageLayout` 이탈 확인)
- 영향: `layouts/SideMenu.jsx`·`SubPageLayout.jsx`(LJS 공용 겉틀)에 `onLeave`를 넘겼다. `onLeave`를 안 넘기는 화면은 그대로다. 헤더(GNB)는 `BrowserRouter`라 이탈 확인을 못 한다
- 사람이 정할 것: ERD `RCRT_PET_KND.PET_BDWG`(체중, NOT NULL 숫자)와 폼의 크기 구간 선택이 맞지 않는다. ERD를 구간 코드 컬럼으로 바꾸거나 폼에 체중 입력을 둔다
- 검증: `yarn -s lint` 0, `yarn -s build` 0 (회차마다 실패 항목을 고친 뒤 `통과`)

SCR-CMU-003 펫뉴스 목록 썸네일 높이, SCR-CMU-002 실종센터 지도 움직이기 (시작 2026-10-26, 마일스톤 끝난 뒤 추가 요청)

### 추가 요청

| 추가-1 | `features/news/NewsList.jsx` | 명령: `yarn -s lint`·`yarn -s build` 0 / 화면: `/community/news`에서 본문이 1줄인 카드와 2줄 이상인 카드의 썸네일 높이가 같다(본문 2줄 높이가 기본) | 요청 2026-10-26 "본문 길이에 따라 썸네일 이미지가 달라지는 부분 수정, 본문 2줄 형태를 기본 높이로" |
| 추가-2 | `features/community/missing/MissingMap.jsx` | 명령: `yarn -s lint`·`yarn -s build` 0 / 화면: 실종센터 상세·글쓰기 미리보기·장소 검색 모달의 지도를 끌어서 옮길 수 있다 | 요청 2026-10-26 "글쓰기 미리보기와 검색 모달, 상세보기 모두에서 지도를 움직이게" |
| 추가-3 | `features/community/missing/{MissingMap,MissingForm,PlaceSearchModal}.jsx` | 명령: `yarn -s lint`·`yarn -s build` 0 / 화면: 실종센터 글쓰기 미리보기 지도 높이 400px, 지도에 +/− 버튼, 글쓰기 미리보기·장소 검색 모달에서 지도를 끌면 반경 원이 지도 가운데로 옮겨지고 그 좌표가 목격 장소 좌표가 된다 | 요청 2026-10-26 "글쓰기 미리보기 지도 높이 h-[400px], 지도를 움직여 핀을 옮기면 그 위치를 중심으로 설정, +/− 버튼" |
| 추가-4 | `components/Modal.jsx`(`isWide` prop 추가, 기본은 그대로), `features/community/missing/PlaceSearchModal.jsx` | 명령: `yarn -s lint`·`yarn -s build` 0 / 화면: 장소 찾기 모달이 데스크톱에서 가로 640px, 제목 줄 위아래 패딩 8px, 왼쪽 검색 영역 240px·오른쪽 지도, 하단 버튼 오른쪽 정렬, 760px 이하는 위아래로 쌓이고 지도 220px(− 버튼이 잘리지 않게) | 요청 2026-10-26 "모달 타이틀 상하 패딩 8px, 좌우로 나눠 왼쪽 검색·오른쪽 지도, 데스크톱 640px, 검색 영역 240px, 하단 버튼 오른쪽 하단" → 2026-10-26 사람 요청으로 되돌림(`Modal.jsx`·모달 배치 원래대로, 추가-3의 지도 끌기·+/− 버튼은 유지) |
| 추가-5 | `components/Modal.jsx`(`isWide` prop 추가, 기본은 그대로), `features/community/missing/PlaceSearchModal.jsx` | 명령: `yarn -s lint`·`yarn -s build` 0 / 화면: 장소 찾기 모달은 한 칸 그대로, 제목 줄 위아래 8px, 지도 가로 560px·높이 400px(모달 가로 608px), 하단 버튼 오른쪽 아래 | 요청 2026-10-26 "타이틀 상하 여백 8px, 지도가 잘 안 보여 높이 400px·가로 560px, 모달 전체 크기도 늘어남, 버튼은 오른쪽 하단" |
| 추가-6 | `features/community/missing/{placeSearch.js,PlaceSearchModal,MissingMap}.jsx`, `missingApi.js`·`missingQueries.js`(가짜 장소 검색 제거) | 명령: `yarn -s lint`·`yarn -s build` 0 / 화면: 장소 찾기 모달이 두 단계(검색 → 위치 맞추기)다. 장소명·동·주소를 한 칸에서 카카오 장소·주소 검색으로 찾고 전북 결과만 보인다. 결과를 고르면 지도로 넘어가고 「‹ 다시 검색」으로 돌아간다. 지도를 끌면 그 자리의 주소·시군구·동으로 바뀌고 전북 밖이면 「전북 지역만 선택할 수 있어요」 후 이전 위치로 돌아간다(글쓰기 미리보기도 같다) | 요청 2026-10-26 "장소 검색을 카카오 장소·주소 검색 두 단계 모달로 진행, 지역은 전북 한정, 지도를 움직여 선택" |
| 추가-7 | `features/community/missing/PlaceSearchModal.jsx` | 명령: `yarn -s lint`·`yarn -s build` 0 / 화면: 장소 찾기 검색칸 왼쪽 아이콘이 없고 안내 문구가 장소·동·도로명 주소 검색에 맞다. 글자를 입력하면 [검색]을 누르지 않아도 잠시 뒤 결과 목록이 나온다(지우면 목록이 사라진다) | 요청 2026-10-26 "플레이스홀더를 검색 구현에 맞게, 왼쪽 검색 아이콘 삭제, 입력하면서 검색 버튼 없이 목록이 나오게" |
| 추가-8 | `components/Modal.jsx`(`isTop` prop 추가, 기본은 그대로), `features/community/missing/{PlaceSearchModal,MissingForm}.jsx` | 명령: `yarn -s lint`·`yarn -s build` 0 / 화면: 검색칸 안내 문구가 「장소·동 이름, 도로명 주소 검색」이다. 실종 글쓰기의 「아직 고르지 않았어요」 칸을 눌러도 장소 찾기 모달이 열린다. 장소 찾기 모달은 화면 위에서 120px 떨어져 고정되고 결과가 늘어도 위치가 움직이지 않는다 | 요청 2026-10-26 "플레이스홀더 수정, 장소 표시 칸 클릭해도 검색창, 검색 모달을 상단 120px 고정" |
| 추가-9 | `components/Modal.jsx` | 명령: `yarn -s lint`·`yarn -s build` 0 / 화면: 장소 찾기 모달이 위에서 80px, 가로 688px(본문·지도 640px) | 요청 2026-10-26 "상단 마진 80px, 모달 가로 80px 더 넓게" |
| 추가-10 | `components/Modal.jsx`(`isTop`), `features/community/missing/PlaceSearchModal.jsx`, `features/community/care/CareForm.jsx`(안내 문구) | 명령: `yarn -s lint`·`yarn -s build` 0 / 화면: 장소 찾기 모달이 길어지면 모달 안이 아니라 화면 전체가 스크롤된다(결과 목록도 안쪽 스크롤 없음). 검색칸 placeholder가 없고 안내 문구는 「마지막으로 본 곳 근처의 장소나 동 이름 검색」, 검색칸이 본문 너비 전체이고 검색은 칸 안 오른쪽 돋보기 버튼 | 요청 2026-10-26 "모달이 길면 전체 화면 스크롤, placeholder 삭제·안내 문구 수정·영역은 내용 전체, 검색 버튼을 인풋 안 오른쪽 돋보기 아이콘으로" |
| 추가-11 | `features/community/care/{CareAreaMap,CareForm,CareDetail}.jsx`, `features/community/missing/{placeSearch.js,MissingMap.jsx}` | 명령: `yarn -s lint`·`yarn -s build` 0 / 화면: 펫돌봄 글쓰기·수정의 「아직 고르지 않았어요」 칸을 눌러도 주소 찾기가 열리고, 미리보기와 상세에 실종센터와 같은 카카오 지도(높이 400px, 반경 원, +/−)가 보인다. 글쓰기는 지도를 끌면 동이 바뀌고, 상세는 공개 좌표가 없어 동 중심을 보여 준다. 고른 동 이름이 목록 읍·면·동 필터 값(예: 효자동1가→효자동)과 맞는다(실종센터도 같다) | 요청 2026-10-26 "펫돌봄 등록 폼도 같은 지도 검색, 읍면동 필터에 맞게, 상세·글쓰기 지도가 안 보여 실종센터와 같은 크기·형태로" |
| 추가-12 | `features/community/care/CareForm.jsx` | 명령: `yarn -s lint`·`yarn -s build` 0 / 화면: 펫돌봄 글쓰기의 장소 버튼과 모달 제목이 「돌봄 장소 찾기」 | 요청 2026-10-26 "펫돌봄 글등록 주소찾기 버튼명과 모달 타이틀을 돌봄 장소 찾기로" |

## 다음에 할 것

- SCR-CMU-004 연결 남음: 돌봄 모집 게시글·좋아요·신고 API(KSJ 백엔드)로 `careApi.js` 교체(응답 키·코드 값 `PCAG01~03`·`petSizeCd`·`chatCnt`·`chatYn`·`mtchSttrNcknm` 확인, 다르면 화면 코드의 키도 같이 바꾼다), 장소 검색·역지오코딩은 프론트에서 카카오 SDK로 처리하도록 바꿈(2026-10-26 추가-6, AIC 담당과 합의 필요), 품종 마스터(`VRTY`) API, 최저 시급 설정값(관리자 ADM), 글쓰기·수정 `ProtectedRoute`와 [돌봄 요청 등록하기]·[채팅하기] 비로그인 로그인 이동 후 복귀(AIC), `PET_BDWG` 체중 문제(위 사람이 정할 것)
- 실종센터 목록은 필터를 바꾸면 목록이 새로 불러와져 필터 영역이 잠깐 사라질 수 있다. 펫돌봄처럼 `missingQueries.js`의 `useMissingList`에 `placeholderData: keepPreviousData`를 넣을지 정한다
- SCR-CMU-001 연결 남음: 게시글·댓글·좋아요·신고·레일 API(KSJ 백엔드)로 `features/community/api.js` 가짜 교체(가정 키·게시판 코드 값 `CMUG01`·`popYn`·`cmntCnt`·`mineYn`·인기 포토·건강팁 응답 확인, 응답 키가 다르면 화면 코드의 키도 같이 바꾼다), 로그인 연결 후 글쓰기·수정 `ProtectedRoute`와 비로그인 좋아요·댓글·글쓰기 로그인 이동 후 복귀(AIC), 댓글 알림 저장(YAY `notification`). 기능명세서에 없는 「내 댓글 삭제」는 사람이 명세에 보완
- SCR-CMU-002 연결 남음: 실종 게시글·댓글·좋아요·신고·연장·찾았어요 API(KSJ 백엔드)로 `missingApi.js` 교체(응답 키·상태 코드 `CMUG03` 값·`sggNm`/`emdNm`/`cnpl`/`wtnsPlcAddr` 제공 방식 확인, 다르면 화면 코드의 키도 같이 바꾼다), 장소 검색·역지오코딩은 프론트에서 카카오 SDK로 처리하도록 바꿈(2026-10-26 추가-6, AIC 담당과 합의 필요), 품종 마스터(`VRTY`) API, 연락처 로그인 회원에게만 보이기·[실종 등록하기] 로그인 이동 후 복귀·글쓰기 `ProtectedRoute`(AIC), 종료 7일·1일 전 알림 저장(YAY `notification`)
- SCR-CMU-002 사람이 정할 것: 실종 기간 필터 기준(화면설계서·기능명세서는 목격 날짜, ERD 비고 2026-09-23은 등록일시 `PST.REG_DT`), 품종 필수 여부(명세는 필수, ERD·디자인은 선택), 기능명세서 FN-CMU-002-09의 자동 댓글 이모지·「찾았어요!」 문구(디자인은 「찾았어요」)
- SCR-CMU-003 연결 남음: 뉴스 API(KSJ 백엔드)로 `features/news/api.js` 가짜 교체(가정 키 `newsSn`·`newsClsfCd`·`newsSrcCd`·`newsTtl`·`newsCn`·`srcPressNm`·`orgtxtPath`·`pblcnDt`·`thmbUrlPath`, 카테고리 `CMUC0018~0021`·출처 `CMUC0022·0023`, 썸네일 URL 확인, 수집은 RSS), 첨부 이미지(`atchFileSn`) 표시(응답 모양을 본 뒤), 로그인 연결 후 `ProtectedRoute`로 감싸기(AIC)
- 펫뉴스 「많이 본 뉴스」 레일: 디자인에는 있으나 기능명세서에 FN이 없고 ERD에 조회수 컬럼도 없어 뺐다(사람 결정 2026-10-22). 사람이 기능명세서에 FN(조회수 집계·기준 기간)과 ERD 컬럼을 추가하면 목록 오른쪽(1100px 이하는 목록 아래)과 상세 레일에 넣는다(디자인 `.st-rail`·`.rank`)
- LJS 요청: `SubPageLayout`에 `back={false}`를 넘기면 머리에 목록용 메뉴 전환 ▾(761~1100px)가 켜진다(`hasSwitch = !title && !hasBack`). 본문 하단에 「목록으로」를 두는 상세(펫뉴스·공지)는 ▾와 위 「목록으로」를 모두 끄는 prop(예: `back="none"`)이 필요한지 정한다
- CMU 화면은 `SubPageLayout`(`section="community"`)으로 만든다(사람 결정 2026-10-22): 상세는 `title` 없이 제목이 메뉴 이름이고 「목록으로」는 본문 하단, 글쓰기·수정은 `title="글쓰기"`와 `onLeave`로 「작성을 그만둘까요?」 확인, 본문 위 여백은 펫이야기 목록 `min-[1101px]:pt-0`, 펫돌봄·실종센터 목록 `min-[1101px]:pt-[7px]`
- 고객센터(`CustomerCenterLayout`, KSJ)도 `SubPageLayout`(`section="support"`)으로 옮긴다(LJS 핸드오프). 옮기면 `SideMenu`의 `menuLabel` 호환과 `/dev/sub-page`를 지운다
- SCR-CSC-003 연결 남음: 문의 API(KSJ 백엔드)로 가짜 교체(응답 키, 목록 `status` 필터·`totalAll`, 첨부 이미지 업로드), FN-003-10 픽셀 캐릭터 화면(MYP-010, SJM)에서 `/inquiries/new?type=픽셀 캐릭터`로 들어오는 링크, FN-003-14 답변 알림 저장(YAY `notification`)과 알림에서 상세로 가는 링크, FN-003-16 로그인 연결 후 `ProtectedRoute`로 감싸기(AIC), 직접 그리는 `DropdownSelect`를 다른 화면의 `Select`에도 쓸지 정하기
- SCR-CSC-003 사람이 고치는 문서: 기능명세서 FN-CSC-003-13의 「[문의 수정] 비활성」을 「버튼 숨김 + 안내 문구」로, 화면설계서 SCR-CSC-003-03 ③의 같은 문구
- SCR-CSC-002 연결 남음: FAQ API(KSJ 백엔드)로 가짜(`features/faq/api.js`) 교체, 응답 키(`faqSn`·`faqClsfNm`·`qstnCn`·`ansCn`)와 분류 값 확인, 로그인 연결 후 `ProtectedRoute`로 감싸기
- SCR-CSC-001 연결 남음: 공지 API(KSJ 백엔드)로 가짜 교체(제목·내용 `keyword` 검색, 고정 공지가 쪽 크기에 들어가는지, 응답 키 확인), 본문 이미지 표시(응답 모양을 본 뒤), 로그인 연결 후 `ProtectedRoute`로 감싸기
- 375px 페이지 가로 스크롤은 공용 푸터가 원인(`UserFooter.jsx`, LJS). develop의 LJS 반응형 작업이 들어오면 다시 본다(FN 추가-4 연결 남음). 푸터 일러스트와 내용 사이 여백도 LJS가 푸터 공통 레이아웃에서 정하고, 그 전까지 고객센터 화면은 내용이 띠에 붙어 보인다
- 사람이 고치는 문서: 기능명세서 FN-CSC-001-03 「공지 제목 검색」→ 제목·내용 검색, FN-CSC-001-01 「제목·작성일만 노출」→ 번호 포함, 화면설계서 SCR-CSC-001-01 ② 검색 문구
- 본문 영역은 `components/PostBody`(최소 200px은 사진과 글을 합친 영역 기준 + 아래 80px 여백)로 맞춘다. 펫이야기·공지·펫뉴스·실종센터·펫돌봄은 적용됨. 남음: 1:1 문의 상세(CSC-003, 사람이 적용 예정). 「‹ 목록으로」와 구분선은 `PostBody` 안에 없고 각 상세가 둔다
- 마일스톤 순서: CMU-001 → CMU-002(끝) → CMU-004(끝) (`milestones/KSJ.md`). COM-009·CMU-005 화면은 2026-10-21 LJS로 이관(채팅 API는 KSJ). 고객센터 겉틀(`CustomerCenterLayout`)의 메뉴·헤더는 FAQ·1:1 문의가 같이 쓴다. 부제는 그 화면 Figma 문구를 `MENUS`에 넣는다
- (2026-10-21 화면은 LJS로 이관, 채팅 API는 KSJ. 목록·대화·읽음·소켓 이벤트의 요청·응답 모양을 LJS와 먼저 맞춘다) SCR-COM-009 연결 남음(LJS 핸드오프에서 넘어옴): `ChatModalPlaceholder.jsx`를 실제 셸로 교체하고 `ChatModal.jsx`의 DEV 조건 제거, 헤더 안 읽은 수 배지(002-11), 004-09 펫돌봄 알림이 채팅방을 열게 하는 방 식별자(`otoChatRoomSn`, YAY), 마지막에 본 방을 새로고침 뒤에도 기억할지
- 다른 PC에서 이어 갈 때: `.env.local`에 `DMS_MCP_URL`·`FIGMA_FILE_URL`을 디스코드 최신 파일로 채운다(`FIGMA_TOKEN`은 비어도 됨). `.cache/`는 git 제외라 화면설계서는 `/start`가 DMS에서 다시 받고 Figma PNG는 노드를 Figma MCP로 다시 받는다
