# YAY 핸드오프

## 지금 하는 것

SCR-ACC-002 로그인 — 구현 끝남 (승인 2026-10-21, 검증 통과 회차 2, 사람 확인 Caps Lock 안내 남음). 비밀번호 찾기·재설정(SCR-ACC-011·012)과 한 PR로 올린다

기준: 로그인·회원가입_화면설계서_v0.10_20260930 SCR-ACC-002(01~05번 화면). 기능명세서는 DMS 연결 없이 화면설계서의 기능 정의표를 기준으로 한다
디자인: 시안 폴더(저장소 밖)의 `acc-login.html`·`acc-login-email*.html`과 그 `acc.css`·`acc.js`(`nmcare-design-v5`). 로그인 영역(방법 선택, 이메일 입력, 형식 오류, 1~4회 불일치, 5회 실패 보안코드, 보안코드 오류)만 만든다

- 공통: 로그인 API(YAY 백엔드, 아직 없음) → 가짜 응답을 `features/member/api.js`에 둔다. 비밀번호 `wrong`이면 불일치, 같은 이메일로 5번 실패하면 보안코드 요구, 그 외는 성공. 보안코드는 화면에서 만든 영문 대문자·숫자 6글자(숫자·대문자 각 1개 이상)를 `acc.css`처럼 기울여 그린다
- FN-ACC-002-22 이메일로 로그인하기: `/login`은 방법 선택, `/login?method=email`은 이메일 입력. 뒤로가기·새로고침이 자연스럽고 `?redirect=`는 유지한다
- FN-ACC-002-09~11 SNS 버튼: 네이버·카카오·구글 3개를 보이게 하고 누르면 "준비 중" 토스트. 외부 인증창 참고 화면(E01~E06)은 만들지 않는다
- FN-ACC-002-03·12 아이디: 미입력 "아이디를 입력해 주세요.", 형식 오류 "이메일 주소 형식을 확인해주세요."를 입력칸 아래와 AI 안내로 함께 보인다. 인증 실패 횟수에 더하지 않는다
- FN-ACC-002-04 비밀번호: 눈 아이콘으로 표시 전환, 커서가 있는 칸에서 Caps Lock이 켜지면 "⇪ Caps Lock이 켜져 있습니다." 표시. 미입력 "비밀번호를 입력해 주세요."
- FN-ACC-002-05·16 로그인: 불일치는 아이디·비밀번호를 구분하지 않고 "일치하는 회원정보를 찾을 수 없습니다."(공통 알림 + AI). 이메일은 유지하고 비밀번호는 비운다
- FN-ACC-002-18~20 보안코드: 5회째 실패 즉시 알림 "로그인 5회 실패로 보안코드 확인이 필요합니다. 보안코드를 입력해 다시 로그인해 주세요."와 보안코드 입력 영역. 새로고침은 입력·오류를 비움. 미입력 "보안코드를 입력해 주세요.", 형식 "영문·숫자 6글자를 입력해 주세요.", 불일치 "보안코드가 일치하지 않습니다. 다시 입력해 주세요."(새 코드 발급). 이메일을 바꾸면 비밀번호를 비우고 새 코드를 발급한다
- FN-ACC-002-02·13~15 AI 매니저 안내: PC에서 입력창 오른쪽, 1100px 이하에서 입력창 아래. 오류가 없으면 보이지 않는다
- FN-ACC-002-01 뒤로가기: 이메일 입력에서는 방법 선택으로, 방법 선택에서는 랜딩(`PATHS.HOME`)으로
- FN-ACC-002-07·08 비밀번호 찾기·회원가입 링크: `PATHS.PASSWORD_FIND`·`PATHS.SIGNUP`. 화면이 아직 없어 누르면 "준비 중" 토스트
- 로그인 성공: `routes/redirect.js`의 `getRedirectPath`로 이동(기본 메인). 토큰은 저장하지 않는다
- 만들 파일: `pages/auth/LoginPage.jsx`, `features/member/login/{LoginMethodChoice,SnsLoginButtons,EmailLoginForm,CaptchaBlock}.jsx`, `features/member/login/{useEmailLogin.js,loginMessages.js}`, `components/AiErrorGuide.jsx`, `hooks/useCapsLock.js`, `layouts/AuthLayout.jsx`, `routes/domains/account/accountRoutes.js`, `features/member/api.js`·`queries.js`(로그인 가짜 함수와 훅 추가)
- 완료 조건 `명령:` `yarn -s lint`, `yarn -s build`
- 완료 조건 `화면:` `/login`에서 방법 선택이 보이고 이메일을 고르면 입력 화면으로 바뀐다. 뒤로가기가 한 단계씩 돌아간다. `care@`는 형식 오류와 AI 안내가 함께 나온다. 비밀번호 `wrong`을 4번 넣으면 같은 불일치 알림이 나오고 5번째에 보안코드 영역이 생긴다. 틀린 코드는 불일치 문구가 나온다. 올바른 값이면 메인으로 이동한다. 1440px·390px에서 가로 스크롤이 없고 1100px 이하에서 AI 안내가 입력창 아래로 내려간다

