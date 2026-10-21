# SJM 핸드오프

## 지금 하는 것

SCR-MYP-004 공동양육자 목록 — 끝 (2026-10-21 14:02 시작, 1차 구현 커밋 5bb91c5, 시안 v5·명세 16:00판으로 추가 요청 5건 반영, 검증 판정 `통과`, 사람 확인 완료)
기준: 기능명세서 v0.4_20261021 FN-MYP-004-01~04, 화면설계서 v0.6_20261021 SCR-MYP-004(4-1 주양육자 시점, 4-2 공동양육자 시점)
디자인: 시안 폴더(저장소 밖)의 `myp-pets.html`(4-1), `myp-pets-coparent.html`(4-2). 색·폰트는 `00styleguide.html`·`acc.css`. Figma 토큰이 없어 시안 폴더를 쓴다

- 공통: 반려동물 관리 페이지(SCR-MYP-002) 슬라이드 아래에 붙는 섹션이다. 별도 URL 없음. 지금 슬라이드의 동물(`pet`)을 받아 그 동물 기준으로 그린다. 주양육·공동양육 구분은 기존 `petRelCd`(`PET_REL.OWNER`·`CO_PARENT`)를 쓴다
- 공통 API: 양육관계 조회·강제 해제(SJM 백엔드, 아직 없음) → 가짜 응답으로 먼저 만들고 나중에 연결. 가짜는 `features/pet/api.js`에 `getCaregivers(petSn)`·`deleteCaregiver({ petSn, rltnSn })`(추정 키 `rltnSn`·`mbrNcnm`·`cgvrRoleCd`(PETG05, PCG·CCG)·`authrtNm`("조회+수정")·`lnkDt`·`myYn`). `queries.js`에 `petKeys.caregivers(petSn)`, `useCaregivers`, `useDeleteCaregiver`(성공 시 그 동물 목록 무효화). 가짜 데이터: 초코 2명, 보리 5명(가득 참), 나비 0명, 해피(공동양육)는 주양육자 + 나 1건. 이메일은 응답·화면 모두에 두지 않는다
- FN-MYP-004-01 가족관리 목록: `features/pet/list/FamilySection.jsx`(새 파일). 주양육자 시점 제목 "가족관리 — {petNm} ({N}/5명)", 공동양육자마다 닉네임·"공동양육" 배지·"{권한} · MM-DD 연동"·[삭제]. [삭제] → 확인 모달(`components/ConfirmModal`) → 강제 해제(가짜) → 목록에서 빠지고 토스트. 0명이면 빈 안내 한 줄. 상한 `MAX_CAREGIVERS = 5`는 `petCodes.js`. 완료 조건 `화면:` 슬라이드 ◀▶로 동물을 바꾸면 목록과 제목의 이름·인원이 그 동물 것으로 바뀐다. [삭제] → 확인하면 그 사람이 빠지고 인원이 1 줄어든다
- FN-MYP-004-02 가족 초대하기: 같은 파일 [＋ 가족 초대하기]. 5명이면 비활성. 초대 모달(SCR-MYP-005)이 아직 없어 "준비 중인 기능이에요" 토스트(SCR-MYP-005 때 현재 동물 기본 선택으로 연결). 완료 조건 `화면:` 보리(5명)로 넘기면 [＋ 가족 초대하기]가 비활성이다
- FN-MYP-004-03 주양육자 표시: 공동양육자 시점에서 "주양육자" 줄에 주양육자 닉네임·"주양육" 배지·"이 반려동물을 등록한 사람". 완료 조건 `화면:` 해피(공동양육)로 넘기면 주양육자 줄이 보인다
- FN-MYP-004-04 내 연동 상태: 공동양육자 시점에서 "내 연동 상태"에 "나 ({닉네임})" 1건과 [연동 해제]만, 다른 공동양육자와 [가족 초대하기]는 없음. [연동 해제]는 SCR-MYP-006 전이라 슬라이드 카드의 [연동 해제]와 같은 "준비 중" 토스트. 완료 조건 `화면:` 해피로 넘기면 내 연동 1건과 [연동 해제]만 보이고 [가족 초대하기]가 없다
- 바꿀 파일: `pages/mypage/PetListPage.jsx`(슬라이드 아래에 `FamilySection` 조립, 토스트 핸들러 공유), `features/pet/api.js`, `features/pet/queries.js`, `features/pet/shared/petCodes.js`, 새 파일 `features/pet/list/FamilySection.jsx`
- 완료 조건 `명령:` `yarn -s lint`, `yarn -s build`

결정1: [삭제] 확인 모달은 SCR-MYP-006 자진 해제와 말투를 맞춘다. 제목 "{닉네임}님과의 연동을 해제할까요?", 설명 "해제하면 {닉네임}님은 {반려동물 이름}의 기록을 더 이상 볼 수 없어요.", 버튼 [취소]·[해제], 완료 토스트 "연동을 해제했어요"(사람 결정 2026-10-21)
결정2: "(N/5명)"의 N은 공동양육자만 센다. 시안 예시 2/5명도 공동양육자 2명 기준이다(사람 결정 2026-10-21)

새 의존성: 없음

