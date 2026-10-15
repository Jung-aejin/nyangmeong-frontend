# 냥멍케어 프론트엔드 컨벤션

이 저장소에서 코드를 쓰는 사람과 AI 도구가 따르는 규칙이다. 이 파일에는 항상 필요한 규칙만 두고, 나머지는 `docs/convention/`에 있다("나머지 규칙이 있는 곳").

- Codex는 이 파일을 자동으로 읽는다. Claude Code는 `CLAUDE.md`의 `@AGENTS.md` 한 줄로 읽는다. 그 줄을 지우면 규칙이 통째로 빠진다.
- 이 파일은 AI 도구가 매번 통째로 읽으므로 짧게 유지한다. 특정 작업에만 필요한 규칙은 `docs/convention/`에 쓴다.
- Git 규칙(`docs/convention/git.md`)은 팀 합의 전 제안이다. 아직 정하지 않은 것은 `docs/OPEN_ISSUES.md`에 있다.
- 백엔드 규칙은 `nyangmeong-backend` 저장소의 `AGENTS.md`와 `docs/convention/`에 있다. 서버 통신(`docs/convention/api.md`)과 이름 짓기의 필드 이름(`docs/convention/common.md`)은 그 문서와 맞물린다.

## 코드를 쓰기 전에 꼭 알 것

어기면 되돌리기 어렵거나 오류 없이 조용히 잘못되는 것만 모았다. 나머지는 필요할 때 찾아본다.

1. **비밀값을 커밋하지 않고, `VITE_` 변수에도 넣지 않는다.** 이 저장소는 공개다. `VITE_`로 시작하는 환경변수는 빌드 결과에 그대로 들어가 브라우저에서 누구나 볼 수 있다. (`docs/convention/config.md`)
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
| 린트·포맷 | ESLint 9, Prettier(겹치는 규칙은 `eslint-config-prettier`로 끈다) |
| 실행 환경 | Node 24, Yarn(Yarn만 쓴다. `package-lock.json`을 만들지 않는다) |

여기에 없는 라이브러리를 추가하려면 먼저 팀에 묻는다. VS Code로 작업하고, 저장할 때 Prettier가 적용된다. 실행 환경 세부는 `docs/convention/structure.md`에 있다.

## 폴더 구조

```
src/
├─ api/         서버 통신 공통 설정(axios.js, env.js). 도메인을 모른다
├─ features/    도메인별 코드. 도메인 1개 = 폴더 1개 (api.js, queries.js, 그 도메인 UI)
├─ pages/       URL 1개 = 파일 1개. features·components 조립만 한다 (관리자 화면은 pages/admin/)
├─ layouts/     화면 겉틀. 헤더·푸터·사이드바 + <Outlet/>
├─ routes/      URL과 페이지 연결 (AppRoutes.jsx, ProtectedRoute.jsx, paths.js)
├─ components/  도메인을 모르는 공통 UI
├─ hooks/  utils/  constants/  context/  assets/
```

파일별 설명과 깊이 규칙은 `docs/convention/structure.md`에 있다.

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

아래 파일은 자동으로 읽히지 않는다. 해당하는 일을 하기 전에 그 파일만 연다.

| 이럴 때 | 읽는 파일 |
| --- | --- |
| 코드를 쓸 때 항상 | `docs/convention/common.md`: 주석, 이름 짓기 |
| `pages/`, `routes/`, 관리자 화면을 쓸 때 | `docs/convention/pages.md` |
| `features/`를 쓰거나 상태를 둘 곳을 정할 때 | `docs/convention/features.md` |
| 서버에 요청을 보내거나 응답·오류를 다룰 때 | `docs/convention/api.md` |
| 새 폴더·공통 파일을 만들 때, 실행 환경(Yarn·Node)을 다룰 때 | `docs/convention/structure.md` |
| 환경변수(`.env*`)를 다룰 때, 핸드오프를 쓸 때 | `docs/convention/config.md` |
| `routes/paths.js`, `routes/AppRoutes.jsx`를 고칠 때 | `docs/convention/shared-files.md` |
| 브랜치·커밋·PR을 만들 때 | `docs/convention/git.md` |

## AI 도구 작업 방식

사용량 한도가 있는 플랜을 쓰는 팀원이 있어 토큰을 아낀다.

- 이 파일은 이미 읽혀 있으므로 다시 읽지 않는다. `docs/convention/`은 위 표에서 해당하는 파일만 연다.
- 파일은 필요한 부분만 읽는다. 위치를 모르면 먼저 검색하고 그 주변만 읽는다. `node_modules/`, `dist/`는 읽지 않는다.
- 린트·빌드는 출력을 줄여 돌리고(`yarn -s lint`, `yarn -s build`) 실패한 부분만 본다.
- 몇 개 파일로 끝나는 일에는 서브에이전트를 쓰지 않는다. 서브에이전트도 사용량을 쓴다.
- 작업 하나가 끝나면 `/done`으로 핸드오프를 남기고 `/clear`한 뒤, 다음 작업은 `/start`로 시작한다.
