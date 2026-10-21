# 냥멍케어 프론트엔드 컨벤션: pages와 routes

`AGENTS.md`에서 이어지는 문서다.

## pages

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

## routes와 관리자 화면

- 경로 문자열은 `routes/paths.js`의 상수로만 쓴다. `<Link to="/pets">`처럼 문자열을 직접 적지 않는다.
- 로그인이 필요한 화면은 `ProtectedRoute` 아래에 둔다. `ProtectedRoute`는 `useMe` 결과로 로그인과 역할을 판단하고, `useMe`가 실패하면 현재 경로를 `redirect` 파라미터에 담아 랜딩으로 보낸다(`docs/convention/api.md`).
  - 로그인을 구현하기 전에는 감싸지 않는다. `/members/me`가 없어 `useMe`가 항상 실패하므로 감싼 화면은 열리지 않는다. 기획에는 "로그인 연결 때 `ProtectedRoute`로 감쌀 화면"으로 적어 두고, 로그인을 붙일 때 `routes/domains/*Routes.js`의 해당 그룹 `auth`를 `'member'`로 바꾼다(`docs/OPEN_ISSUES.md`).
- 관리자 화면은 같은 앱의 `/admin` 경로다. 페이지는 `pages/admin/`, 겉틀은 `layouts/AdminLayout.jsx`다.
- `ProtectedRoute`와 메뉴 숨김은 편의다. 관리자 API(`/api/admin/**`)의 권한은 서버가 판정하므로, 서버가 403을 주는 경우를 화면이 처리해야 한다.
- 채팅과 AI 대화창은 모달이 아니라 새 창으로 연다. 새 창도 이 앱의 라우트다.
