# 냥멍케어 프론트엔드 컨벤션

이 저장소에서 코드를 쓰는 사람과 AI 도구가 따르는 규칙이다. 규칙은 이 파일 하나에만 있다.

- Codex는 이 파일을 자동으로 읽는다. Claude Code는 `CLAUDE.md`의 `@AGENTS.md` 한 줄로 읽는다. 그 줄을 지우면 규칙이 통째로 빠진다.
- 9장(Git 규칙)은 팀 합의 전 제안이다. 아직 정하지 않은 것은 `docs/OPEN_ISSUES.md`에 있다.
- 백엔드 규칙은 `nyangmeong-backend` 저장소의 `AGENTS.md`에 있다. 5장(서버 통신)과 6장(필드 이름)은 그 문서와 맞물린다.

## 0. 코드를 쓰기 전에 꼭 알 것

어기면 되돌리기 어렵거나 오류 없이 조용히 잘못되는 것만 모았다. 나머지는 필요할 때 찾아본다.

1. **비밀값을 커밋하지 않고, `VITE_` 변수에도 넣지 않는다.** 이 저장소는 공개다. `VITE_`로 시작하는 환경변수는 빌드 결과에 그대로 들어가 브라우저에서 누구나 볼 수 있다. (8장)
2. **토큰을 `localStorage`나 변수에 저장하지 않는다.** 로그인은 서버가 심는 쿠키로 유지되고 브라우저가 알아서 붙인다. 로그인 여부와 역할은 `features/member`의 `useMe`로만 확인한다. (5장)
3. **401은 "토큰 없음·만료"에만 온다.** 재발급은 `api/axios.js`가 한 번만 시도한다. 화면 코드에서 401을 따로 처리하거나 재발급을 부르지 않는다. (5장)
4. **`features/A`는 `features/B`를 import 하지 않는다.** 같이 쓰는 코드는 `components/`·`hooks/`·`utils/`로 올린다. queryKey 객체만 예외다. (3장)
5. **필드 이름을 새로 짓지 않는다.** 서버가 준 JSON 키(`pstSn`, `mdfcnDt`)를 그대로 쓴다. 읽기 좋게 바꾸는 변환 함수를 만들지 않는다. (6장)

## 1. 기술 스택

| 역할 | 라이브러리 |
| --- | --- |
| 프레임워크 | React 19 + Vite. JavaScript만 쓴다(TypeScript 미사용) |
| 라우팅 | react-router-dom 7 |
| 서버 상태 | @tanstack/react-query 5 + axios |
| 클라이언트 상태 | 전용 라이브러리 없음. UI 전역 상태만 Context |
| 스타일링 | Tailwind CSS 4 |
| 아이콘 | lucide-react |
| 린트 | ESLint 9 |
| 포맷 | Prettier. ESLint와 겹치는 규칙은 `eslint-config-prettier`로 끈다 |
| 실행 환경 | Node 24, Yarn |

여기에 없는 라이브러리를 추가하려면 먼저 팀에 묻는다.

### 편집기와 실행 환경

- 프론트는 VS Code로 작업한다. 저장할 때 Prettier가 자동으로 적용된다. 설정은 저장소의 `.vscode/settings.json`과 `.prettierrc`에 있고 개인 설정으로 덮어쓰지 않는다.
- 패키지 매니저는 Yarn만 쓴다. `yarn.lock`을 커밋하고 `package-lock.json`, `pnpm-lock.yaml`은 만들지 않는다. Yarn 버전은 `package.json`의 `packageManager`에 적혀 있다.
- Node는 24를 쓴다. 버전은 `.nvmrc`와 `package.json`의 `engines`에 적혀 있다.
- 줄바꿈은 LF다(`.gitattributes`가 커밋할 때 맞춘다).

## 2. 폴더 구조

