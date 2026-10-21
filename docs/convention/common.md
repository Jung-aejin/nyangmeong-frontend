# 냥멍케어 프론트엔드 컨벤션: 모든 코드에 공통

`AGENTS.md`에서 이어지는 문서다.

## 주석

백엔드 규칙(`nyangmeong-backend`의 `docs/convention/common.md` "주석")과 같은 형식이다.

- 주석은 한글로 쓴다.
- **명사형으로 끝낸다.** `~한다`·`~이다`·`~있다`로 끝나는 서술형 문장은 쓰지 않는다. 서술형은 코드를 말로 옮긴 설명이 되기 쉽다.
- **주석은 모두 `/** */` 한 줄로 쓴다. `//`는 쓰지 않는다.** JSX 안에서는 `{/** */}`로 쓴다.
- 파일 머리(컴포넌트·훅·모듈): `[이름]` 한 줄에 `- ` 항목을 최대 세 줄 붙인다. 결과는 `->`, 부연은 `:`로 잇는다.
- 함수·훅·컴포넌트: 역할을 명사형 한 줄로만 적는다. 조건·결과·상태 코드는 적지 않는다(본문을 읽으면 보인다).
- 상수·상태·필드: 라벨 한 줄.
- 함수 안: 라벨 한 줄. 문장은 쓰지 않는다.
- "왜"가 꼭 필요한 곳에만 항목 하나를 더한다. 문서 참조(`docs/...`)는 파일 머리 주석에만 쓴다.
- ESLint 지시 주석은 `/* eslint-disable-next-line 규칙 -- 사유 */` 형태로 쓴다. `/** */`로 쓰면 지시로 인식되지 않는다.
- 코드와 같은 말, 고친 과정("수정: …", "~로 변경", "기존 로직 유지"), 구분선, 이모지는 쓰지 않는다. AI 도구가 붙인 주석은 그대로 커밋하지 않고 이 기준으로 고친다.

```jsx
/**
 * [프로필 드롭다운]
 * - 바깥 클릭·ESC로 닫힘
 */

/** 로그아웃 처리 */
const handleLogout = () => {};

/** 글자마다 요청 방지용 입력 지연 */
const DEBOUNCE_MS = 300;

{/** 알림 배지 */}

// NG: // 로그아웃한다                 -- `//` 사용, 서술형
// NG: /** 상태를 업데이트한다 */      -- 서술형, 코드와 같은 말
// NG: /** 수정: 로딩 처리 추가 */     -- 고친 과정
```

검사: `grep -rnE '^\s*//' src`와 `grep -rnE '(/\*\*|\*).*(한다|이다|있다|된다|않는다|없다)\.?\s*(\*/)?$' src`는 출력이 없어야 한다. 새로 쓰는 코드부터 적용하고, 기존 코드의 `//` 주석은 따로 정리한다.

## 이름 짓기

| 대상 | 규칙 | 예 |
| --- | --- | --- |
| 페이지 | `XxxPage.jsx` | `PetListPage.jsx` |
| 컴포넌트 파일 | PascalCase, 컴포넌트 이름과 같게 | `PetCard.jsx` |
| 훅 | `useXxx` | `usePets`, `useCreatePet` |
| 함수 | camelCase. 동사로 시작한다 | `formatDate`, `handleSubmit` |
| API 함수 | 동사 + 명사. 조회·생성·수정·삭제는 `get`·`create`·`update`·`delete`, PUT으로 전체를 저장하는 요청은 `save` | `getPets`, `createPet`, `saveCareOrder`, `acceptCareMatch` |
| queryKey 객체 | `<도메인>Keys` | `petKeys` |
| 도메인 폴더(`features/`, `pages/` 아래) | 소문자 단수 | `pet/`, `health/` |
| `.js` 파일 | camelCase | `formatDate.js`, `queries.js` |
| 변수 | camelCase 명사. 서버 응답에 없는 이름은 약어를 쓰지 않는다. `data1`처럼 번호를 붙이지 않는다 | `selectedPet` |
| 상수 | `UPPER_SNAKE_CASE` | `MAX_FILE_SIZE` |
| boolean | `is`·`has`·`can`으로 시작한다. 서버가 준 키는 그대로 쓴다 | `isOpen`, `hasNext` |
| 이벤트 핸들러 | 함수는 `handleXxx`, props는 `onXxx` | `handleSubmit`, `onSelect` |

**필드 이름은 새로 짓지 않는다.** 서버의 JSON 키는 DB 컬럼 이름을 camelCase로 바꾼 것이다. 이 이름을 변수, props, 폼 필드에 그대로 쓴다.

| 서버가 주는 키 | 쓰는 이름 | 쓰지 않는 이름 |
| --- | --- | --- |
| `pstSn` | `pstSn` | `postId`, `id` |
| `ckupRcdSn` | `ckupRcdSn` | `checkupId` |
| `mdfcnDt` | `mdfcnDt` | `updatedAt` |

- **필드 이름의 뜻은 팀 DMS의 "DB 표준사전"에서 찾는다.** 약어(`Sn` 일련번호, `Dt` 일시, `Mdfcn` 수정)를 추측하지 않는다.
- 읽기 좋게 고쳐 지으면 같은 값을 프론트와 백엔드가 다르게 부르게 된다. 이름이 길거나 어색해도 그대로 쓴다.
- 서버 응답에 없는 값(화면에서 계산한 값, 열림·선택 같은 UI 상태)만 새 이름을 짓는다.
- 이 규칙은 필드 이름에만 해당한다. 컴포넌트·함수·파일·URL 경로 이름은 뜻이 드러나는 영어를 쓴다(`PetCard`, `getPets`, `/pets`).

## 비동기

비동기 흐름은 `async`/`await`로 쓴다. `new Promise`는 콜백만 주는 것(타이머·이벤트·`AbortSignal`)을 기다릴 때만 쓰고, 그 부분을 작은 함수로 빼서 `await`로 부른다.

- 성공은 `return`, 실패는 `throw`로 쓴다. 함수 본문에서 `resolve`·`reject`를 직접 부르지 않는다.
- `.then()` 체인을 새로 쓰지 않는다. 오류는 `try/catch`로 받는다.
- 독립된 요청 여러 개는 `await`를 줄줄이 달지 않고 `await Promise.all([...])`로 함께 기다린다.

```js
// OK: Promise는 wait 안에만 있고 본문은 async
const wait = (ms, signal) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('중단', 'AbortError'));
    }, { once: true });
  });

export const recognizeCheckupReceipt = async ({ file, signal }) => {
  await wait(2000, signal);
  if (file.name.includes('error')) throw new Error('일시 오류');
  return { rcptSn: Date.now() };
};

// NG: 본문 전체를 new Promise로 감싸 resolve·reject를 직접 부른다
export const recognizeCheckupReceipt = ({ file, signal }) =>
  new Promise((resolve, reject) => { /* ... */ });
```
