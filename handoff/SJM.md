# SJM 핸드오프

## 지금 하는 것

SCR-MYP-005 공동양육자 추가 — 끝 (승인 2026-10-21 21:43, 검증 1회차 통과, 사람 확인 완료)
기준: 기능명세서 v0.4_20261021 FN-MYP-005-01~08, 화면설계서 v0.6_20261021 SCR-MYP-005(5-1~5-4)
디자인: 시안 폴더(저장소 밖) `nmcare-design-v5/`(2026-10-21 갱신판)의 `myp-pets.html`의 [가족 초대하기] 모달·보낸 초대 영역, `myp-pets-invite.html`의 초대 수락·거절 확인 모달. 색·폰트는 `00styleguide.html`·`myp.css`. Figma 토큰이 없어 시안 폴더를 쓴다

- 공통: 5-1 초대 모달·5-2 보낸 초대는 반려동물 관리(`/mypage/pets`) 안. 5-3 초대 수락은 새 페이지(URL은 아래 "라우트"), 5-4 거절 확인은 그 페이지 안 모달
- 공통 API: 초대 발송·보낸 초대 조회·초대 조회·수락·거절(SJM 백엔드, 아직 없음) → 가짜 응답으로 먼저 만들고 나중에 연결. 가짜는 `features/pet/api.js`에 `fakeInvitations`와 `createInvitation({ invtEml, petSns })`·`getSentInvitations()`·`getInvitation(invitationToken)`·`acceptInvitation(invitationToken)`·`rejectInvitation(invitationToken)`. 추정 키 `invitationToken`(확정 필요)·`invtSn`·`invtEml`·`invtSttsCd`(대기·수락·거절·만료)·`invtDt`·`expryDt`·`mbrYn`·`invtrNcnm`·`pets[]`. 가짜 수락은 초대 동물을 `fakePets`에 공동양육으로 넣는다. `queries.js`에 `invitationKeys`와 훅(발송·수락·거절 성공 시 관련 키 무효화)
- FN-MYP-005-01 이메일 초대: 새 파일 `features/pet/list/InviteModal.jsx`. 이메일 입력 + [확인]은 형식 검사만(상대 조회 없음). 형식이 틀리면 입력란 아래 오류 문구. `pages/mypage/PetListPage.jsx`의 `onInvite`(지금 "준비 중" 토스트)를 모달 열기로 바꾼다. 완료 조건 `화면:` [＋ 가족 초대하기]를 누르면 모달이 뜨고, 잘못된 이메일이면 오류 문구가 보이며 [초대 보내기]가 비활성이다
- FN-MYP-005-02 반려동물 선택: 같은 모달. 내가 주양육자인 동물만 체크박스로(공동양육 동물은 빼고), 슬라이드에서 보던 동물이 기본 선택, 동물마다 "N/5명"(N은 공동양육자 수, 주양육자 제외. 사람 결정 2026-10-21), 공동양육자 5명이면 비활성 + "초대 불가". 이메일 확인 + 1마리 이상 선택일 때만 [초대 보내기] 활성. 성공 시 모달을 닫고 토스트 "초대를 보냈어요", 실패 시 모달을 두고 오류 토스트. 완료 조건 `화면:` 공동양육자 5명이 찬 동물은 체크박스가 비활성이다. 보내면 보낸 초대 맨 위에 대기중 1건이 생긴다
- FN-MYP-005-03 보낸 초대: 새 파일 `features/pet/list/SentInvitations.jsx`, 가족관리 아래에 둔다. 계정 전체 기준이라 슬라이드를 넘겨도 바뀌지 않는다. 이메일 — 동물명, 발송일 · 가입 여부, 대기중은 만료 예정일, 상태 배지. 0건이면 빈 안내. 완료 조건 `화면:` 대기중 항목에 만료 예정일이 보이고, 슬라이드를 넘겨도 목록이 그대로다
- FN-MYP-005-04 초대 만료: 발송일 + 7일이 지난 대기 건은 화면에서 "만료됨"으로 보인다(가짜는 `expryDt` 비교, 실제는 서버 상태). 재발송 버튼 없음. 완료 조건 `화면:` 가짜 데이터의 만료 건에 "만료됨" 배지가 보이고 버튼이 없다
- FN-MYP-005-05 초대 수락 화면: 새 페이지 `pages/mypage/InvitationPage.jsx`, 새 파일 `features/pet/invite/InvitationAccept.jsx`. "{동물명들}의 공동양육자가 되어주세요", "{초대자}님이 초대했어요", 동물 카드(종 아이콘·이름·품종·나이), 안내 문구. [수락] → 즉시 연동 후 `/mypage/pets`로 이동. 만료·거절·수락된 초대면 수락 버튼 대신 상태 안내. 완료 조건 `화면:`(라우트 PR이 합쳐진 뒤) 가짜 대기 초대 URL로 들어가 [수락]을 누르면 `/mypage/pets`로 가고 슬라이드에 그 동물이 공동양육으로 보인다
- FN-MYP-005-06 나중에 하기: 상태를 바꾸지 않고 `PATHS.MYPAGE`로 이동(마이페이지 홈 SCR-MYP-001이 아직 없어 지금은 빈 화면. 홈을 만들면 이어진다). 완료 조건 `화면:`(라우트 PR 뒤) [나중에 하기]를 누르면 URL이 `/mypage`가 된다
- FN-MYP-005-07·08 거절·거절 확인: 새 파일 `features/pet/invite/InvitationRejectDialog.jsx`(`PetUnlinkDialog`처럼 제목·설명 문단). "초대를 거절할까요?" / "거절하면 이 초대는 사라져요. 다시 참여하려면 {초대자}님께 초대를 다시 받아야 해요." [취소]·바깥·Esc는 그대로 닫고, [거절]은 요청 종료 후 화면을 "거절한 초대" 상태로 바꾼다. 가짜 보낸 초대 목록에서도 상태가 "거절"이 된다. 완료 조건 `화면:`(라우트 PR 뒤) [거절] → [취소]면 수락 화면이 그대로, [거절] 확인 뒤에는 [수락]이 사라진다
- 라우트: `/mypage/invitations/:invitationToken`으로 가정한다(routes.md 규칙: 복수형 + `/:<PK>`). 경로 변수 이름 `invitationToken`은 백엔드 확정 전이라 **확정 필요**. `docs/routes.md`·`routes/paths.js`·`routes/domains/mypage/mypageRoutes.js`는 이 기능 PR에 넣지 않고 별도 PR로 올린다(사람 결정 2026-10-21). 이 PR에서는 `InvitationPage`가 `useParams()`의 `invitationToken`을 읽게만 만든다. 라우트 PR이 develop에 합쳐지기 전에는 5-3·5-4를 URL로 확인할 수 없다
- 바꿀 파일: `features/pet/api.js`, `features/pet/queries.js`, 새 `features/pet/list/InviteModal.jsx`·`SentInvitations.jsx`, 새 `features/pet/invite/InvitationAccept.jsx`·`InvitationRejectDialog.jsx`, `pages/mypage/PetListPage.jsx`, 새 `pages/mypage/InvitationPage.jsx`
- 완료 조건 `명령:` `yarn -s lint`, `yarn -s build`
- 범위 밖: 가입 회원 인앱 알림·미가입 이메일 발송(서버, 알림 저장 YAY), 알림 드롭다운의 초대 알림 클릭(SCR-COM-004, 공통), 회원가입 완료 직후 자동 노출(SCR-ACC-001, YAY·AIC)