```
(저장소 루트)
├─ .env.example        환경변수 키 목록. 값은 비워 둔다
├─ vite.config.js      alias는 @/ 하나만 둔다. /api 프록시 설정
└─ src/
   ├─ main.jsx          앱 시작점. QueryClient·BrowserRouter·Provider로 감싸서 <App/> 마운트
   ├─ App.jsx           <AppRoutes/> 하나만 렌더. 전역 CSS import
   │
   ├─ api/              서버 통신 공통 설정. 도메인을 모른다
   │   ├─ axios.js        axios 인스턴스 + 인터셉터 (5장)
   │   └─ env.js          import.meta.env를 읽어 export하는 유일한 파일
   │
   ├─ features/         도메인별 코드 묶음. 도메인 1개 = 폴더 1개
   │   └─ pet/
   │       ├─ api.js        이 도메인의 서버 요청 함수 (getPets, createPet)
   │       ├─ queries.js    queryKey + react-query 훅 (petKeys, usePets, useCreatePet)
   │       └─ components/   이 도메인 데이터를 그리는 UI (PetCard, PetForm)
   │
   ├─ pages/            URL 1개 = 파일 1개. features·components 조립만 한다
   │   ├─ pet/PetListPage.jsx
   │   └─ admin/<도메인>/   관리자 화면
   │
   ├─ layouts/          화면 겉틀. 헤더·푸터·사이드바 + <Outlet/>
   │   └─ UserLayout.jsx, AuthLayout.jsx, AdminLayout.jsx
   │
   ├─ routes/           URL과 페이지 연결
   │   ├─ AppRoutes.jsx       <Routes> 트리. React.lazy, ProtectedRoute 적용
   │   ├─ ProtectedRoute.jsx  로그인·역할(allowedRoles) 검사 후 <Outlet/>
   │   └─ paths.js            경로 문자열 상수
   │
   ├─ components/       도메인을 모르는 공통 UI (Button, Modal, Input, Skeleton)
   ├─ hooks/            도메인을 모르는 범용 훅 (useDebounce, useToggle)
   ├─ utils/            React를 모르는 순수 함수 (formatDate, formatPrice)
   ├─ constants/        바뀌지 않는 값 (MAX_FILE_SIZE)
   ├─ context/          (필요할 때만) 테마·사이드바 같은 UI 전역 상태
   └─ assets/           이미지·폰트·전역 CSS
```

`features/`와 `components/`가 헷갈릴 때: props에 도메인 객체가 들어오면 `features/`(`<PetCard pet={pet}>`), 원시값만 들어오면 `components/`(`<Avatar src={url} size="sm">`).

## 3. 의존 방향

```
main          앱 시작점
routes        URL과 페이지 연결
pages         화면 조립
features      도메인별 코드
api/axios     서버 통신
```

- 위에 있는 것이 아래에 있는 것을 import 한다. 아래에 있는 것은 위를 import 하지 않는다.
- `components`·`hooks`·`utils`·`constants`는 어느 층에서나 import 할 수 있다. 이 넷은 `features`와 `pages`를 import 하지 않는다.
- **`features/A`는 `features/B`를 import 하지 않는다.** 둘이 같이 쓰는 코드는 `components/`·`hooks/`·`utils/`로 올린다. 한 화면에 두 도메인이 같이 나오면 `pages/`에서 둘을 나란히 조립한다.
  - 예외는 하나다: 다른 도메인의 캐시를 무효화할 때 그 도메인 `queries.js`의 `xxxKeys` 객체만 import 할 수 있다. 훅·컴포넌트·API 함수는 가져오지 않는다.
- 같은 도메인 안에서는 상대 경로(`./api`)로, 그 밖의 폴더는 `@/` 경로(`@/features/pet/queries`)로 import 한다. `../../health/queries`처럼 상대 경로로 다른 도메인에 가지 않는다.
- 다른 도메인 import 금지는 ESLint가 검사한다(`eslint.config.js`). 검사는 `@/features/` 경로를 보고 동작하므로 위 경로 규칙을 지켜야 걸린다. ESLint 오류가 나면 규칙을 끄지 않고 import를 고친다.

## 4. 계층별 규칙

### pages

- 조립만 한다. API 함수나 `useQuery`·`useMutation`을 직접 부르지 않고 `features/`의 훅과 컴포넌트를 가져다 놓는다.

