# SJM 핸드오프

## 지금 하는 것

SCR-MYP-040 회원정보 수정 — 끝 (2026-10-21 시작·승인, 검증 판정 `확인 못 함 있음`(연결 남음뿐), 추가 요청 4건 반영, 사람 확인 완료)
기준: 기능명세서 v0.4_20261020 FN-MYP-040-01~12, 화면설계서 v0.6_20261021 SCR-MYP-040(6-1, 6-2, 6-3, 10-21 개정으로 6-2·6-3 배치가 추가 요청으로 바뀜)
디자인: 시안 폴더(저장소 밖)의 `myp-account.html`(6-1 본인 확인), `myp-account-edit.html`(6-2 일반 회원), `myp-account-edit-sns.html`(6-3 SNS 회원). 색·폰트는 `00styleguide.html`·`acc.css`. Figma 토큰이 없어 시안 폴더를 쓴다

- 공통: 회원 조회·수정 API(AIC, 아직 없음) → 가짜 응답을 `features/member/api.js`에 둔다(추정 키 `mbrNcnm`·`acntEml`·`mbrTelno`·`prflImgUrl`·`snsTyCd`). 로그인 전이라 `useMe`·`ProtectedRoute`를 쓰지 않는다. `?fake=sns`면 SNS 회원(카카오) 가짜 응답
- FN-MYP-040-01 본인 확인: 같은 페이지 안 콘텐츠로 비밀번호 입력 → [확인] 통과 시 같은 자리가 6-2로 바뀐다. 빈 칸이면 [확인] 비활성. SNS 회원은 이 단계 없이 6-3. 가짜 응답은 `wrong`이면 실패. 완료 조건 `화면:` 비밀번호를 넣고 [확인]을 누르면 URL 변화 없이 수정 화면이 보이고, `?fake=sns`면 처음부터 6-3이 보인다
- FN-MYP-040-02·08 프로필 사진: [사진 변경]으로 파일 선택 → 미리보기와 업로드(가짜), [기본 이미지로]로 기본 이미지. 미등록이면 기본 이미지. 헤더 프로필에는 반영하지 않는다. 완료 조건 `화면:` 사진을 고르면 원 안 이미지가 바뀌고 [기본 이미지로]로 돌아온다
- FN-MYP-040-03 이메일: 잠금 아이콘과 비활성 입력란, 수정 불가
- FN-MYP-040-09 계정 표시(SNS): 잠금 아이콘과 "카카오 계정으로 로그인 중"(`snsTyCd`에 따라 카카오·네이버·구글), 이메일·비밀번호 항목 없음
- FN-MYP-040-04·10 닉네임: 입력란 항상 활성. 최대 10글자, 한글·영문·숫자 외 입력 제한. 현재 값과 다르면 [중복확인] 노출 → 사용 가능하면 "사용 가능한 닉네임입니다."와 [저장]으로 전환, 다시 고치면 [중복확인]으로 돌아간다. 가짜 중복 목록(예: `초코맘2`)이면 중복 문구. 완료 조건 `화면:` 닉네임을 바꾸면 [중복확인]이 나타나고, 통과하면 [저장]으로 바뀐다
- FN-MYP-040-05·11 휴대폰 번호: [수정] → 같은 자리가 입력란, 버튼이 [중복확인](비었거나 현재 번호와 같으면 비활성). 공백·하이픈 제거, +82 → 0 통일 후 형식 검사. 문구 3종(형식·중복·조회 실패)과 "사용 가능한 휴대전화번호입니다." → [저장], 다시 고치면 [중복확인]. [저장] 때 서버 중복 재검사 결과도 같은 문구로. 완료 조건 `화면:` 형식이 틀린 번호로 [중복확인]하면 "휴대전화번호 형식을 확인해 주세요."가 보인다
- FN-MYP-040-06 비밀번호 변경: 현재·새·확인 3칸, "8자 이상, 문자·숫자 조합" 안내. 새 비밀번호와 확인이 다르면 확인란 아래 "비밀번호가 일치하지 않아요", 일치하고 정책을 지키고 현재 비밀번호가 차기 전까지 [저장] 비활성. 완료 조건 `화면:` 새 비밀번호와 확인이 다르면 "비밀번호가 일치하지 않아요"가 보이고 [저장]이 비활성이다
- FN-MYP-040-07·12 회원 탈퇴: [회원 탈퇴 ›] → `/mypage/withdraw`(ACC-020, YAY). 아직 경로·화면이 없으면 "준비 중" 토스트
- 만들 파일: `pages/mypage/ProfileEditPage.jsx`, `routes/paths.js` mypage 구획에 `MYPAGE_PROFILE: '/mypage/profile'`(docs/routes.md 기준), `AppRoutes.jsx` 등록, `features/member/api.js`·`queries.js`에 가짜 함수와 훅 추가(`getMyProfile`·`verifyPassword`·`checkNickname`·`checkPhone`·`updateProfileImage`·`updateNickname`·`updatePhone`·`updatePassword`), 화면 폴더 `features/member/profile/{PasswordConfirm,ProfileEditForm,ProfileImageField,NicknameField,PhoneField,PasswordChangeField}.jsx`, 닉네임·전화·비밀번호 검사는 `features/member/shared/validate.js`
- 사이드 메뉴·페이지 머리는 만들지 않는다(SCR-MYP-001에서 레이아웃으로). AI 캐릭터 안내(FN-ACC-002-02)는 화면설계서 v0.6_20261021 수정(2026-10-21 12:24)으로 이 화면에서 빠졌다. 입력란 아래 문구만 있으면 된다
- 완료 조건 `명령:` `yarn -s lint`, `yarn -s build`

