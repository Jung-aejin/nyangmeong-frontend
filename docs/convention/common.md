# 냥멍케어 프론트엔드 컨벤션: 모든 코드에 공통

`AGENTS.md`에서 이어지는 문서다.

### 주석

- 주석은 한글로 쓴다.
- 코드를 읽으면 아는 것은 적지 않는다. 왜 이렇게 했는지, 놓치기 쉬운 조건만 적는다.
- AI 도구가 붙인 주석은 그대로 커밋하지 않는다. 코드를 말로 옮긴 주석, 고친 과정을 적은 주석("~로 변경", "기존 로직 유지"), 구분선과 이모지는 지운다.

```js
// 검색어 입력은 짧게 지연해 글자마다 요청이 나가지 않게 한다
// NG: // 상태를 업데이트한다      -- 코드와 같은 말
// NG: // 수정: 로딩 처리 추가     -- 고친 과정
```

## 6. 이름 짓기

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