결정1: N/5명은 주양육자를 빼고 공동양육자만 센다(사람 결정 2026-10-21)
결정2: 수락 화면 URL은 `/mypage/invitations/:invitationToken`으로 가정, 경로 변수 이름은 확정 필요. 라우트 파일 변경은 별도 PR(사람 결정 2026-10-21)

새 의존성: 없음

## 다음에 할 것
- SCR-MYP-005 라우트 별도 PR: `docs/routes.md` 1장에 MYP-005(5-3) 초대 수락 `/mypage/invitations/:invitationToken` 행, 4장 "지금"에 경로 변수 확정 항목, `routes/paths.js`에 `MYPAGE_INVITATION`, `routes/domains/mypage/mypageRoutes.js`에 `InvitationPage` 연결. 경로 변수 이름 `invitationToken`은 백엔드와 **확정 필요**. 라우트 PR 뒤 `/mypage/invitations/demo-wait`·`demo-expired`로 5-3·5-4를 실제 URL에서 다시 확인하고 캡처를 다시 찍는다
- SCR-MYP-005 연결 남음: 초대 API(SJM 백엔드)가 나오면 `features/pet/api.js`의 가짜(`createInvitation`·`getSentInvitations`·`getInvitation`·`acceptInvitation`·`rejectInvitation`, 추정 키 `invtSn`·`invitationToken`·`invtEml`·`invtSttsCd`·`invtDt`·`expryDt`·`mbrYn`·`invtrNcnm`·`pets`, 상태 `INVT_STTS`)를 실제 요청으로 바꾸고 만료 판정(`withExpiry`)을 서버 상태로 바꾼다. 인앱 알림·메일 발송(알림 저장 YAY), 알림 드롭다운 진입(SCR-COM-004), 가입 직후 자동 노출(SCR-ACC-001, YAY·AIC)과 맞춘다
- SCR-MYP-005 팀에 확인: 수락·거절·만료 초대 안내 문구와 "초대를 찾을 수 없어요"는 화면설계서에 없어 새로 썼다. [나중에 하기]는 마이페이지 홈(SCR-MYP-001)이 없어 지금은 빈 화면으로 간다. 거절 팝업은 공용 `components/Modal`(isConfirm)을 썼다
- SCR-MYP-006 연결 남음: 자진 해제 API(SJM 백엔드)가 나오면 `features/pet/api.js`의 가짜 `leavePet`(추정 `DELETE /pets/{petSn}/caregivers/me`)를 실제 요청으로 바꾼다. 로그인(AIC)이 나오면 내 연동을 서버가 회원으로 가리는지 맞춘다. 화면으로 못 본 것: 해제 실패 토스트, 공동양육 동물만 있다가 해제해 빈 화면이 되는 경우(가짜 데이터에 없음)
- SCR-MYP-006 팀에 확인: 해제 팝업은 기획의 `components/ConfirmModal` 대신 `PetDeleteDialog`처럼 직접 만들었다(ConfirmModal에 설명 문단 자리가 없음)
- SCR-MYP-004 연결 남음: 양육관계 조회·강제 해제 API(SJM 백엔드)가 나오면 `features/pet/api.js`의 가짜(`getCaregivers`·`deleteCaregiver`, 추정 키 `rltnSn`·`mbrNcnm`·`cgvrRoleCd`·`authrtNm`·`lnkDt`·`myYn`)를 실제 요청으로 바꾸고 응답에 맞춘다. 공동양육자 시점에서 서버가 주양육자 + 본인 1건만 주는지, 강제 해제를 주양육자만 가능하게 서버가 막는지 맞춘다
- SCR-MYP-004 연결 남음: 로그인(AIC)이 나오면 `/mypage/pets`는 `ProtectedRoute` 아래로(기존 항목). 팀에 확인: 공동양육자 시점 "나 (이서연)" 카드는 [공동양육] 배지가 1280px에서 카드 밖으로 28px 넘친다(시안 v5 `.myp-mem-n{white-space:nowrap}`와 같음). 슬라이드 정보 영역과 가족 구분선 사이는 시안(56px)보다 좁힌 32px(사람 요청). 모바일 밀어 넘기기는 시안 문구대로 넣었다. 기능명세서 16:00판은 DMS에 아직 14시판만 있다
- SCR-MYP-040 연결 남음: 회원 조회·수정·검증 API(member, AIC)가 나오면 `features/member/api.js`의 가짜(`getMyProfile`·`verifyPassword`·`checkNickname`·`checkPhone`·`update*`, 추정 키 `acntEml`·`mbrNcnm`·`mbrTelno`·`prflImgUrl`·`snsTyCd`·`dplctYn`·`mbrJoinPathCd`·`mbrRegDt`·`mbrLastLgnDt`)를 실제 요청으로 바꾼다. 사진은 업로드 방식(multipart 여부)을 맞춘다
- SCR-MYP-040 연결 남음: 회원 탈퇴 화면(SCR-ACC-020, YAY) 경로가 생기면 [회원 탈퇴 ›] 토스트를 `/mypage/withdraw` 이동으로 바꾼다. 로그인(AIC)이 나오면 `/mypage/profile`을 `ProtectedRoute` 아래로 옮긴다
- SCR-MYP-020 연결 남음: 포인트·케어미션 API(SJM 백엔드)가 나오면 `features/point/api.js` 가짜(`getPointBalance`·`getPointHistory`·`getCareMissions`, 추정 키 `pntBal`·`earnTotAmt`·`pntHstTyCd`·`msnNm`·`cmplYn` 등)를 실제 요청으로 바꾸고 `?fake=empty` 분기를 지운다. 미션 출제·정산·검진기록 20P(FN-MYP-020-05·06·08)는 서버 일이다 (health JAJ, 커뮤니티 KSJ)
- SCR-MYP-020 연결 남음: 건강 일지(SCR-HLT-002, JAJ) 경로가 생기면 [건강 일지] 토스트를 이동으로, 픽셀 캐릭터(SCR-MYP-010)를 만들면 `/mypage/characters` 이동이 이어진다
- SCR-MYP-020 팀에 확인: 지난 날짜에도 "오늘 획득"으로 나오는 문구(시안 문구 그대로), 요약 카드를 눌러 스크롤하면 sticky 헤더에 제목이 가려지므로 `scroll-mt`를 넣을지. 시안 v5(`nmcare-design-v5`)에서 페이지 배경 `#FDFCFB`·푸터 `#FCF9F7`로 바뀌었는데 `UserLayout.jsx`·`UserFooter.jsx`(LJS)는 옛 값 그대로
- SCR-MYP-031 연결 남음: 가계부 API(SJM 백엔드)가 나오면 `createExpenses`·`updateExpense`·`findDuplicateExpenses`를 실제 요청으로, 영수증 인식(YAY, OCR 호출부 LJS)이 나오면 `recognizeReceipt`를 실제 요청으로 바꾸고 추정 키를 응답에 맞춘다. 중복 확인을 서버가 저장 요청 안에서 하는지, 병원 공용 금지·미래 달 제한을 서버도 검사하는지 맞춘다
- 건강 일지에서 병원 영수증을 저장하면 가계부에 1건이 자동 기록된다(FN-AIM-009-10, JAJ·YAY). 이 기록이 `rcptSn`으로 연결되는지 팀과 맞춘다
- SCR-MYP-030 연결 남음: FN-MYP-030-08 한도 알림 발송(서버 인앱 알림, 알림 저장 YAY·가계부 API SJM 백엔드)
- 가계부 API(SJM 백엔드)가 나오면 `features/expense/api.js` 가짜를 실제 요청으로 바꾸고 위 추정 키를 응답에 맞춘다. 집계(카테고리·반려동물별·주요 지출·지난달 대비)를 서버가 주면 `features/expense/shared/expenseStats.js` 집계를 그 값으로 바꾼다
- 삭제된 반려동물의 이름이 서버에 남는지 백엔드에서 확인한다(화면은 "이름 (삭제됨)"으로 표시). 기능명세서 FN-MYP-030-10·FN-MYP-002-07 문구가 이 표기와 맞는지도 확인한다
- 명세가 모호해 정한 것을 팀에 확인한다: 금액순 정렬은 전체를 금액순으로 늘어놓고 같은 날짜가 이어진 것만 묶어서 날짜 머리가 여러 번 나올 수 있다. 전체 내역 상단 합계·건수는 필터와 무관하게 그 달 전체다. 편집 중 필터·정렬을 바꾸면 편집이 풀린다(FN-MYP-030-17 그대로). 반려동물별 지출 비율은 반올림 때문에 합이 101%가 될 수 있다
- 캐릭터 이미지 API(LJS)가 나오면 슬라이드 얼굴(`chrcFaceUrl`)을 실제 이미지로 바꾼다. 지금은 종별 기본 얼굴이다
- 목표체중 오류 문구 "0보다 큰 숫자로 입력해 주세요"는 화면설계서에 없지만 필요해서 유지한다(2026-10-20 사람 결정). 명세에 문구를 넣을지는 팀에 확인한다
- `index.css`의 그림자 토큰을 시안 이름에 맞춰 바꿨다(2026-10-20 사람 결정): `shadow-depth-sm`·`md`·`lg`(구 card·pop·modal), `ring-focus`·`ring-error`(`@utility`, 구 focus·error). Tailwind 기본 `shadow-sm`·`lg`를 쓰는 다른 화면이 있어 `depth`를 붙였다. `OPEN_ISSUES.md` 스타일링 항목에 제안으로 적었고, 팀이 합의하면 확정한다
- 디자인 반영 때 정한 스타일 결정(토큰을 `@theme`에, Pretendard CDN, 브랜드 색 #285a5c 계열, 아이콘은 lucide 대응, 가계부용 tone·warn 색 토큰 추가)을 팀과 맞춘 뒤 `docs/OPEN_ISSUES.md` 스타일링 항목을 갱신한다
- SCR-MYP-001을 만들 때 마이페이지 홈도 `SubPageLayout section="mypage"`(`layouts/`, LJS 공용)로 감싼다. 반려동물 관리·포인트·가계부·전체 내역·회원정보 수정은 이미 이 레이아웃의 경로 머리와 사이드 메뉴를 쓴다(추가-1). 픽셀 캐릭터(SCR-MYP-010)·공동양육자 추가(SCR-MYP-005) 화면도 같은 방식으로 만든다
- 털색 신규 6개(강아지 황색·세이블·멀, 고양이 젖소·카오스·포인트)는 백엔드가 코드 번호를 정하면 `features/pet/shared/petCodes.js`의 `COLR`와 `COLR_OPTIONS`에 넣는다. 이름 변경(블랙탄·파티)과 순서는 커밋 08c33cf에 반영됨
- SCR-MYP-010 캐릭터 만들기 1단계는 털색을 읽기 전용으로 보이고 생성 요청에 `colrCd`·`colrDrctInptNm`을 넣는다(FN-MYP-010-08)
- 등록 상한은 주양육 동물만 센다. 슬라이드 "N / 총마리"는 공동양육을 포함한다(명세대로)
- 로그인(AIC)이 나오면 `/mypage/pets`·`/mypage/expenses`·`/mypage/expenses/all`을 `ProtectedRoute` 아래로 옮긴다
- 품종 마스터 API(KSJ)가 나오면 `getVarieties` 가짜 응답을 실제 요청으로 바꾼다
- 반려동물 API(SJM 백엔드)가 나오면 `features/pet/api.js`의 가짜 응답(`getPets`·`getPet`·`createPet`·`updatePet`)을 실제 요청으로 바꾸고, 체중 기록 키 이름(`lastBdwgRcd`)을 응답에 맞춘다
- 건강 일지(SCR-HLT-002, JAJ) 경로가 생기면 [건강 일지에서 기록하기]를 연결한다