```jsx
// pages/pet/PetListPage.jsx
export default function PetListPage() {
  const { data, isPending } = usePets({ page: 1 });       // features/pet/queries.js의 훅
  if (isPending) return <Skeleton />;
  return data.content.map((pet) => <PetCard key={pet.petSn} pet={pet} />);
}
// NG: 페이지에 useQuery({ queryKey: ['pets'], queryFn: ... })를 직접 쓰는 것
```

### features

- `api.js`: 서버 요청 함수만 둔다. `api/axios.js`의 인스턴스를 쓴다. `axios`를 직접 import 하거나 `fetch`를 쓰지 않는다(ESLint가 검사한다).
- `queries.js`: `useQuery`·`useMutation`·queryKey는 여기에만 쓴다. 키는 객체로 export 하고, 다른 파일에 키 배열을 직접 적지 않는다. 데이터를 바꾼 뒤의 무효화도 이 키 객체로 한다.

```js
// features/pet/api.js
import { api } from '@/api/axios';
export const getPets = (params) => api.get('/pets', { params });
export const createPet = (body) => api.post('/pets', body);

// features/pet/queries.js
export const petKeys = {
  all: ['pets'],
  list: (params) => ['pets', 'list', params],
  detail: (petSn) => ['pets', petSn],
};
export const usePets = (params) =>
  useQuery({ queryKey: petKeys.list(params), queryFn: () => getPets(params) });
export const useCreatePet = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPet,
    onSuccess: () => qc.invalidateQueries({ queryKey: petKeys.all }),
  });
};
```

### 상태

- 서버에서 받은 데이터는 react-query 캐시에만 둔다. `useState`나 Context에 복사해 두지 않는다. 복사본은 서버 값이 바뀌어도 따라 바뀌지 않는다. 수정 화면에서 폼의 처음 값으로 넣는 것은 예외다.
- `QueryClient` 기본값은 `main.jsx`에 한 번만 정한다. 실패한 조회를 다시 시도하지 않고, 창을 다시 볼 때 다시 조회하지 않는다.
- `staleTime`은 기본값(0)을 쓴다. 쿼리마다 따로 넣지 않는다. `useMe`만 5분이다.
- 로그아웃에 성공하면 `queryClient.clear()`로 캐시를 전부 지운다. 지우지 않으면 다른 계정으로 로그인했을 때 이전 사용자의 데이터가 보인다.

```js
// src/main.jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false },
  },
});
```

### routes와 관리자 화면

- 경로 문자열은 `routes/paths.js`의 상수로만 쓴다. `<Link to="/pets">`처럼 문자열을 직접 적지 않는다.
- 로그인이 필요한 화면은 `ProtectedRoute` 아래에 둔다. `ProtectedRoute`는 `useMe` 결과로 로그인과 역할을 판단하고, `useMe`가 실패하면 현재 경로를 `redirect` 파라미터에 담아 랜딩으로 보낸다(5장).
- 관리자 화면은 같은 앱의 `/admin` 경로다. 페이지는 `pages/admin/<도메인>/`, 겉틀은 `layouts/AdminLayout.jsx`다.
- `ProtectedRoute`와 메뉴 숨김은 편의다. 관리자 API(`/api/v1/admin/**`)의 권한은 서버가 판정하므로, 서버가 403을 주는 경우를 화면이 처리해야 한다.
- 채팅과 AI 대화창은 모달이 아니라 새 창으로 연다. 새 창도 이 앱의 라우트다.

### 주석

- 주석은 한글로 쓴다.
- 코드를 읽으면 아는 것은 적지 않는다. 왜 이렇게 했는지, 놓치기 쉬운 조건만 적는다.
- AI 도구가 붙인 주석은 그대로 커밋하지 않는다. 코드를 말로 옮긴 주석, 고친 과정을 적은 주석("~로 변경", "기존 로직 유지"), 구분선과 이모지는 지운다.

