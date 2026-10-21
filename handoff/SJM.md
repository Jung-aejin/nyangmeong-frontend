# SJM 핸드오프

## 지금 하는 것

SCR-MYP-031 가계부 등록/수정 — 끝 (2026-10-20 16:23 시작, 16:30 승인, 사람 확인·검증 통과). 검증 판정 `통과`, 1회차
기준: 기능명세서 v0.4_20261019 FN-MYP-031-01~06, 화면설계서 v0.6_20261019 SCR-MYP-031(1단계, 2-A~2-D)
디자인: 시안 폴더(저장소 밖)의 `myp-ledger.html` 안 등록 모달, 영수증 업로드는 `aim-receipt-upload.html` 참고. 색·폰트는 `00styleguide.html`·`acc.css`
디자인 결정(2026-10-20 사람): 시안(`myp-ledger.html`의 등록 모달, 영수증 업로드는 `aim-receipt-upload.html`)을 기준으로 한다. 날짜 상세에 [+ 지출 추가] 버튼을 둔다

만든 것: 등록 모달 흐름(`features/expense/ExpenseAddModal.jsx`: 방법 선택 → 직접 입력 `ExpenseForm.jsx` / 영수증 업로드 `ExpenseReceiptUpload.jsx` → 인식 결과 `ExpenseReceiptReview.jsx` → 중복 확인 `ExpenseDuplicateDialog.jsx`), 수정 `ExpenseEditModal.jsx`, 날짜 상세 [+ 지출 추가], `receiptFile.js`(형식·용량 검사), `expenseInput.js`, `components/AmountInput.jsx`. 가짜 응답은 `api.js`의 `createExpenses`·`updateExpense`·`findDuplicateExpenses`·`recognizeReceipt`(파일 이름에 fail·partial·error)
디자인: 시안 `myp-ledger.html`·`aim-receipt-upload.html`. 공용 `Modal` 폭이 고정이라 시안의 넓은 입력 모달 대신 440px이고, 인식 결과의 점선 테두리는 본문 안쪽 상자다
가짜 응답의 키 `rcptSn`(영수증 번호)과 영수증 인식 결과 키(`expndYmd`·`expndAmt`·`dtlMttr`·`expndClsfCd`)는 추정이다. 날짜는 이번 달 마지막 날까지만 고르게 했다(명세에 없는 제한)

새 의존성: 없음

## 다음에 할 것
- SCR-MYP-031 연결 남음: 가계부 API(SJM 백엔드)가 나오면 `createExpenses`·`updateExpense`·`findDuplicateExpenses`를 실제 요청으로, 영수증 인식(YAY, OCR 호출부 LJS)이 나오면 `recognizeReceipt`를 실제 요청으로 바꾸고 추정 키를 응답에 맞춘다. 중복 확인을 서버가 저장 요청 안에서 하는지, 병원 공용 금지·미래 달 제한을 서버도 검사하는지 맞춘다
- 건강 일지에서 병원 영수증을 저장하면 가계부에 1건이 자동 기록된다(FN-AIM-009-10, JAJ·YAY). 이 기록이 `rcptSn`으로 연결되는지 팀과 맞춘다
- SCR-MYP-030 연결 남음: FN-MYP-030-08 한도 알림 발송(서버 인앱 알림, 알림 저장 YAY·가계부 API SJM 백엔드)
- 가계부 API(SJM 백엔드)가 나오면 `features/expense/api.js` 가짜를 실제 요청으로 바꾸고 위 추정 키를 응답에 맞춘다. 집계(카테고리·반려동물별·주요 지출·지난달 대비)를 서버가 주면 `expenseStats.js` 집계를 그 값으로 바꾼다
- 삭제된 반려동물의 이름이 서버에 남는지 백엔드에서 확인한다(화면은 "이름 (삭제됨)"으로 표시). 기능명세서 FN-MYP-030-10·FN-MYP-002-07 문구가 이 표기와 맞는지도 확인한다
- 명세가 모호해 정한 것을 팀에 확인한다: 금액순 정렬은 전체를 금액순으로 늘어놓고 같은 날짜가 이어진 것만 묶어서 날짜 머리가 여러 번 나올 수 있다. 전체 내역 상단 합계·건수는 필터와 무관하게 그 달 전체다. 편집 중 필터·정렬을 바꾸면 편집이 풀린다(FN-MYP-030-17 그대로). 반려동물별 지출 비율은 반올림 때문에 합이 101%가 될 수 있다
- 캐릭터 이미지 API(LJS)가 나오면 슬라이드 얼굴(`chrcFaceUrl`)을 실제 이미지로 바꾼다. 지금은 종별 기본 얼굴이다
- 목표체중 오류 문구 "0보다 큰 숫자로 입력해 주세요"는 화면설계서에 없지만 필요해서 유지한다(2026-10-20 사람 결정). 명세에 문구를 넣을지는 팀에 확인한다
- `index.css`의 그림자 토큰을 시안 이름에 맞춰 바꿨다(2026-10-20 사람 결정): `shadow-depth-sm`·`md`·`lg`(구 card·pop·modal), `ring-focus`·`ring-error`(`@utility`, 구 focus·error). Tailwind 기본 `shadow-sm`·`lg`를 쓰는 다른 화면이 있어 `depth`를 붙였다. `OPEN_ISSUES.md` 스타일링 항목에 제안으로 적었고, 팀이 합의하면 확정한다
- 디자인 반영 때 정한 스타일 결정(토큰을 `@theme`에, Pretendard CDN, 브랜드 색 #285a5c 계열, 아이콘은 lucide 대응, 가계부용 tone·warn 색 토큰 추가)을 팀과 맞춘 뒤 `docs/OPEN_ISSUES.md` 스타일링 항목을 갱신한다
- SCR-MYP-001을 만들 때 마이페이지 사이드 메뉴와 페이지 머리(경로)를 레이아웃으로 만든다. 지금은 가계부·반려동물 화면 모두 사이드 메뉴 없이 본문만 있다
- 털색 신규 6개(강아지 황색·세이블·멀, 고양이 젖소·카오스·포인트)는 백엔드가 코드 번호를 정하면 `features/pet/petCodes.js`의 `COLR`와 `COLR_OPTIONS`에 넣는다. 이름 변경(블랙탄·파티)과 순서는 커밋 08c33cf에 반영됨
- SCR-MYP-010 캐릭터 만들기 1단계는 털색을 읽기 전용으로 보이고 생성 요청에 `colrCd`·`colrDrctInptNm`을 넣는다(FN-MYP-010-08)
- SCR-MYP-006을 만들 때 [연동 해제] 버튼("준비 중" 토스트)을 연결한다
- 등록 상한은 주양육 동물만 센다. 슬라이드 "N / 총마리"는 공동양육을 포함한다(명세대로)
- 로그인(AIC)이 나오면 `/mypage/pets`·`/mypage/expenses`·`/mypage/expenses/all`을 `ProtectedRoute` 아래로 옮긴다
- 품종 마스터 API(KSJ)가 나오면 `getVarieties` 가짜 응답을 실제 요청으로 바꾼다
- 반려동물 API(SJM 백엔드)가 나오면 `features/pet/api.js`의 가짜 응답(`getPets`·`getPet`·`createPet`·`updatePet`)을 실제 요청으로 바꾸고, 체중 기록 키 이름(`lastBdwgRcd`)을 응답에 맞춘다
- 건강 일지(SCR-HLT-002, JAJ) 경로가 생기면 [건강 일지에서 기록하기]를 연결한다