### 추가 요청
기준이 바뀜: 기능명세서 v0.4_20261021 16:00판(FN-MYP-004-01~04, FN-MYP-002-02, FN-MYP-005-03 문구 개정. DMS에는 아직 14시판만 있음), 시안 `nmcare-design-v5`(2026-10-21 15:59)의 `myp-pets.html`·`myp-pets-coparent.html`·`myp-pets-5.html`·`myp.css`. 위 기획의 "슬라이드 아래 섹션·목록 행·(N/5명)·제목 옆 인원"은 이 기준으로 대체한다. 결정1의 삭제 확인 모달 문구와 결정2의 "공동양육자만 센다"는 그대로(인원 수 표시는 사라짐).
| 번호 | 바꿀 파일 | 완료 조건 | 근거 |
| --- | --- | --- | --- |
| 추가-1 | `features/pet/list/FamilySection.jsx`, `PetSlide.jsx`, `pages/mypage/PetListPage.jsx` | 명령: `yarn -s lint`, `yarn -s build`. 화면: 가족 영역이 슬라이드 카드 안 맨 아래(정보 영역 아래 강한 구분선)에 "가족" 제목으로 있고, 공동양육자 1명당 작은 카드(이름·권한·MM-DD 연동, 오른쪽 위 [✕])가 한 줄 최대 5칸(좁으면 3칸·2칸)으로 보인다. [✕] → 기존 확인 모달 → 해제. 인원 수(N/5명)는 표시하지 않는다 | 요청 2026-10-21 "디자인 변경됐어. 화면설계서랑 디자인 시안 다시 확인해" (FN-MYP-004-01) |
| 추가-2 | `FamilySection.jsx` | 명령: 위와 같음. 화면: 가족 카드 바로 뒤에 같은 크기의 점선 "가족 초대" 카드와 "N자리 남음"이 보이고(가족이 없으면 이 카드만 "5자리 남음"), 누르면 "준비 중" 토스트. 5명이 차면 초대 카드가 숨겨지고 제목 옆에 "5명이 모두 연동돼 더 초대할 수 없어요"가 보인다 | 같은 요청 (FN-MYP-004-02) |
| 추가-3 | `FamilySection.jsx`, `PetSlide.jsx` | 명령: 위와 같음. 화면: 공동양육자 시점(해피)에서 가족 영역 첫 카드가 주양육자(이름·[주양육] 배지·"등록한 사람"), 다음이 "나 (이서연)"(공동양육 배지·권한·연동일) 카드이고 [✕]·초대 카드·"내 연동 상태"·"주양육자" 별도 영역은 없다. 자진 [연동 해제]는 슬라이드 카드 왼쪽 버튼 하나만 있다 | 같은 요청 (FN-MYP-004-03·04) |
| 추가-4 | `PetSlide.jsx`, `PetListPage.jsx` | 명령: 위와 같음. 화면: [반려동물 등록]이 카드 위 오른쪽에 있고, ◀▶가 카드 좌우 끝에 반쯤 걸쳐 있으며 첫 장 ◀·마지막 장 ▶는 비활성이다. 카드 안 아래 가운데에 반려동물 수만큼 점이 있고 현재 점이 길게 강조되며 점을 누르면 그 동물로 이동한다. 기존 "N / 총마리"와 카드 아래 ◀▶ 줄은 없다 | 같은 요청 (FN-MYP-002-02 개정이 같은 시안에 함께 바뀜. SCR-MYP-002 범위) |
| 추가-5 | `features/pet/list/PetSlide.jsx` | 명령: 위와 같음. 화면: 761px 이상에서 반려동물 정보 영역과 "가족" 위 기준선 사이 여백이 이전(약 64px)보다 줄어 약 32px로 보인다. 좌우 열 간격과 760px 이하 배치는 그대로 | 요청 2026-10-21 16:15 "기준선 위 여백이 조금 넓은 거 같은데" (시안은 56px 간격 그대로라 시안보다 좁힘, 사람 요청) |

## 다음에 할 것
- SCR-MYP-004 연결 남음: 양육관계 조회·강제 해제 API(SJM 백엔드)가 나오면 `features/pet/api.js`의 가짜(`getCaregivers`·`deleteCaregiver`, 추정 키 `rltnSn`·`mbrNcnm`·`cgvrRoleCd`·`authrtNm`·`lnkDt`·`myYn`)를 실제 요청으로 바꾸고 응답에 맞춘다. 공동양육자 시점에서 서버가 주양육자 + 본인 1건만 주는지, 강제 해제를 주양육자만 가능하게 서버가 막는지 맞춘다
- SCR-MYP-004 연결 남음: 초대 모달(SCR-MYP-005)이 생기면 [가족 초대하기]를 현재 동물 기본 선택으로 열고, 자진 해제(SCR-MYP-006)가 생기면 공동양육자 시점 [연동 해제]·슬라이드 카드 [연동 해제]의 "준비 중" 토스트를 바꾼다. 로그인(AIC)이 나오면 `/mypage/pets`는 `ProtectedRoute` 아래로(기존 항목). 팀에 확인: 공동양육자 시점 "나 (이서연)" 카드는 [공동양육] 배지가 1280px에서 카드 밖으로 28px 넘친다(시안 v5 `.myp-mem-n{white-space:nowrap}`와 같음). 슬라이드 정보 영역과 가족 구분선 사이는 시안(56px)보다 좁힌 32px(사람 요청). 모바일 밀어 넘기기는 시안 문구대로 넣었다. 기능명세서 16:00판은 DMS에 아직 14시판만 있다
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
