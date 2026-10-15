# 폴더 구조 (파일별)

폴더 단위 구조와 `features/`·`components/` 구분은 `AGENTS.md`에 있다. 새 폴더나 공통 파일을 만들 때, 어느 파일이 무슨 일을 하는지 볼 때 연다.

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

## 실행 환경

- 패키지 매니저는 Yarn만 쓴다. `yarn.lock`을 커밋하고 `package-lock.json`, `pnpm-lock.yaml`은 만들지 않는다. Yarn 버전은 `package.json`의 `packageManager`에 적혀 있다.
- Node는 24를 쓴다. 버전은 `.nvmrc`와 `package.json`의 `engines`에 적혀 있다.
- 저장할 때 Prettier가 자동으로 적용된다. 설정은 저장소의 `.vscode/settings.json`과 `.prettierrc`에 있고 개인 설정으로 덮어쓰지 않는다.
- 줄바꿈은 LF다(`.gitattributes`가 커밋할 때 맞춘다).
