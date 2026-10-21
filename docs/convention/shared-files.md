# 여러 명이 같이 고치는 파일

새 라우트를 붙일 때, `routes/paths.js`·`routes/AppRoutes.jsx`·`routes/domains/index.js`를 고칠 때 연다.

## 라우트: 자기 도메인 파일에 쓴다

라우트는 진입점 → `domains/index.js` → 도메인 라우트 파일 세 단계다.

```
routes/
├─ AppRoutes.jsx            진입점. domains/index.js를 레이아웃에 끼움
└─ domains/
   ├─ index.js              모든 도메인의 <도메인>Routes.js를 import 해 합침(고정)
   ├─ health/
   │  └─ healthRoutes.js    그 도메인의 라우트 전부
   └─ community/
      └─ communityRoutes.js 아직 화면이 없으면 export default []
```

도메인 폴더는 `main`·`account`·`settings`·`ai`·`chat`·`health`·`place`·`community`·`support`·`mypage`·`admin`·`dev` 12개로 미리 만들어 두었다. `domains/index.js`와 `AppRoutes.jsx`는 고정이다. **새 화면의 라우트는 자기 도메인의 `<도메인>Routes.js`에만 쓴다.**

- 라우트 파일은 도메인당 하나가 기본이다. 담당이 다른 기능이 생기거나 파일이 커지면 같은 폴더에 `<기능>Routes.js`를 만들고 `<도메인>Routes.js`에서 import 해 합친다. `domains/index.js`는 건드리지 않는다.
- 새 도메인이 필요하면 팀에 알린 뒤 폴더와 `<도메인>Routes.js`를 만들고 `domains/index.js`에 한 줄 추가한다. 기능 PR에 섞지 않고 따로 올린다.

```js
// routes/domains/health/healthRoutes.js
import { lazy } from 'react';
import { PATHS } from '@/routes/paths';

const CareCalendarPage = lazy(() => import('@/pages/health/CareCalendarPage'));

export default [
  {
    layout: 'user', // 'user'(UserLayout 안) | 'bare'(레이아웃 없음) | 'admin'(AdminLayout)
    auth: 'public', // 'public' | 'member'(로그인 필요) | 'admin'(관리자)
    routes: [{ path: PATHS.HEALTH_CALENDAR, Component: CareCalendarPage }],
  },
];
```

- 페이지는 `React.lazy`로 불러오고 `element`가 아니라 `Component`로 넘긴다. JSX가 없는 `.js` 파일이다.
- `auth: 'member'`는 로그인을 구현한 뒤부터 쓴다(`docs/convention/pages.md`). 그 전에는 `'public'`이다.
- 같은 경로를 두 도메인에 쓰지 않는다.
- `AppRoutes.jsx`의 모으는 방식을 바꾸는 일은 기능 PR에 섞지 않고 따로 올린다.

## paths.js

`routes/paths.js`에는 `docs/routes.md` 1장의 URL이 모두 들어 있다(고정). 구획은 `routes/domains` 폴더와 같다.

- 화면을 만들 때 `paths.js`를 고치지 않고 이미 있는 상수를 쓴다.
- 새 URL이나 URL 변경이 필요하면 `docs/routes.md`를 먼저 고치고 팀에 알린 뒤, 자기 도메인 구획에 추가하는 PR을 따로 올린다. AI 대상(✓) URL이면 AI 라우팅 매핑도 같이 고친다.
- 이 파일의 줄 정렬이나 순서 바꾸기를 기능 PR에 섞지 않는다.
