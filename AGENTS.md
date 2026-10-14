# 냥멍케어 프론트엔드 컨벤션

이 저장소에서 코드를 쓰는 사람과 AI 도구가 따르는 규칙이다. 이 파일에는 구조와 의존 방향처럼 항상 필요한 규칙만 있고, 나머지는 `docs/convention/`에 있다("나머지 규칙이 있는 곳").

- Codex는 이 파일을 자동으로 읽는다. Claude Code는 `CLAUDE.md`의 `@AGENTS.md` 한 줄로 읽는다. 그 줄을 지우면 규칙이 통째로 빠진다.
- Git 규칙(`docs/convention/git.md`)은 팀 합의 전 제안이다. 아직 정하지 않은 것은 `docs/OPEN_ISSUES.md`에 있다.
- 백엔드 규칙은 `nyangmeong-backend` 저장소의 `AGENTS.md`와 `docs/convention/`에 있다. 서버 통신(`docs/convention/api.md`)과 이름 짓기의 필드 이름(`docs/convention/common.md`)은 그 문서와 맞물린다.

## 코드를 쓰기 전에 꼭 알 것

어기면 되돌리기 어렵거나 오류 없이 조용히 잘못되는 것만 모았다. 나머지는 필요할 때 찾아본다.

1. **비밀값을 커밋하지 않고, `VITE_` 변수에도 넣지 않는다.** 이 저장소는 공개다. `VITE_`로 시작하는 환경변수는 빌드 결과에 그대로 들어가 브라우저에서 누구나 볼 수 있다. (설정과 비밀값)
2. **토큰을 `localStorage`나 변수에 저장하지 않는다.** 로그인은 서버가 심는 쿠키로 유지되고 브라우저가 알아서 붙인다. 로그인 여부와 역할은 `features/member`의 `useMe`로만 확인한다. (`docs/convention/api.md`)
3. **401은 "토큰 없음·만료"에만 온다.** 재발급은 `api/axios.js`가 한 번만 시도한다. 화면 코드에서 401을 따로 처리하거나 재발급을 부르지 않는다. (`docs/convention/api.md`)
4. **`features/A`는 `features/B`를 import 하지 않는다.** 같이 쓰는 코드는 `components/`·`hooks/`·`utils/`로 올린다. queryKey 객체만 예외다. (의존 방향)
5. **필드 이름을 새로 짓지 않는다.** 서버가 준 JSON 키(`pstSn`, `mdfcnDt`)를 그대로 쓴다. 읽기 좋게 바꾸는 변환 함수를 만들지 않는다. (`docs/convention/common.md` 이름 짓기)

## 기술 스택

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

## 폴더 구조

```
(저장소 루트)
├─ .env.example        환경변수 키 목록. 값은 비워 둔다
├─ vite.config.js      alias는 @/ 하나만 둔다. /api 프록시 설정
└─ src/
   ├─ main.jsx          앱 시작점. QueryClient·BrowserRouter·Provider로 감싸서 <App/> 마운트
   ├─ App.jsx           <AppRoutes/> 하나만 렌더. 전역 CSS import
   │
   ├─ api/              서버 통신 공통 설정. 도메인을 모른다
   │   ├─ axios.js        axios 인스턴스(메인 서버 `api`, AI 서버 `aiApi`) + 인터셉터 (`docs/convention/api.md`)
   │   └─ env.js          import.meta.env를 읽어 export하는 유일한 파일
   │
   ├─ features/         도메인별 코드 묶음. 도메인 1개 = 폴더 1개
   │   └─ pet/
   │       ├─ api.js        이 도메인의 서버 요청 함수 (getPets, createPet)
   │       ├─ queries.js    queryKey + react-query 훅 (petKeys, usePets, useCreatePet)
   │       └─ PetCard.jsx   이 도메인 데이터를 그리는 UI. 하위 폴더 없이 여기에 둔다
   │
   ├─ pages/            URL 1개 = 파일 1개. features·components 조립만 한다
   │   ├─ pet/PetListPage.jsx
   │   └─ admin/           관리자 화면. 하위 폴더 없이 여기에 둔다
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

폴더 깊이는 `src` 아래 3단계를 넘지 않는다. 지금 구조는 2단계다(`features/pet/PetCard.jsx`).

`features/`와 `components/`가 헷갈릴 때: props에 도메인 객체가 들어오면 `features/`(`<PetCard pet={pet}>`), 원시값만 들어오면 `components/`(`<Avatar src={url} size="sm">`).

## 의존 방향

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

## 나머지 규칙이 있는 곳

아래 파일은 자동으로 읽히지 않는다. 해당하는 일을 하기 전에 연다.

| 이럴 때 | 읽는 파일 |
| --- | --- |
| 코드를 쓸 때 항상 | `docs/convention/common.md`: 주석, 이름 짓기 |
| `pages/`, `routes/`, 관리자 화면을 쓸 때 | `docs/convention/pages.md` |
| `features/`를 쓰거나 상태를 둘 곳을 정할 때 | `docs/convention/features.md` |
| 서버에 요청을 보내거나 응답·오류를 다룰 때 | `docs/convention/api.md` |
| 브랜치·커밋·PR을 만들 때 | `docs/convention/git.md` |

## 여러 명이 같이 고치는 파일

`routes/paths.js`와 `routes/AppRoutes.jsx`는 모든 도메인 담당이 줄을 추가한다. 다들 맨 끝에 붙이면 병합할 때마다 충돌한다.

- 파일 안을 도메인별 구획으로 나누고(주석으로 구분), 자기 도메인 구획 안에 추가한다.
- 이 파일들의 줄 정렬이나 순서 바꾸기를 기능 PR에 섞지 않는다.

## 설정과 비밀값

**이 저장소는 공개다. 한 번 커밋된 값은 지워도 이력에 남는다.**

- 프론트 코드에는 비밀값이 있을 수 없다. 브라우저로 내려가는 코드는 누구나 읽는다. 비밀 키가 필요한 외부 API(AI, OCR, 메일)는 백엔드를 거쳐 부른다.
- `.env`, `.env.local`은 git에 올리지 않는다. 키 이름만 `.env.example`에 적고 값은 비워 둔다.
- 개인 작업 기록(`.claude/handoff.md`, `CLAUDE.local.md`)은 git에 올리지 않는다.
