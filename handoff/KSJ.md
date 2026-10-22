# KSJ 핸드오프

## 지금 하는 것

SCR-CMU-004 우리동네 펫돌봄 (시작 2026-10-22) — 상태: 진행 중 (중간 저장 2026-10-22). 기능 ID 01~13과 추가 요청 1~10을 구현했고 `yarn -s lint` 0·`yarn -s build` 0. 화면 검증은 못 함: 검증 판정 `실패`(회차 1, 검증 세션에 Playwright MCP 없음, 코드 결함은 못 찾음). 이후 추가 요청 1~10은 검증 에이전트를 거치지 않았다. 사람 확인도 아직 없다

- 근거: 기능명세서 `커뮤니티_기능명세서_v0.7_20261019.xlsx`, 화면설계서 `커뮤니티_화면설계서_v0.7_20261019.html`(DMS 인증이 막혀 디자인 폴더 `nmcare-design-v5-scr/docs/`의 같은 파일을 `.cache/dms/`에 복사)
- 디자인: `html/SCR-CMU-004-01.html`(목록), `-02.html`(상세), `-02-M1.html`(작성자 채팅 목록, LJS 채팅 창이 그리므로 참고만), `-03.html`(글쓰기), `-04.html`(글수정). 디자인 폴더 `nmcare-design-v5-scr/CMU/`에서 복사, git 제외
- 채팅(COM-009 창·CMU-005)은 LJS가 끝냄(develop PR #56). 이 화면은 `hooks/useChatWindow`의 `open()`만 클릭 핸들러에서 바로 부른다
- 가짜 응답 키: ERD `PST`+`PET_PRTC_RCRT`+`RCRT_PET_KND`+`RCRT_PRTC_SHP` 컬럼 camelCase. 서버가 PST와 합쳐 준다고 가정. 좋아요·신고·채팅은 `pstSn`, 상세·수정·삭제 URL은 `petPrtcRcrtSn`(`routes/paths.js`에 이미 있음, 채팅 쪽 링크도 이 키). 상태 `rcrtSttsCd`(PCAG01)·비용 단위 `cstUnitCd`(PCAG02)·돌봄 형태 `prtcShpCd`(PCAG03)·반려동물 `petSeCd`(PETG01) 코드 값은 가정. ERD에 없어 서버 계산을 가정: `sggNm`·`emdNm`(RGN_SN)·`wrtrNcknm`·`chatCnt`·`likeYn`·`likeCnt`·`mineYn`·`thmbUrlPath`·`atchFiles`·`vrtyNm`·`inqCnt`. 상세 주소(`PRTC_PLC_DADDR_ENC`)·정확한 좌표는 공개 응답에 넣지 않는다(FN-10)

| 기능 | 바꿀 파일 | API | 완료 조건 |
| --- | --- | --- | --- |
| FN-CMU-004-01 목록 | `features/community/{careApi,careQueries,careCodes}.js`, `features/community/care/{CareList,CareCard,CareStatusBadge,CareGuideRail}.jsx`, `pages/community/CareListPage.jsx`, `routes/domains/community/communityRoutes.js` | 가짜(`careApi.js`, 메모리). 연결은 KSJ 백엔드 | 화면: `/community/petcare`에 최신순 10건, 제목 1행·설명 2행 말줄임, 배지(내 글·상태·돌봄 형태·반려견 크기/고양이)·지역·일정·비용(시급/건당)·작성자·경과 시간·「채팅 n명」, 쪽 번호 최대 10개와 ›, 오른쪽 「돌봄 전, 꼭 확인해요」(1100px 이하는 목록 아래), 카드 클릭 시 상세. [돌봄 요청 등록하기]는 목록 오른쪽 아래·쪽 번호 위 |
| FN-CMU-004-02 필터 | `features/community/care/CareFilters.jsx`, 지역 목록은 `missingCodes.js`의 `REGION_OPTIONS`·`DONG_BY_REGION` 재사용 | 가짜 | 화면: 전체·모집중 탭, 「내 글만 보기」와 n건, [상세 필터] 펼침·접힘, 시·군·구→읍·면·동 연동(전북 전체·전주시 전체는 읍·면·동 비활성, 시·군·구 바꾸면 읍·면·동 전체로), 돌봄 날짜 범위(그 기간에 일정이 겹치는 글, 일정 미정 글은 날짜 필터 때 제외), 반려동물 전체·강아지·고양이, 반려견 크기(고양이면 비활성), 모두 AND, 바꾸면 1쪽, 0건이면 「조건에 맞는 돌봄 요청이 없어요」+[필터 초기화] |
| FN-CMU-004-04 상세 | `features/community/care/{CareDetail,CareInfoTable}.jsx`, `pages/community/CareDetailPage.jsx` | 가짜 | 화면: `SubPageLayout` 제목 없이, 상태 배지+제목, 작성자·작성일(점 표기)·조회, `PostBody`(사진·본문), 반려동물(품종·크기)·일정(미정이면 「채팅으로 협의」)·장소(「○○동 인근」)·비용 표, 「돌봄에 관한 문의와 일정 협의는 [채팅하기]에서…」 안내, 댓글 없음, 본문 아래 「‹ 목록으로」, 없는 번호는 안내 |
| FN-CMU-004-05 채팅하기 | `CareDetail.jsx` | `useChatWindow` (LJS, 끝남) | 화면: 남의 모집중 글에 [채팅하기] → `open({ pstSn })`. 작성자에게는 [채팅하기] 대신 「지금 n명과 채팅 중」+[채팅 목록 보기] → `open({ listPstSn: pstSn })`. 매칭완료·거래완료 글은 이미 채팅한 사람(가짜 `chatYn`)만 [채팅하기], 나머지는 버튼 비활성과 「모집이 끝났어요」. 팝업 차단(`false`)이면 토스트로 안내 |
| FN-CMU-004-06 반려동물·돌봄 형태 | `features/community/care/CareForm.jsx`, `BreedCombobox` 재사용 | 가짜 | 화면: 강아지·고양이 1개 이상(동시 가능), 종류별 품종 콤보, 강아지면 몸무게 소형·중형·대형 필수(강아지 해제 시 값 제외), 돌봄 형태 6개 중 1개 이상. 빠지면 저장 막고 칸 아래 오류 |
| FN-CMU-004-07 기간·시간 | `CareForm.jsx` | — | 화면: 시작·종료일 달력(`input type=date`), 시간 00:00~23:30 30분 단위, 종료 일시가 시작보다 뒤가 아니면 오류, 「일정은 채팅으로 협의할게요」 체크 시 비워도 등록(입력한 값은 희망 일정으로 그대로 보냄) |
| FN-CMU-004-08 비용 | `CareForm.jsx`, `components/AmountInput` 재사용, 최저 시급은 `careCodes.js` 상수 `MIN_HOURLY_WAGE = 10320`(연도 문구 포함, 관리자 갱신은 연결 때) | — | 화면: 시급·건당 택1, 양의 정수, 시급 10,319원이면 「최저임금을 준수해 주세요. 2026년 최저 시급은 10,320원이에요.」와 등록 차단, 10,320원은 통과, 건당은 비교 안 함 |
| FN-CMU-004-09 제목·설명·사진 | `CareForm.jsx`, `ImageAttach`·`AutoTextarea` 재사용 | — | 화면: 제목 50자·설명 2,000자 글자 수, 공백만이면 오류, 사진 최대 10장·10MB·JPG/PNG/WEBP, 미리보기·개별 삭제(펫이야기와 같은 컴포넌트) |
| FN-CMU-004-10 주소 찾기 | `missing/PlaceSearchModal.jsx`에 `title`·`confirmLabel` prop 추가(기본값은 지금 문구라 실종센터 변화 없음), `CareForm.jsx` | 장소 검색 가짜(`useSearchMissingPlaces` 재사용). 연결은 AIC | 화면: [주소 찾기] → 「주소 찾기」 모달 → 검색·선택·지도 → [돌봄 장소로 설정] → 폼에 「○○동 인근」과 안내 문구, 다시 눌러 재선택, 닫으면 기존 값 유지. 장소 필수 |
| FN-CMU-004-11 등록·수정·삭제 | `CareForm.jsx`, `pages/community/Care{Write,Edit}Page.jsx`, `routes/paths.js`에 `COMMUNITY_PETCARE_NEW`(`/community/petcare/new`)·`COMMUNITY_PETCARE_EDIT`(`/:petPrtcRcrtSn/edit`), `docs/routes.md` CMU-004 줄 | 가짜 | 화면: 필수값·동의 충족 시 모집중으로 등록 후 상세, 수정은 같은 폼에 기존 값(디자인 `-04`), 작성자에게만 수정·삭제(삭제 확인 후 목록), 쓰는 중 목록으로·취소·다른 메뉴는 `onLeave`로 「작성을 그만둘까요?」. 로그인 전이라 `ProtectedRoute` 없음 |
| FN-CMU-004-12 좋아요·신고 | `CareDetail.jsx`, `ReportModal` 재사용 | 가짜 | 화면: 좋아요 토글로 수 ±1, [신고] → 사유 선택 → 완료 토스트, 같은 글 두 번째 신고는 「이미 신고한 게시글이에요」. 작성자 글에는 신고 숨김 |
| FN-CMU-004-13 품종 | `CareForm.jsx`(`BreedCombobox`, 품종 목록은 `useBreeds`) | 가짜(VRTY 마스터 연결은 다음) | 화면: 종류별 목록에서 선택, [직접 입력] 시 20자 입력란, 미선택·미입력은 저장 차단, 표시는 `vrtyNm` 없으면 `vrtyDrctInptNm` |
| 공통 | — | — | 명령: `yarn -s lint` 0, `yarn -s build` 0. 화면: 375·760·1100·1440px에서 가로 스크롤 없음(푸터 원인은 제외), 왼쪽 메뉴 「우리동네 펫돌봄」 선택 상태 |

### 추가 요청

| 번호 | 바꿀 파일 | 완료 조건 | 요청 |
| --- | --- | --- | --- |
| 추가-1 | `features/community/care/CareList.jsx`, `pages/community/CareListPage.jsx`, `careQueries.js` | 화면: 모집 상태 탭·내 글만 보기·상세 필터가 콘텐츠 영역 전체 너비를 쓰고 그 아래에서 목록(왼쪽)과 안내 레일(오른쪽)이 나뉜다(디자인 `SCR-CMU-004-01.html`의 `.cl-tools`) | 요청 2026-10-22 "목록: 디자인과 동일하게 필터 영역이 콘텐츠 영역 전체 너비만큼" |
| 추가-2 | `features/community/care/CareAreaMap.jsx`, `CareDetail.jsx` | 화면: 상세 지도 영역 높이 320px, 좋아요를 누르면 하트 아이콘만 `#F44B21`(숫자는 그대로) | 요청 2026-10-22 "상세: 지도 영역 높이 320px, 하트 컬러 수정" |
| 추가-3 | `features/community/care/CareForm.jsx` | 화면: 「체크하면 기간 · 시간을 비워 두고 등록할 수 있어요」가 「일정은 채팅으로 협의할게요」 체크박스 오른쪽에 같은 줄로 나온다. [등록] 버튼 왼쪽 아이콘 없음(그대로) | 요청 2026-10-22 "글쓰기: 안내 문구를 체크 문구 오른쪽으로" |
| 추가-4 | `features/community/care/CareFilters.jsx` | 화면: 상세 필터가 디자인 `.cf`처럼 1280px 초과에서 2×2(지역 \| 돌봄 날짜 / 반려동물 \| 반려견 크기) 격자, 1280px 이하는 라벨+입력 한 줄씩, 760px 이하는 라벨 위·입력 아래 | 요청 2026-10-22 "목록 필터 영역을 디자인(SCR-CMU-004-01)과 같게" |
| 추가-5 | `features/community/care/CareForm.jsx` | 화면: 글쓰기·수정 맨 위 「* 표시는 꼭 입력해야 해요」 삭제(칸 옆 빨간 * 표시는 그대로) | 요청 2026-10-22 "* 표시는 꼭 입력해야 해요 삭제" |
| 추가-6 | `features/community/care/CareFormParts.jsx` | 화면: 글쓰기 입력 요소 사이 간격 `gap: calc(var(--spacing) * 8)`(32px), 예: 종류와 강아지 품종 사이 | 요청 2026-10-22 "입력 요소 사이 간격 8" |
| 추가-7 | `features/community/care/CareForm.jsx` | 화면: 펫돌봄 글쓰기·수정의 체크박스·라디오 줄 최소 높이 32px(라벨과 간격 축소) | 요청 2026-10-22 "체크박스·라디오 min-height 32px" |
| 추가-8 | `features/community/PostForm.jsx`, `features/community/missing/MissingForm.jsx` | 화면: 펫이야기·실종센터 글쓰기·수정 맨 위 「* 표시는 꼭 입력해야 해요」 삭제(펫돌봄은 추가-5) | 요청 2026-10-22 "CMU의 모든 글쓰기 페이지에서 해당 텍스트 삭제" |
| 추가-9 | `features/community/missing/MissingFilters.jsx`, `MissingList.jsx`, `pages/community/MissingListPage.jsx` | 화면: 실종센터 목록의 상태 탭·검색·상세 필터·건수가 콘텐츠 전체 너비를 쓰고 그 아래에서 카드 목록(왼쪽)과 레일(오른쪽)이 나뉜다. 필터는 디자인 `SCR-CMU-002-01.html`의 `.cf`처럼 1280px 초과에서 첫 줄 실종 지역 \| 반려동물, 둘째 줄 실종 기간(전체 너비) | 요청 2026-10-22 "실종센터 목록도 필터 영역이 콘텐츠 전체 차지" |
| 추가-10 | `features/community/PostForm.jsx`, `features/community/missing/MissingForm.jsx`, `features/community/care/CareForm.jsx` | 화면: CMU 글쓰기·수정 폼 모두 입력 요소 사이 간격 32px(`gap-8`), 체크박스·라디오 줄 최소 높이 32px(`min-h-8`) | 요청 2026-10-22 "추가-7과 입력 요소 간격 8을 CMU 모든 글쓰기 폼에 적용" |

- 확인만 한 요청(변경 없음): 「CMU 댓글: 답글쓰기 옆 삭제 유지, 오른쪽 ⋮ 누르면 신고하기」는 `CommentSection` 한 곳이 펫이야기·실종센터에 같이 쓰이고 이미 그 형태다(내 댓글은 삭제, 남의 댓글은 ⋮ → 신고하기). 펫돌봄은 공개 댓글이 없다

- 결정(사람, 2026-10-22): 디자인은 `html/SCR-CMU-004-*.html`을 쓴다. 가짜 응답은 크기 구간 코드(`petSizeCd`, 가정)로 두고 고양이는 비운다
- 사람이 정할 것: ERD `RCRT_PET_KND.PET_BDWG`(체중, NOT NULL 숫자)와 폼의 크기 구간 선택이 맞지 않는다. ERD를 구간 코드 컬럼으로 바꾸거나 폼에 체중 입력을 둔다
- 새 의존성: 없음

## 다음에 할 것

- SCR-CMU-004 화면 검증(맨 위): Playwright MCP가 붙은 세션에서 `yarn dev` 후 `/verify`(루프는 `clear`했으므로 잠금 없음, 새로 회차 1부터), 또는 사람이 확인한 결과를 `/end`에서 답한다. 확인 항목은 위 기획 표의 `화면:` 조건과 추가 요청 1~10(필터 배치 1440·1100·375px, 간격·체크/라디오 높이, 실종센터 목록 필터)
- SCR-CMU-004 연결 남음: 돌봄 모집 게시글·좋아요·신고 API(KSJ 백엔드)로 `careApi.js` 교체(응답 키·코드 값 `PCAG01~03`·`petSizeCd`·`chatCnt`·`chatYn`·`mtchSttrNcknm` 확인, 다르면 화면 코드의 키도 같이 바꾼다), 장소 검색·역지오코딩(AIC), 품종 마스터(`VRTY`) API, 최저 시급 설정값(관리자 ADM), 글쓰기·수정 `ProtectedRoute`와 [돌봄 요청 등록하기]·[채팅하기] 비로그인 로그인 이동 후 복귀(AIC), `PET_BDWG` 체중 문제(위 사람이 정할 것)
- 실종센터 목록은 필터를 바꾸면 목록이 새로 불러와져 필터 영역이 잠깐 사라질 수 있다. 펫돌봄처럼 `missingQueries.js`의 `useMissingList`에 `placeholderData: keepPreviousData`를 넣을지 정한다
- SCR-CMU-001 연결 남음: 게시글·댓글·좋아요·신고·레일 API(KSJ 백엔드)로 `features/community/api.js` 가짜 교체(가정 키·게시판 코드 값 `CMUG01`·`popYn`·`cmntCnt`·`mineYn`·인기 포토·건강팁 응답 확인, 응답 키가 다르면 화면 코드의 키도 같이 바꾼다), 로그인 연결 후 글쓰기·수정 `ProtectedRoute`와 비로그인 좋아요·댓글·글쓰기 로그인 이동 후 복귀(AIC), 댓글 알림 저장(YAY `notification`). 기능명세서에 없는 「내 댓글 삭제」는 사람이 명세에 보완
- SCR-CMU-002 연결 남음: 실종 게시글·댓글·좋아요·신고·연장·찾았어요 API(KSJ 백엔드)로 `missingApi.js` 교체(응답 키·상태 코드 `CMUG03` 값·`sggNm`/`emdNm`/`cnpl`/`wtnsPlcAddr` 제공 방식 확인, 다르면 화면 코드의 키도 같이 바꾼다), 장소 검색·역지오코딩(AIC), 품종 마스터(`VRTY`) API, 연락처 로그인 회원에게만 보이기·[실종 등록하기] 로그인 이동 후 복귀·글쓰기 `ProtectedRoute`(AIC), 종료 7일·1일 전 알림 저장(YAY `notification`)
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
- 마일스톤 순서: CMU-001 → CMU-002(끝) → CMU-004(진행 중, 위) (`milestones/KSJ.md`). COM-009·CMU-005 화면은 2026-10-21 LJS로 이관(채팅 API는 KSJ). 고객센터 겉틀(`CustomerCenterLayout`)의 메뉴·헤더는 FAQ·1:1 문의가 같이 쓴다. 부제는 그 화면 Figma 문구를 `MENUS`에 넣는다
- (2026-10-21 화면은 LJS로 이관, 채팅 API는 KSJ. 목록·대화·읽음·소켓 이벤트의 요청·응답 모양을 LJS와 먼저 맞춘다) SCR-COM-009 연결 남음(LJS 핸드오프에서 넘어옴): `ChatModalPlaceholder.jsx`를 실제 셸로 교체하고 `ChatModal.jsx`의 DEV 조건 제거, 헤더 안 읽은 수 배지(002-11), 004-09 펫돌봄 알림이 채팅방을 열게 하는 방 식별자(`otoChatRoomSn`, YAY), 마지막에 본 방을 새로고침 뒤에도 기억할지
- 다른 PC에서 이어 갈 때: `.env.local`에 `DMS_MCP_URL`·`FIGMA_FILE_URL`을 디스코드 최신 파일로 채운다(`FIGMA_TOKEN`은 비어도 됨). `.cache/`는 git 제외라 화면설계서는 `/start`가 DMS에서 다시 받고 Figma PNG는 노드를 Figma MCP로 다시 받는다
