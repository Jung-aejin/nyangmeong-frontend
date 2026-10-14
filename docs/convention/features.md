# 냥멍케어 프론트엔드 컨벤션: features와 상태

`AGENTS.md`에서 이어지는 문서다.

## features

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

## 상태

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
