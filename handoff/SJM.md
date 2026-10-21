# SJM 핸드오프

## 지금 하는 것

SCR-MYP-020 포인트 관리/케어미션 — 끝 (2026-10-21 시작·승인, 검증 판정 `통과` 1회차, 추가 요청 2건 반영, 사람 확인 완료)
기준: 기능명세서 v0.4_20261020 FN-MYP-020-01~10, 화면설계서 v0.6_20261020 SCR-MYP-020(20-1, 20-2)
디자인: 시안 폴더(저장소 밖)의 `myp-points.html`(기본), `myp-points-empty.html`(주양육 동물 0마리). 색·폰트는 `00styleguide.html`·`acc.css`. Figma 토큰이 없어 시안 폴더를 쓴다

- FN-MYP-020-01 보유 포인트: `features/point/` 새 도메인(api.js·queries.js·화면별 폴더). 포인트 API는 SJM 백엔드 → 가짜 응답을 `api.js`에 둔다. 완료 조건 `화면:` 잔액 숫자가 천 단위 쉼표와 P로 보인다
- FN-MYP-020-09 포인트 요약: 이번 달 적립·사용(합계·건수), 오늘 미션(완료/전체, 마리 수, 달성률), 기준 일자. 적립·사용 클릭은 내역 영역으로, 오늘 미션 클릭은 케어미션 영역으로 스크롤. [건강 일지](SCR-HLT-002 경로 없음 → "준비 중" 토스트), [캐릭터 꾸미기]는 `/mypage/characters`. 완료 조건 `화면:` 카드 클릭 시 해당 영역으로 이동
- FN-MYP-020-03 동물 탭: 주양육 동물만 탭, 탭에 이름과 완료 개수. 완료 조건 `화면:` 탭을 바꾸면 그 동물의 미션 8개와 진행률이 바뀐다
- FN-MYP-020-04 기록·날짜 이동: 완료 개수·달성률·진행률 바, 그날 획득 포인트·남은 미션(남은 포인트), 미션별 배점·완료 상태, ◀▶ 날짜 이동(기본 오늘, 미래 비활성). 완료 조건 `화면:` 날짜를 바꾸면 그날 기록이 보인다
- FN-MYP-020-02 적립·사용 내역: ◀▶ 월 이동(미래 비활성, 공용 `MonthNav` 사용), 합계, 최신순 목록(고정 높이 안 스크롤), "검진기록 등록" 표기. 완료 조건 `화면:` 월을 바꾸면 그 달 합계와 목록이 바뀐다
- FN-MYP-020-10 적립 안내: 4단계 카드, [픽셀 캐릭터로 이동] → `/mypage/characters`
- FN-MYP-020-07 0마리 안내: 주양육 동물이 없으면 케어미션 영역을 등록 유도로 대체, [반려동물 등록하기] → 반려동물 등록 모달(`/mypage/pets`). 포인트·내역은 그대로. 완료 조건 `화면:` 가짜 동물 0마리일 때 안내가 보인다
- FN-MYP-020-05·06·08 지급 규칙·공동양육자 수행분·검진기록 포인트: 서버 규칙이라 화면 일은 없음. 내역 표기와 배점 표시로만 반영
- 만들 파일: `pages/mypage/PointPage.jsx`, `routes/paths.js`에 `MYPAGE_POINTS: '/mypage/points'`(docs/routes.md 기준), `AppRoutes.jsx` 등록, `features/point/{api.js,queries.js,summary/,mission/,history/,guide/,shared/}`. 반려동물 목록은 `features/pet` 직접 import 금지 → 미션 응답에 동물 이름을 담은 가짜 응답으로 처리
- 완료 조건 `명령:` `yarn -s lint`, `yarn -s build`

새 의존성: 없음

### 추가 요청
| 번호 | 바꿀 파일 | 완료 조건 | 근거 |
| --- | --- | --- | --- |
| 추가-1 | `features/point/summary/PointSummary.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: "YYYY.MM.DD 기준"이 요약 카드 우측 상단에 보이고, 하단 줄에는 [건강 일지]·[캐릭터 꾸미기]만 오른쪽 정렬로 남는다 | 요청 2026-10-21 "기준 날짜 위치를 우측 상단으로" |
| 추가-2 | `features/point/summary/PointSummary.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 보유 포인트 옆 돼지 아이콘 자리에 글자 "P"가 보인다 | 요청 2026-10-21 "돼지 아이콘 말고 P로 바꾸는 거" |

## 다음에 할 것
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