```js
// 검색어 입력은 짧게 지연해 글자마다 요청이 나가지 않게 한다
// NG: // 상태를 업데이트한다      -- 코드와 같은 말
// NG: // 수정: 로딩 처리 추가     -- 고친 과정
```

## 5. 서버 통신

### 주소와 인증

- 모든 요청은 `/api/v1`로 시작하는 상대 경로다. 호스트와 포트를 코드에 적지 않는다. 개발 환경은 Vite 프록시가, 운영은 Nginx가 같은 오리진으로 만들어 준다.
- 인증은 서버가 심는 HttpOnly 쿠키다. 코드에서 토큰을 읽거나 저장하지 않는다.
- 로그인 여부와 역할은 `features/member`의 `useMe`(`GET /members/me`)로만 확인한다. 쿠키가 HttpOnly라 코드에서 읽을 수 없으므로 서버에 묻는 것이 유일한 방법이다. 헤더와 `ProtectedRoute`가 같은 훅을 쓴다.
- 상태를 바꾸는 요청(GET·HEAD·OPTIONS가 아닌 요청)은 `X-Requested-With: XMLHttpRequest` 헤더가 없으면 서버가 403으로 거절한다. `api/axios.js`의 인스턴스가 모든 요청에 붙여 주므로 그 인스턴스만 쓴다. 파일 업로드(`multipart/form-data`)도 같다.
- API 명세(경로, 요청·응답 필드)는 백엔드의 Swagger UI에서 본다. 개발 환경 주소는 `http://localhost:8080/swagger-ui.html`이다.
- 수정(PATCH)은 바꿀 필드만 보낸다. 서버는 보내지 않은 필드와 `null`인 필드를 바꾸지 않는다. 값을 비워야 하면 빈 문자열(`""`)을 보낸다. PUT으로 저장하는 API는 전체를 보내며, 보내지 않은 항목은 지워진다.
- 로그인한 회원 자신의 자원은 `/members/me`처럼 `me` 경로로 요청한다. 회원 일련번호를 경로나 본문에 넣어 보내지 않는다.

### 응답 모양

```json
{"success":true,"data":{ ... }}
{"success":false,"error":{"code":"MEMBER_NOT_FOUND","message":"일치하는 회원정보를 찾을 수 없습니다.","fields":null}}
```

- 인터셉터가 `data`만 꺼내서 돌려준다. `api.js`의 함수는 `data` 안의 값을 받는다(axios 응답 객체가 아니므로 `res.data`를 또 꺼내지 않는다).
- 보호 파일 다운로드만 예외다. JSON이 아니라 파일 자체가 오므로 이 모양이 아니다. `api.get(url, { responseType: 'blob' })`로 요청하면 인터셉터가 Blob을 그대로 돌려준다.
- 오류는 항상 `{ code, message, fields }` 모양으로 온다. `error.code`로 분기하고 `error.message`를 그대로 화면에 표시한다. 같은 오류의 문구를 프론트에서 새로 쓰지 않는다.
- 서버가 `error`를 주지 않은 경우에도 인터셉터가 같은 모양을 만들어 준다. 응답이 없으면(네트워크 단절) `NETWORK_ERROR`, 응답은 있는데 `error`가 없으면(Nginx 502·504 등) `SERVER_ERROR`다. 화면 코드는 이 경우를 따로 처리하지 않는다.
- `error.fields`는 입력값 검증 오류일 때만 `[{ field, message }]`이고 그 밖에는 `null`이다. 입력칸 아래 문구에 쓴다.

### 오류 표시

- `error.fields`가 있으면 해당 입력칸 아래에 그 `message`를 표시한다.
- 그 밖의 변경 요청(mutation) 오류는 토스트로 `error.message`를 표시한다.
- 조회(query) 오류는 그 영역에 `error.message`와 "다시 시도" 버튼을 표시한다.
- 토스트는 공통 구현 하나만 쓴다. 도메인 코드에서 따로 만들지 않는다. `alert()`를 쓰거나 다른 알림 라이브러리를 추가하지 않는다.
- 화면설계서에 표시 방식이 따로 정해진 화면은 화면설계서를 따른다.

