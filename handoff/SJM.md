# SJM 핸드오프

## 지금 하는 것

SCR-MYP-006 공동양육 연동 해제(자진 탈퇴) — 구현 중 (승인 2026-10-21)
기준: 기능명세서 v0.4_20261021 FN-MYP-006-01~05, 화면설계서 v0.6_20261021 SCR-MYP-006
디자인: 시안 폴더(저장소 밖)의 `myp-pets-coparent.html` 안 해제 확인 팝업. 색·폰트는 `00styleguide.html`·`acc.css`. Figma 토큰이 없어 시안 폴더를 쓴다

- 공통: 별도 URL 없음. 반려동물 관리(SCR-MYP-002) 슬라이드에서 공동양육 동물 카드 왼쪽의 [연동 해제](지금 "준비 중" 토스트)를 이 팝업으로 바꾼다. 자진 해제는 본인 연동만 끊고 반려동물 데이터는 건드리지 않는다
- 공통 API: 자진 해제(SJM 백엔드, 아직 없음) → 가짜 응답으로 먼저 만들고 나중에 연결. 가짜는 `features/pet/api.js`에 `leavePet(petSn)`(추정 `DELETE /pets/{petSn}/caregivers/me`): 가짜 목록 `fakePets`에서 그 동물을 빼고 `fakeCaregivers[petSn]`의 내 연동(`myYn` 'Y')을 지운다. `queries.js`에 `useLeavePet`(성공 시 `petKeys.all` 무효화 → 목록·가족 둘 다 다시 읽음)
- FN-MYP-006-01 확인 팝업 노출: 새 파일 `features/pet/list/PetUnlinkDialog.jsx`(`components/ConfirmModal` 사용). 제목 "{petNm}와(과)의 가족 연동을 해제할까요?"(받침에 따라 와/과), 설명 "해제하면 {petNm}의 건강기록·프로필에 더 이상 접근할 수 없어요. 다시 연동하려면 재요청이 필요해요.", 버튼 [취소]·[해제]. `pages/mypage/PetListPage.jsx`의 `onUnlink`를 `setUnlinkingPet`으로 바꿔 띄운다. 완료 조건 `화면:` 해피(공동양육)로 넘겨 [연동 해제]를 누르면 위 문구의 팝업이 뜬다
- FN-MYP-006-02 자진 해제: [해제] → `useLeavePet` 호출(요청 중 버튼 비활성). 실패하면 팝업을 두고 "해제하지 못했어요. 잠시 후 다시 시도해 주세요" 토스트. 완료 조건 `화면:` [해제]를 누르면 팝업이 닫힌다
- FN-MYP-006-03 취소: [취소]·바깥 누름·Esc는 상태를 바꾸지 않고 닫는다(ConfirmModal 기본 동작). 완료 조건 `화면:` [취소] 뒤에도 해피가 슬라이드에 그대로 있다
- FN-MYP-006-04 목록 즉시 반영: 무효화로 슬라이드에서 해피가 빠지고, 마지막 장이었으면 기존 `currentIndex` 보정으로 바로 앞 동물이 보인다. 가족 영역도 그 동물 기준으로 다시 그린다. 공동양육 동물만 있던 경우 빈 화면(`PetEmpty`)이 된다. 완료 조건 `화면:` 해제 뒤 점 개수가 1 줄고 해피가 다시 나오지 않는다
- FN-MYP-006-05 완료 안내: 성공 시 토스트 "연동을 해제했어요"(SCR-MYP-004 결정1과 같은 문구). 완료 조건 `화면:` 해제 뒤 토스트가 보인다
- 바꿀 파일: `features/pet/api.js`, `features/pet/queries.js`, 새 파일 `features/pet/list/PetUnlinkDialog.jsx`, `pages/mypage/PetListPage.jsx`
- 완료 조건 `명령:` `yarn -s lint`, `yarn -s build`

