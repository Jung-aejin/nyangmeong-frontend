# 여러 명이 같이 고치는 파일

새 라우트를 붙일 때, `routes/paths.js`·`routes/AppRoutes.jsx`를 고칠 때 연다.

## 라우트: 도메인 파일에 쓴다

`routes/AppRoutes.jsx`는 진입점이다. 도메인을 모르고, `routes/domains/*Routes.js`를 모두 모아 레이아웃에 끼운다. **새 화면의 라우트는 `AppRoutes.jsx`가 아니라 자기 도메인 파일에 쓴다.** 도메인 파일이 없으면 새로 만든다(`routes/domains/<도메인>Routes.js`, 도메인 이름은 소문자 단수). 파일만 추가하면 되고 `AppRoutes.jsx`는 건드리지 않는다.

```js
// routes/domains/healthRoutes.js
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
- 도메인 파일을 만들거나 `AppRoutes.jsx`의 모으는 방식을 바꾸는 일은 기능 PR에 섞지 않고 따로 올린다.

## paths.js

`routes/paths.js`는 모든 도메인 담당이 줄을 추가한다. 다들 맨 끝에 붙이면 병합할 때마다 충돌한다.

- 파일 안을 도메인별 구획으로 나누고(주석으로 구분), 자기 도메인 구획 안에 추가한다. 같은 도메인 구획을 두 번 만들지 않는다.
- 이 파일의 줄 정렬이나 순서 바꾸기를 기능 PR에 섞지 않는다.