### 상태 코드

| 코드 | 뜻 | 프론트가 하는 일 |
| --- | --- | --- |
| 400 | 입력값이 틀렸거나 업무 규칙에 어긋남 | `error.message`, `error.fields` 표시 |
| 401 | 토큰 없음·만료(이 경우에만) | 인터셉터가 재발급을 1회 시도. 실패하면 랜딩으로 이동 |
| 403 | 권한 없음. `MEMBER_INACTIVE`는 정지·탈퇴 회원 | `MEMBER_INACTIVE`는 재발급 없이 랜딩으로 이동. 그 밖은 `error.message` 표시 |
| 404 | 대상이 없음 | `error.message` 표시 |
| 409 | 이미 있음 | `error.message` 표시 |
| 429 | 로그인에 보안코드 필요 | 로그인 화면이 처리 |

- 재발급은 1회만 한다. 다시 보낸 요청이 또 401이거나 `/auth/refresh` 자신이 401이면 더 시도하지 않는다.
- 여러 요청이 동시에 401을 받아도 재발급 요청은 하나만 보내고 나머지는 그 결과를 같이 기다린다. 서버는 재발급할 때마다 Refresh Token을 바꾸므로, 재발급을 두 번 보내면 두 번째가 실패해 로그인한 사용자가 랜딩으로 튕긴다.
- 랜딩으로 보낼 때는 현재 경로를 `redirect` 파라미터에 담는다.
- `getMe` 요청에만 `skipAuthRedirect: true`를 붙인다. 이 요청은 실패해도 인터셉터가 랜딩으로 보내지 않는다. 붙이지 않으면 랜딩·로그인 화면에서 비로그인 사용자가 401을 받을 때마다 페이지를 다시 불러온다. 다른 요청에는 붙이지 않는다.

```js
// src/api/axios.js
import axios from 'axios';

export const api = axios.create({
  baseURL: '/api/v1',                                  // 상대 경로만
  headers: { 'X-Requested-With': 'XMLHttpRequest' },   // 없으면 서버가 거절한다
});

let refreshing = null;                                 // 동시에 온 401이 재발급 하나를 같이 기다린다

// 서버가 error를 주지 않은 경우에도 화면 코드는 같은 모양을 받는다
const fallbackError = (response) => (response
  ? { code: 'SERVER_ERROR', message: '일시적인 오류가 발생했어요.', fields: null }
  : { code: 'NETWORK_ERROR', message: '네트워크 연결을 확인해 주세요.', fields: null });

api.interceptors.response.use(
  (res) => (res.config.responseType === 'blob'
    ? res.data                                         // 보호 파일은 Blob 그대로 돌려준다
    : res.data.data),                                  // { success, data, error }에서 data만 꺼낸다
  async (err) => {
    const { config, response } = err;
    let body = response?.data;
    if (body instanceof Blob) {                        // 파일 요청이 실패하면 오류 JSON도 Blob으로 온다
      body = await body.text().then(JSON.parse).catch(() => null);
    }
    const error = body?.error ?? fallbackError(response);   // 항상 { code, message, fields }
    const isRefresh = config?.url === '/auth/refresh';
    if (response?.status === 401 && !config._retried && !isRefresh) {
      config._retried = true;                          // 재발급은 한 번만
      try {
        refreshing ??= api.post('/auth/refresh').finally(() => { refreshing = null; });
        await refreshing;
        return api(config);
      } catch { /* 아래 랜딩 이동으로 넘어간다 */ }
    }
    const loggedOut = response?.status === 401 || error.code === 'MEMBER_INACTIVE';
    // 재발급 요청 자신은 이동하지 않는다. 이동 여부는 원래 요청의 skipAuthRedirect로 정한다
    if (loggedOut && !isRefresh && !config?.skipAuthRedirect) {
      location.href = `/?redirect=${encodeURIComponent(location.pathname + location.search)}`;
    }
    return Promise.reject(error);
  },
);
```