질문: 없음(SNS 버튼은 토스트, 이메일 단계는 `?method=email`로 결정)
결정: 추천안대로(사람 승인 2026-10-21)

새 의존성: 없음

SCR-ACC-011 비밀번호 찾기, SCR-ACC-012 비밀번호 재설정 — 구현 중 (승인 2026-10-22 /impl)

기준: 로그인·회원가입_화면설계서_v0.10_20260930 SCR-ACC-011(23~25번 화면), SCR-ACC-012(26~29번 화면). 기능명세서는 DMS 연결 없이 화면설계서의 기능 정의표를 기준으로 한다
디자인: 시안 폴더(저장소 밖)의 `acc-password-find*.html`·`acc-password-reset*.html`과 그 `acc.css`·`acc.js`(`nmcare-design-v5`)

- 공통: 인증·재설정 API(YAY 백엔드, 아직 없음) → 가짜 응답을 `features/member/api.js`에 둔다. 인증번호 `123456` 일반 계정(재설정으로), `234567` SNS 전용(카카오), `345678` 미가입, `456789` 탈퇴 계정, 그 외는 불일치. 인증번호 유효시간은 가짜에서만 3분. 이메일 `fail@example.com`은 발송 실패, 새 비밀번호에 `fail`이 들어가면 저장 실패. 인증 성공은 가짜 API 안의 "본인확인 완료" 상태로 두고 재설정 화면이 조회한다. 저장에 성공하면 그 상태를 지운다
- 공통 컴포넌트: 로그인의 `LoginCard`·`LoginHeading`·`LoginField`·`LoginNotice`를 `features/member/shared/`의 `AuthCard`·`AuthHeading`·`AuthField`·`AuthNotice`로 옮기고 로그인 화면의 import를 고친다. `AuthField`에 안내 문구(help)·성공 문구(success)·입력칸 오른쪽 요소(endAdornment)를 추가한다
- FN-ACC-011-01 로그인으로 돌아가기: 화면 아래 "로그인으로" 링크 → `PATHS.LOGIN`(이메일 로그인 `?method=email`)
- FN-ACC-011-02·03 이메일 입력·인증번호 보내기: 미입력 "이메일을 입력해 주세요.", 형식 오류 "이메일 주소 형식을 확인해주세요."(입력칸 아래와 AI 안내). 발송 성공이면 인증번호 입력 단계로 바뀌고 "인증번호를 보냈습니다. 메일함을 확인해 주세요.", 실패면 입력값을 유지하고 알림 "인증번호를 보내지 못했습니다. 다시 시도해 주세요."
- FN-ACC-011-05·06·07 인증 대상 이메일·인증번호 입력·다시 보내기: 대상 이메일 표시와 "이메일 다시 입력"(이전 코드 무효), 숫자 6자리만 입력, 입력칸 오른쪽에 남은 시간(mm:ss, 서버 만료시각 기준 `useCountdown`), 미입력 "인증번호를 입력해 주세요.", 6자리 아님 "인증번호는 숫자 6자리로 입력해 주세요." 다시 보내기는 입력·오류를 비우고 새 만료시각으로 바꾼다
- FN-ACC-011-08·09 인증 확인·오류: 일반 계정은 `/password/reset`으로, SNS 전용은 SNS 안내 단계로, 미가입 "비밀번호를 재설정할 회원정보를 찾을 수 없습니다.", 탈퇴 계정 "탈퇴한 계정입니다. 재가입 절차에서 기존 정보 복구를 진행해 주세요."와 "재가입 복구 절차" 버튼(복구 화면이 없어 "준비 중이에요" 토스트). 불일치 "인증번호가 일치하지 않습니다.", 만료 "인증시간이 만료되었습니다. 다시 보내기를 눌러 주세요."(입력칸 아래와 AI 안내)
- FN-ACC-011-10·11 SNS 전용 계정 안내: "SNS로 가입한 계정입니다. 가입한 SNS로 로그인해 주세요.", 연결된 로그인 방법 표시, "로그인 화면으로" → `PATHS.LOGIN`
- FN-ACC-012-01·02 새 비밀번호·확인: 8자 이상, 문자·숫자 조합. 미입력 "새 비밀번호를 입력해 주세요.", 규칙 오류 "비밀번호는 8자 이상, 문자와 숫자를 함께 입력해 주세요.", 확인 미입력 "새 비밀번호를 다시 입력해 주세요.", 불일치 "새 비밀번호가 일치하지 않습니다.", 일치하면 "비밀번호가 일치합니다.". 보기 전환과 Caps Lock 안내
- FN-ACC-012-03·05 재설정·저장 오류: 두 칸이 올바를 때만 버튼 활성. 저장 실패는 알림 "비밀번호를 변경하지 못했습니다. 다시 시도해 주세요."(AI 안내), 성공이면 완료 화면 "비밀번호가 변경되었습니다. 새 비밀번호로 다시 로그인해 주세요."
- FN-ACC-012-04 취소: "취소" → `PATHS.LOGIN`
- FN-ACC-012-06·07 인증 만료: 본인확인 상태가 없거나 이미 쓴 상태(주소로 직접 접근 포함)면 입력 없이 "본인확인이 필요합니다. 이메일 인증을 다시 진행해 주세요."(AI 안내)와 "이메일 인증 다시 하기" → `PATHS.PASSWORD_FIND`, "로그인으로"
- FN-ACC-012-08·09 완료·로그인으로: "로그인 화면으로" → `PATHS.LOGIN`. 자동 로그인하지 않는다
- FN-ACC-002-07(로그인): 이메일 로그인 화면의 "비밀번호 찾기" 버튼이 토스트 대신 `PATHS.PASSWORD_FIND`로 이동한다
- 만들 파일: `pages/auth/PasswordFindPage.jsx`, `pages/auth/PasswordResetPage.jsx`, `features/member/password/{PasswordFindForm,PasswordResetForm,usePasswordFind,usePasswordReset,passwordMessages}`, `hooks/useCountdown.js`, `features/member/shared/{AuthCard,AuthHeading,AuthField,AuthNotice}.jsx`(로그인에서 이동), `features/member/api.js`·`queries.js`(가짜 함수와 훅 추가), `routes/domains/account/accountRoutes.js`(라우트 2개), `features/member/login/EmailLoginForm.jsx`("비밀번호 찾기" 이동)
- 완료 조건 `명령:` `yarn -s lint`, `yarn -s build`
- 완료 조건 `화면:` `/login?method=email`에서 "비밀번호 찾기"를 누르면 `/password/find`로 이동한다. 이메일을 비우고 보내면 "이메일을 입력해 주세요.", `care@`는 형식 오류와 AI 안내가 함께 나온다. 올바른 이메일이면 인증번호 단계로 바뀌고 남은 시간이 줄어든다. 이메일 다시 입력과 다시 보내기가 동작한다. 인증번호 `123456`이면 `/password/reset`으로 이동한다. `234567`은 SNS 안내, `345678`과 `456789`는 계정 안내 알림이 나온다. 틀린 번호는 불일치 문구가 나온다. 재설정 화면에서 규칙 위반과 확인 불일치 문구가 나오고 올바르면 버튼이 활성화되며 저장하면 완료 화면이 뜬다. 완료 뒤와 인증 없이 `/password/reset`을 열면 만료 화면이 나온다. 1440px·390px에서 가로 스크롤이 없다

