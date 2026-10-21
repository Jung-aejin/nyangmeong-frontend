# 여러 명이 같이 고치는 파일

새 라우트를 붙일 때, `routes/paths.js`·`routes/AppRoutes.jsx`를 고칠 때 연다.

## 라우트: 도메인 파일에 쓴다

라우트는 진입점 → 도메인 `index.js` → 라우트 파일 세 단계다.

```
routes/
├─ AppRoutes.jsx            진입점. domains/*/index.js를 모두 모음
└─ domains/
   └─ health/               도메인 1개 = 폴더 1개(소문자 단수)
      ├─ index.js           라우트 파일을 import 해 export default로 합치기만 함
      └─ healthRoutes.js    그 도메인의 라우트 전부
```

`routes/AppRoutes.jsx`는 도메인을 모르고, `routes/domains/*/index.js`를 glob으로 모아 레이아웃에 끼운다. **새 화면의 라우트는 `AppRoutes.jsx`가 아니라 자기 도메인의 `<도메인>Routes.js`에 쓴다.**

- 새 도메인: `routes/domains/<도메인>/` 폴더에 `index.js`와 `<도메인>Routes.js`를 만든다. 폴더만 추가하면 되고 `AppRoutes.jsx`는 건드리지 않는다.
- 라우트 파일은 도메인당 하나가 기본이다. 담당이 다른 기능이 생기거나 파일이 커지면 `<기능>Routes.js`로 나누고 `index.js`에서 합친다.
- `index.js`에는 import와 `export default`만 둔다. 라우트를 직접 쓰지 않는다.

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

// routes/domains/health/index.js
import healthRoutes from './healthRoutes';

export default [...healthRoutes];
```

- 페이지는 `React.lazy`로 불러오고 `element`가 아니라 `Component`로 넘긴다. JSX가 없는 `.js` 파일이다.
- `AppRoutes.jsx`에 도메인 `index.js`를 하나씩 import 하지 않는다. 여러 명이 같이 고치는 파일이 되어 병합 충돌이 난다.
- `auth: 'member'`는 로그인을 구현한 뒤부터 쓴다(`docs/convention/pages.md`). 그 전에는 `'public'`이다.
- 같은 경로를 두 도메인에 쓰지 않는다.
- 도메인 폴더를 만들거나 `AppRoutes.jsx`의 모으는 방식을 바꾸는 일은 기능 PR에 섞지 않고 따로 올린다.

## paths.js

`routes/paths.js`는 모든 도메인 담당이 줄을 추가한다. 다들 맨 끝에 붙이면 병합할 때마다 충돌한다.

- 파일 안을 도메인별 구획으로 나누고(주석으로 구분), 자기 도메인 구획 안에 추가한다. 같은 도메인 구획을 두 번 만들지 않는다.
- 이 파일의 줄 정렬이나 순서 바꾸기를 기능 PR에 섞지 않는다.