```js
// features/member/api.js
export const getMe = () => api.get('/members/me', { skipAuthRedirect: true });

// features/member/queries.js
export const memberKeys = { me: ['members', 'me'] };
export const useMe = () =>
  useQuery({ queryKey: memberKeys.me, queryFn: getMe, staleTime: 5 * 60 * 1000 });
```

### 날짜와 시간

- 서버는 일시를 `"2026-10-12T09:30:00"`, 날짜를 `"2026-10-12"` 문자열로 준다. 시간대 표기는 없고 모두 한국 시간이다. 요청으로 보낼 때도 같은 형식이다.
- 화면에 표시할 문자열은 `utils/formatDate`로만 만든다. 컴포넌트에서 `new Date()`로 직접 변환하거나 문자열을 잘라 쓰지 않는다. `new Date('2026-10-12')`는 UTC 자정으로, `new Date('2026-10-12T09:30:00')`는 브라우저 시간대로 해석되어 기준이 서로 다르다.

### 목록

목록 API는 요청과 응답의 모양이 모두 같다.

- 요청: `?page=1&size=20&sort=...`. **`page`는 1부터 시작한다.** `size`는 최대 50이다.
- 결과가 없으면 오류가 아니라 200에 빈 `content`가 온다. 빈 목록 화면은 `content.length === 0`으로 판단한다.
- 쿼리 파라미터 이름은 서버 필드 이름과 같다(`plcClsfCd`). 검색어는 `keyword`다.
- `size`를 생략하면 서버가 20건을 준다. 게시판 10건, 실종 카드 12건처럼 화면설계서가 정한 값이 있는 목록은 서버가 그 값을 기본값으로 쓴다.
- 응답의 `data`: `content`(목록), `page`, `size`, `totalElements`, `totalPages`, `hasNext`.

### 파일

- 공개 파일은 응답에 담긴 `/files/...` 주소를 `<img src>`에 그대로 쓴다.
- 보호 파일(검진 첨부, 영수증, 문의 첨부, 채팅 사진)은 API 경로로 받는다. 주소를 직접 만들지 않는다. `api.get(url, { responseType: 'blob' })`로 받고, `<img src>`에 API 경로를 직접 넣지 않는다. 직접 넣으면 Access Token이 만료됐을 때 재발급 없이 이미지가 깨진다.
- 업로드는 파일 하나에 10MB 이하, 확장자는 jpg·jpeg·png·webp만 된다. 검진 첨부만 pdf도 된다. 파일을 고른 시점에 프론트에서 먼저 검사한다. 서버도 다시 검사하므로 프론트 검사는 안내용이다.
- 이 값은 `constants/`에 한 번만 정의해 쓴다. 한 번에 올릴 수 있는 파일 개수는 화면마다 다르므로 기능명세서를 따른다.

### 환경변수

- `import.meta.env`는 `api/env.js`만 읽는다. 나머지는 `env.js`에서 import 한다. API 주소는 환경변수로 두지 않는다(위 "주소와 인증").

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

## 7. 여러 명이 같이 고치는 파일

`routes/paths.js`와 `routes/AppRoutes.jsx`는 모든 도메인 담당이 줄을 추가한다. 다들 맨 끝에 붙이면 병합할 때마다 충돌한다.

- 파일 안을 도메인별 구획으로 나누고(주석으로 구분), 자기 도메인 구획 안에 추가한다.
- 이 파일들의 줄 정렬이나 순서 바꾸기를 기능 PR에 섞지 않는다.

## 8. 설정과 비밀값

**이 저장소는 공개다. 한 번 커밋된 값은 지워도 이력에 남는다.**

- 프론트 코드에는 비밀값이 있을 수 없다. 브라우저로 내려가는 코드는 누구나 읽는다. 비밀 키가 필요한 외부 API(AI, OCR, 메일)는 백엔드를 거쳐 부른다.
- `.env`, `.env.local`은 git에 올리지 않는다. 키 이름만 `.env.example`에 적고 값은 비워 둔다.
- 개인 작업 기록(`.claude/handoff.md`, `CLAUDE.local.md`)은 git에 올리지 않는다.

