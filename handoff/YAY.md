# YAY 핸드오프

## 지금 하는 것

SCR-ACC-002 로그인 — 구현 중 (승인 2026-10-21 /impl)

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

## 다음에 할 것

- SCR-ACC-002 연결 남음: 로그인·보안코드 API(YAY 백엔드)가 나오면 `features/member/api.js`의 가짜(`login`·`getCaptcha`)를 실제 호출로 바꾼다
- SCR-ACC-002 연결 남음: SNS 외부 인증창(네이버·카카오·구글 OAuth), 가입 직후 첫 로그인의 닉네임 모달(FN-ACC-001-22), 비밀번호 찾기·회원가입 화면(SCR-ACC-011·001)
- 로그인 구현 후 메인·마이페이지 라우트의 `auth`를 `'member'`로 바꾼다
