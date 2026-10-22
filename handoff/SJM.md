# SJM 핸드오프

## 지금 하는 것

SCR-MYP-001 마이페이지 홈 — 끝 (승인 2026-10-22 13:30, 검증 통과, 추가 요청 1건, 사람 확인 완료)
`/mypage`에 요약 3칸(포인트·이번달 지출액·오늘의 케어미션)과 내 반려동물 카드(대표·공동양육·오류 확인 중 배지, 6마리 + 더보기, 0마리 안내)를 가짜 API로 만들었다. 코드는 `pages/mypage/MyPageHomePage.jsx`, `features/{point,expense,pet}/home/`, 공용 `components/StatLink.jsx`다. 추가-1: 포인트 칸 아이콘을 돼지 저금통에서 P 글자로 바꿨다(요청 2026-10-22)

## 다음에 할 것
- SCR-MYP-001 연결 남음: 캐릭터 이미지 API(LJS)가 나오면 홈 카드 얼굴(`chrcFaceUrl`)을 실제 이미지로 바꾼다. 그때 기본 얼굴(종별 아이콘·톤 바탕·오류 흑백)을 `features/pet/shared/PetFace.jsx`로 묶어 `PetMiniCard`·`PetProfileCard`·`PetSlide`가 같이 쓰게 한다. 지금은 `PetMiniCard`가 따로 그린다(기획은 재사용이었으나 `PetProfileCard`의 얼굴이 80px 둥근 사각형 JSX라 그대로 쓸 수 없었다)
- SCR-MYP-001 결정 남음: 반려동물 관리 카드(`PetProfileCard`·슬라이드)를 전신 캐릭터로 바꿀지. 정해지면 위 `PetFace` 묶음의 모양(원형·사각형·전신)이 달라지므로 같이 정한다
- SCR-MYP-001 팀에 확인: 홈 반려동물 영역은 불러오는 동안 아무것도 그리지 않는다(기획의 로딩 자리표시보다 약함). 0마리 안내 버튼은 등록 모달을 바로 열지 않고 `/mypage/pets`로 이동만 한다. `?fake=empty`는 이동하면 사라져 가짜 데이터에서는 관리 화면이 10마리로 뜨는데 서버 연결 뒤에는 생기지 않는다. 로그인(AIC)이 나오면 `/mypage`도 `ProtectedRoute` 아래로 옮긴다
- SCR-MYP-011 연결 남음: 상점 API(LJS)가 나오면 `features/pet/api.js`의 가짜 `getShopItems`·`purchaseCharacterItems`(추정 `GET /items`, `POST /pets/{petSn}/character/items`, 추정 키 `itemPrc`)를 실제 요청으로 바꾼다. 포인트 차감은 서버 일이라 가짜는 잔액이 줄지 않는다. 캐릭터·아이템 이미지(LJS)가 나오면 미리보기 겹침을 화면으로 확인한다(지금은 이미지가 없어 안 보임)
- SCR-MYP-011 팀에 확인: 기준 문서 `v0.6_20261022`가 DMS에 없어 FN-MYP-011-03·04를 사람이 준 수치(760×660, 카드 간격 등)로 만들었다. 문서가 올라오면 대조한다. 공용 `Modal`에 `isLarge`를 더했으니(LJS 공용) 공용 파일 변경으로 알린다
- SCR-MYP-005: 경로 변수 이름 `invitationToken`은 백엔드와 확정 필요(`docs/routes.md` 4장 10번). 새 URL은 PR #57로 develop에 들어갔다
- SCR-MYP-010 연결 남음: 캐릭터 API(LJS)가 나오면 `features/pet/api.js`의 가짜(`createCharacter`·`getCharacterItems`·`updateCharacterWear`, 추정 키 `chrcSttsCd`·`chrcImgUrl`·`inqryRcptYn`·`itemSn`·`itemNm`·`itemPartCd`·`itemImgUrl`·`wearYn`, 부위·상태 코드 `ITEM_PART`·`CHRC_STTS`는 `petCodes.js`)를 실제 요청으로 바꾼다. 대표 지정 API(SJM 백엔드)가 나오면 `setRepresentativePet`도 바꾼다. 개발 전용 `?fake=empty|owner|fail`은 그때 지운다
- SCR-MYP-010 연결 남음: 오류 문의(KSJ, SCR-CSC-003)는 `/inquiries/new`로 router state `{ inquiryType: 'PIXEL_CHARACTER', petSn, imageUrl }`를 넘긴다. 문의 작성 화면이 이 state를 받아 유형·이미지를 미리 채우는지, 유형 값을 무엇으로 할지 KSJ와 맞춘다. 생성 완료·오류 처리 인앱 알림(알림 저장 LJS)과 아이템 상점 모달(SCR-MYP-011)도 남았다
- SCR-MYP-010 팀에 확인: 시안에 캐릭터·아이템 이미지가 없어 lucide 아이콘 자리표시자다(이미지가 나오면 `chrcImgUrl`·`itemImgUrl`로 겹침이 그려진다). 가짜 데이터에서 까미·모모를 공동양육으로 바꿨다(`/mypage/pets`에도 반영). 오류 확인 중 카드에 [대표 지정]이 보이는데 시안엔 없다. 꾸미기의 뒤로 가기 링크는 공용 "목록으로"다
- SCR-MYP-005 연결 남음: 초대 API(SJM 백엔드)가 나오면 `features/pet/api.js`의 가짜(`createInvitation`·`getSentInvitations`·`getInvitation`·`acceptInvitation`·`rejectInvitation`, 추정 키 `invtSn`·`invitationToken`·`invtEml`·`invtSttsCd`·`invtDt`·`expryDt`·`mbrYn`·`invtrNcnm`·`pets`, 상태 `INVT_STTS`)를 실제 요청으로 바꾸고 만료 판정(`withExpiry`)을 서버 상태로 바꾼다. 인앱 알림·메일 발송(알림 저장 YAY), 알림 드롭다운 진입(SCR-COM-004), 가입 직후 자동 노출(SCR-ACC-001, YAY·AIC)과 맞춘다
- SCR-MYP-005 팀에 확인: 수락·거절·만료 초대 안내 문구와 "초대를 찾을 수 없어요"는 화면설계서에 없어 새로 썼다. [나중에 하기]는 마이페이지 홈(SCR-MYP-001)이 없어 지금은 빈 화면으로 간다. 거절 팝업은 공용 `components/Modal`(isConfirm)을 썼다
- SCR-MYP-006 연결 남음: 자진 해제 API(SJM 백엔드)가 나오면 `features/pet/api.js`의 가짜 `leavePet`(추정 `DELETE /pets/{petSn}/caregivers/me`)를 실제 요청으로 바꾼다. 로그인(AIC)이 나오면 내 연동을 서버가 회원으로 가리는지 맞춘다. 화면으로 못 본 것: 해제 실패 토스트, 공동양육 동물만 있다가 해제해 빈 화면이 되는 경우(가짜 데이터에 없음)
- SCR-MYP-006 팀에 확인: 해제 팝업은 기획의 `components/ConfirmModal` 대신 `PetDeleteDialog`처럼 직접 만들었다(ConfirmModal에 설명 문단 자리가 없음)
- SCR-MYP-004 연결 남음: 양육관계 조회·강제 해제 API(SJM 백엔드)가 나오면 `features/pet/api.js`의 가짜(`getCaregivers`·`deleteCaregiver`, 추정 키 `rltnSn`·`mbrNcnm`·`cgvrRoleCd`·`authrtNm`·`lnkDt`·`myYn`)를 실제 요청으로 바꾸고 응답에 맞춘다. 공동양육자 시점에서 서버가 주양육자 + 본인 1건만 주는지, 강제 해제를 주양육자만 가능하게 서버가 막는지 맞춘다
- 로그인(AIC)이 나오면 `/mypage/expenses`·`/mypage/expenses/all`도 `ProtectedRoute` 아래로 옮긴다
- SCR-MYP-004 연결 남음: 로그인(AIC)이 나오면 `/mypage/pets`는 `ProtectedRoute` 아래로(기존 항목). 팀에 확인: 공동양육자 시점 "나 (이서연)" 카드는 [공동양육] 배지가 1280px에서 카드 밖으로 28px 넘친다(시안 v5 `.myp-mem-n{white-space:nowrap}`와 같음). 슬라이드 정보 영역과 가족 구분선 사이는 시안(56px)보다 좁힌 32px(사람 요청). 모바일 밀어 넘기기는 시안 문구대로 넣었다. 기능명세서 16:00판은 DMS에 아직 14시판만 있다
- SCR-MYP-040 연결 남음: 회원 조회·수정·검증 API(member, AIC)가 나오면 `features/member/api.js`의 가짜(`getMyProfile`·`verifyPassword`·`checkNickname`·`checkPhone`·`update*`, 추정 키 `acntEml`·`mbrNcnm`·`mbrTelno`·`prflImgUrl`·`snsTyCd`·`dplctYn`·`mbrJoinPathCd`·`mbrRegDt`·`mbrLastLgnDt`)를 실제 요청으로 바꾼다. 사진은 업로드 방식(multipart 여부)을 맞춘다
- SCR-MYP-040 연결 남음: 회원 탈퇴 화면(SCR-ACC-020, YAY) 경로가 생기면 [회원 탈퇴 ›] 토스트를 `/mypage/withdraw` 이동으로 바꾼다. 로그인(AIC)이 나오면 `/mypage/profile`을 `ProtectedRoute` 아래로 옮긴다
- SCR-MYP-020 연결 남음: 포인트·케어미션 API(SJM 백엔드)가 나오면 `features/point/api.js` 가짜(`getPointBalance`·`getPointHistory`·`getCareMissions`, 추정 키 `pntBal`·`earnTotAmt`·`pntHstTyCd`·`msnNm`·`cmplYn` 등)를 실제 요청으로 바꾸고 `?fake=empty` 분기를 지운다. 미션 출제·정산·검진기록 20P(FN-MYP-020-05·06·08)는 서버 일이다 (health JAJ, 커뮤니티 KSJ)
- SCR-MYP-020 연결 남음: 건강 일지(SCR-HLT-002, JAJ) 경로가 생기면 [건강 일지] 토스트를 이동으로, 픽셀 캐릭터(SCR-MYP-010)를 만들면 `/mypage/characters` 이동이 이어진다
- SCR-MYP-020 팀에 확인: 지난 날짜에도 "오늘 획득"으로 나오는 문구(시안 문구 그대로), 요약 카드를 눌러 스크롤하면 sticky 헤더에 제목이 가려지므로 `scroll-mt`를 넣을지. 시안 v5(`nmcare-design-v5`)에서 페이지 배경 `#FDFCFB`·푸터 `#FCF9F7`로 바뀌었는데 `UserLayout.jsx`·`UserFooter.jsx`(LJS)는 옛 값 그대로
- SCR-MYP-031 연결 남음: 가계부 API(SJM 백엔드)가 나오면 `createExpenses`·`updateExpense`·`findDuplicateExpenses`를 실제 요청으로, 영수증 인식(YAY, OCR 호출부 LJS)이 나오면 `recognizeReceipt`를 실제 요청으로 바꾸고 추정 키를 응답에 맞춘다. 중복 확인을 서버가 저장 요청 안에서 하는지, 병원 공용 금지·미래 달 제한을 서버도 검사하는지 맞춘다
- 건강 일지에서 병원 영수증을 저장하면 가계부에 1건이 자동 기록된다(FN-AIM-009-10, JAJ·YAY). 이 기록이 `rcptSn`으로 연결되는지 팀과 맞춘다
- SCR-MYP-030 연결 남음: FN-MYP-030-08 한도 알림 발송(서버 인앱 알림, 알림 저장 YAY·가계부 API SJM 백엔드)
- 삭제된 반려동물의 이름이 서버에 남는지 백엔드에서 확인한다(화면은 "이름 (삭제됨)"으로 표시). 기능명세서 FN-MYP-030-10·FN-MYP-002-07 문구가 이 표기와 맞는지도 확인한다
- 명세가 모호해 정한 것을 팀에 확인한다: 금액순 정렬은 전체를 금액순으로 늘어놓고 같은 날짜가 이어진 것만 묶어서 날짜 머리가 여러 번 나올 수 있다. 전체 내역 상단 합계·건수는 필터와 무관하게 그 달 전체다. 편집 중 필터·정렬을 바꾸면 편집이 풀린다(FN-MYP-030-17 그대로). 반려동물별 지출 비율은 반올림 때문에 합이 101%가 될 수 있다
- 캐릭터 이미지 API(LJS)가 나오면 슬라이드 얼굴(`chrcFaceUrl`)을 실제 이미지로 바꾼다. 지금은 종별 기본 얼굴이다
- 목표체중 오류 문구 "0보다 큰 숫자로 입력해 주세요"는 화면설계서에 없지만 필요해서 유지한다(2026-10-20 사람 결정). 명세에 문구를 넣을지는 팀에 확인한다
- `index.css`의 그림자 토큰을 시안 이름에 맞춰 바꿨다(2026-10-20 사람 결정): `shadow-depth-sm`·`md`·`lg`(구 card·pop·modal), `ring-focus`·`ring-error`(`@utility`, 구 focus·error). Tailwind 기본 `shadow-sm`·`lg`를 쓰는 다른 화면이 있어 `depth`를 붙였다. `OPEN_ISSUES.md` 스타일링 항목에 제안으로 적었고, 팀이 합의하면 확정한다
- 디자인 반영 때 정한 스타일 결정(토큰을 `@theme`에, Pretendard CDN, 브랜드 색 #285a5c 계열, 아이콘은 lucide 대응, 가계부용 tone·warn 색 토큰 추가)을 팀과 맞춘 뒤 `docs/OPEN_ISSUES.md` 스타일링 항목을 갱신한다
- SCR-MYP-001을 만들 때 마이페이지 홈도 `SubPageLayout section="mypage"`(`layouts/`, LJS 공용)로 감싼다. 반려동물 관리·포인트·가계부·전체 내역·회원정보 수정은 이미 이 레이아웃의 경로 머리와 사이드 메뉴를 쓴다(추가-1). 픽셀 캐릭터(SCR-MYP-010)·공동양육자 추가(SCR-MYP-005) 화면도 같은 방식으로 만든다
- 털색 신규 6개(강아지 황색·세이블·멀, 고양이 젖소·카오스·포인트)는 백엔드가 코드 번호를 정하면 `features/pet/shared/petCodes.js`의 `COLR`와 `COLR_OPTIONS`에 넣는다. 이름 변경(블랙탄·파티)과 순서는 커밋 08c33cf에 반영됨
- 등록 상한은 주양육 동물만 센다. 슬라이드 "N / 총마리"는 공동양육을 포함한다(명세대로)
- 품종 마스터 API(KSJ)가 나오면 `getVarieties` 가짜 응답을 실제 요청으로 바꾼다
- 반려동물 API(SJM 백엔드)가 나오면 `features/pet/api.js`의 가짜 응답(`getPets`·`getPet`·`createPet`·`updatePet`)을 실제 요청으로 바꾸고, 체중 기록 키 이름(`lastBdwgRcd`)을 응답에 맞춘다
- 건강 일지(SCR-HLT-002, JAJ) 경로가 생기면 [건강 일지에서 기록하기]를 연결한다