질문: 팝업 문구를 화면설계서("…가족 연동을 해제할까요?" / "…건강기록·프로필에 더 이상 접근할 수 없어요. 다시 연동하려면 재요청이 필요해요.")대로 쓸까요, SCR-MYP-004 강제 해제 팝업 말투("…연동을 해제할까요?" / "…기록을 더 이상 볼 수 없어요.")에 맞출까요? (추천: 화면설계서대로. 자진·강제는 주어가 달라 문구가 달라도 된다)
결정: 추천안대로. 화면설계서 문구 그대로, "와/과"는 이름 마지막 글자의 받침으로 고르고(영문·숫자 끝은 "와(과)") 조사 함수는 공용 유틸이 아니라 `features/pet/list/` 안에 둔다(사람 결정 2026-10-21)

새 의존성: 없음

## 다음에 할 것
- SCR-MYP-004 연결 남음: 양육관계 조회·강제 해제 API(SJM 백엔드)가 나오면 `features/pet/api.js`의 가짜(`getCaregivers`·`deleteCaregiver`, 추정 키 `rltnSn`·`mbrNcnm`·`cgvrRoleCd`·`authrtNm`·`lnkDt`·`myYn`)를 실제 요청으로 바꾸고 응답에 맞춘다. 공동양육자 시점에서 서버가 주양육자 + 본인 1건만 주는지, 강제 해제를 주양육자만 가능하게 서버가 막는지 맞춘다
- SCR-MYP-004 연결 남음: 초대 모달(SCR-MYP-005)이 생기면 [가족 초대하기]를 현재 동물 기본 선택으로 연다(자진 해제는 SCR-MYP-006 진행 중). 로그인(AIC)이 나오면 `/mypage/pets`는 `ProtectedRoute` 아래로(기존 항목). 팀에 확인: 공동양육자 시점 "나 (이서연)" 카드는 [공동양육] 배지가 1280px에서 카드 밖으로 28px 넘친다(시안 v5 `.myp-mem-n{white-space:nowrap}`와 같음). 슬라이드 정보 영역과 가족 구분선 사이는 시안(56px)보다 좁힌 32px(사람 요청). 모바일 밀어 넘기기는 시안 문구대로 넣었다. 기능명세서 16:00판은 DMS에 아직 14시판만 있다
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
- SCR-MYP-001을 만들 때 마이페이지 사이드 메뉴와 페이지 머리(경로)를 레이아웃으로 만든다. 지금은 가계부·반려동물 화면 모두 사이드 메뉴 없이 본문만 있다
- 털색 신규 6개(강아지 황색·세이블·멀, 고양이 젖소·카오스·포인트)는 백엔드가 코드 번호를 정하면 `features/pet/shared/petCodes.js`의 `COLR`와 `COLR_OPTIONS`에 넣는다. 이름 변경(블랙탄·파티)과 순서는 커밋 08c33cf에 반영됨
- SCR-MYP-010 캐릭터 만들기 1단계는 털색을 읽기 전용으로 보이고 생성 요청에 `colrCd`·`colrDrctInptNm`을 넣는다(FN-MYP-010-08)
- SCR-MYP-006을 만들 때 [연동 해제] 버튼("준비 중" 토스트)을 연결한다
- 등록 상한은 주양육 동물만 센다. 슬라이드 "N / 총마리"는 공동양육을 포함한다(명세대로)
- 로그인(AIC)이 나오면 `/mypage/pets`·`/mypage/expenses`·`/mypage/expenses/all`을 `ProtectedRoute` 아래로 옮긴다
- 품종 마스터 API(KSJ)가 나오면 `getVarieties` 가짜 응답을 실제 요청으로 바꾼다
- 반려동물 API(SJM 백엔드)가 나오면 `features/pet/api.js`의 가짜 응답(`getPets`·`getPet`·`createPet`·`updatePet`)을 실제 요청으로 바꾸고, 체중 기록 키 이름(`lastBdwgRcd`)을 응답에 맞춘다
- 건강 일지(SCR-HLT-002, JAJ) 경로가 생기면 [건강 일지에서 기록하기]를 연결한다