## 9. Git 규칙 (제안, 팀 합의 전)

브랜치·커밋·PR 규칙은 백엔드 저장소와 같다. 커밋 예시와 PR 본문 항목만 프론트에 맞췄다.

### 브랜치

| 브랜치 | 용도 |
| --- | --- |
| `main` | 배포본. `develop`과 `hotfix/`에서만 PR |
| `develop` | 통합. 개인 브랜치와 `hotfix/`에서 PR |
| 개인 브랜치 | 한 사람이 하나를 계속 쓴다. 이름은 자기 이니셜(예: `LJS`) |
| `hotfix/{내용}` | 배포본 긴급 수정. `main`에서 분기해 `main`과 `develop` 양쪽에 병합하고 지운다 |

- 기능마다 브랜치를 새로 만들지 않고 자기 브랜치에서 작업해 `develop`으로 PR을 올린다.
- PR 하나에는 기능 하나만 담는다. 열려 있는 PR이 있는 동안 같은 브랜치에 올린 커밋은 그 PR에 함께 들어가므로, 앞 PR이 병합된 뒤에 다음 기능을 시작한다.
- 새 작업을 시작하기 전에 `develop`의 최신 내용을 자기 브랜치에 합친다. 건너뛰면 다음 PR에서 충돌이 커진다. `git fetch origin` 다음에 `git merge origin/develop`으로 합치고 rebase는 쓰지 않는다. 개인 브랜치는 이미 푸시되어 있어서 rebase하면 커밋이 새로 만들어지고 강제 푸시가 필요해진다.
- 병합은 merge 커밋으로 한다. squash는 쓰지 않는다. 개인 브랜치는 병합 뒤에도 계속 쓰는데, squash로 합치면 이력이 갈라져 이미 병합된 변경이 다음 PR에 다시 나타난다.
- `main`과 `develop`에는 직접 푸시하지 않는다.
- `hotfix/`는 배포본에 문제가 생겨 `develop`의 다음 배포를 기다릴 수 없을 때만 쓴다. `main`으로 PR을 올려 병합한 뒤 같은 내용을 `develop`에도 병합한다. 한쪽만 병합하면 다음 배포에서 수정이 사라진다.

### 커밋

```
[<이니셜>] <종류>: <무엇을 했는지>

[LJS] feat: 반려동물 등록 화면 추가
[LJS] fix: 체중 기록 삭제 후 목록이 갱신되지 않는 문제 수정
```

종류는 `feat`, `fix`, `refactor`, `test`, `docs`, `chore`다. 이니셜은 자기 브랜치 이름과 같게 쓴다. 관련 기능명세서 ID가 있으면 본문에 적는다(예: `FN-MYP-003-01`).

커밋 메시지에 `Co-Authored-By:` 줄을 넣지 않는다. AI 도구가 자동으로 붙인 줄도 커밋하기 전에 지운다. GitHub은 이 줄에 적힌 계정을 그 커밋의 공동 작성자로 표시한다.

### PR

- 대상은 `develop`이다(`hotfix/`만 `main`과 `develop` 양쪽). 승인과 병합은 저장소 관리자가 한다. CI 통과 후 merge 커밋으로 병합한다.
- PR을 올리기 전에 `yarn lint`와 `yarn build`가 통과하는지 확인한다. CI가 설정되기 전에는 PR을 올리는 사람이 로컬에서 돌린다.
- 제목은 커밋 형식과 같게 쓴다.
- 본문에 관련 FN ID나 화면 ID, 무엇을 왜 바꿨는지, 어떻게 확인했는지를 적는다. 화면이 바뀌면 캡처를 붙인다.

### 작업 상태 공유

- 기능의 현재 상태는 GitHub 이슈로 관리한다. 기능 하나에 이슈 하나, 제목에 FN ID나 화면 ID를 쓴다.
- 다른 사람의 코드에 영향을 주는 결정은 개인 기록에 두지 않는다. 이 문서를 고치는 PR로 알린다.