질문: 없음(공통 컴포넌트 이동과 로그인·비밀번호 찾기 한 PR은 사람 승인 2026-10-22)
결정: 추천안대로(사람 승인 2026-10-22)

새 의존성: 없음

## 다음에 할 것

- SCR-ACC-002 연결 남음: 로그인·보안코드 API(YAY 백엔드)가 나오면 `features/member/api.js`의 가짜(`login`·`getCaptcha`)를 실제 호출로 바꾼다
- SCR-ACC-002 연결 남음: SNS 외부 인증창(네이버·카카오·구글 OAuth), 가입 직후 첫 로그인의 닉네임 모달(FN-ACC-001-22), 회원가입 화면(SCR-ACC-001)
- SCR-ACC-011·012 연결 남음: 인증번호 발송·확인·비밀번호 재설정 API(YAY 백엔드)가 나오면 `features/member/api.js`의 가짜(`sendRecoveryCode`·`verifyRecoveryCode`·`getRecoveryStatus`·`resetPassword`)를 실제 호출로 바꾼다. 인증 유효시간·재전송 제한은 백엔드와 정한다. 탈퇴 계정의 "재가입 복구 절차"는 SCR-ACC-001 복구 화면이 생기면 연결한다
- 로그인 구현 후 메인·마이페이지 라우트의 `auth`를 `'member'`로 바꾼다