질문: 본인 확인에서 비밀번호가 틀렸을 때 문구가 명세에 없습니다. "비밀번호가 일치하지 않습니다."로 할까요? (추천: 그 문구를 쓰고 팀 확인을 "다음에 할 것"에 남긴다)
결정: "비밀번호가 일치하지 않습니다."로 한다. 팀 확인은 남기지 않는다(사람 결정 2026-10-21)

새 의존성: 없음

### 추가 요청
기준이 바뀜: 화면설계서 v0.6_20261021(`.cache/dms`, DMS에는 아직 20261020까지), 시안 `nmcare-design-v5` 시안 폴더(저장소 밖)의 `myp-account-edit.html`·`myp-account-edit-sns.html`(2026-10-21). 위 기획의 6-2·6-3 배치(카드 2장·입력란 상시 노출·"비밀번호 변경" 카드)는 이 기준으로 대체한다. 6-1 본인 확인은 그대로.
| 번호 | 바꿀 파일 | 완료 조건 | 근거 |
| --- | --- | --- | --- |
| 추가-1 | `features/member/profile/{ProfileEditForm,ProfileImageField,NicknameField,PhoneField,PasswordChangeCard}.jsx`, `shared/profileStyles.js` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 기본 정보 카드 맨 위에 사진(연필 아이콘)·닉네임·이메일(잠금, "아이디로 사용 · 수정불가")과 [사진 변경]·[기본 이미지로]가 한 줄로 보이고, 아래에 닉네임·휴대폰 번호·비밀번호가 `항목명 / 값 / [수정]·[변경]` 행으로 보인다. [수정]을 누르면 그 자리에서 입력란이 펼쳐지고 [취소]·[저장]이 보이며, 다른 행의 버튼을 누르면 펼쳐졌던 행은 입력을 버리고 닫힌다. [취소]도 닫는다. SNS 회원은 이메일 자리에 제공자 표시와 "카카오 계정으로 로그인 중 · 연동 계정 · 수정불가"가 보이고 비밀번호 행이 없다 | 요청 2026-10-21 "회원정보 수정화면 전반적으로 수정됐거든 디자인 시안이랑 화면설계서 다시 확인해" (FN-MYP-040-01~06·08~11 변경분) |
| 추가-2 | `features/member/profile/AccountInfoCard.jsx`(새 파일), `features/member/api.js`(가짜 응답에 `mbrJoinPathCd`·`mbrRegDt`·`mbrLastLgnDt`), `shared/snsCodes.js` | 명령: `yarn -s lint`, `yarn -s build`. 화면: "계정 정보" 카드에 가입 방식("이메일 가입", SNS는 제공자 표시와 "카카오 간편 가입")·가입일(YYYY.MM.DD)·최근 로그인(YYYY.MM.DD HH:MM)이 수정 버튼 없이 보인다 | 같은 요청 (FN-MYP-040-13 신규) |
| 추가-3 | `pages/mypage/ProfileEditPage.jsx`, `ProfileEditForm.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 본문 전체 폭에 "기본 정보"·"계정 정보" 영역 제목이 있는 두 카드가 세로로 쌓이고, [회원 탈퇴 ›]는 계정 정보 카드 밖 맨 아래 링크다. 본인 확인(6-1)은 그대로 | 같은 요청 (FN-MYP-040-07·12 위치 변경) |
| 추가-4 | `features/member/profile/ProfileImageField.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 파일 입력의 접근성 이름이 "사진 변경" 한 번만 읽히고(연필 아이콘 라벨은 `aria-hidden`), 연필 아이콘을 눌러도 파일 선택이 열린다 | 요청 2026-10-21 "고쳐줘" (파일 입력 이름이 "사진 변경 사진 변경"으로 두 번 읽히는 문제) |

## 다음에 할 것
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
