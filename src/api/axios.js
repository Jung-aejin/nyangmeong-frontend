import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  // 없으면 서버가 상태를 바꾸는 요청을 403으로 거절한다
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
});

// 동시에 온 401이 재발급 하나를 같이 기다린다
let refreshing = null;

// 서버가 error를 주지 않은 경우에도 화면 코드는 같은 모양을 받는다
const fallbackError = (response) =>
  response
    ? {
        code: 'SERVER_ERROR',
        message: '일시적인 오류가 발생했어요.',
        fields: null,
      }
    : {
        code: 'NETWORK_ERROR',
        message: '네트워크 연결을 확인해 주세요.',
        fields: null,
      };

api.interceptors.response.use(
  // 보호 파일은 Blob 그대로, 그 밖은 { success, data, error }에서 data만 꺼낸다
  (res) => (res.config.responseType === 'blob' ? res.data : res.data.data),
  async (err) => {
    const { config, response } = err;
    let body = response?.data;
    // 파일 요청이 실패하면 오류 JSON도 Blob으로 온다
    if (body instanceof Blob) {
      body = await body
        .text()
        .then(JSON.parse)
        .catch(() => null);
    }
    const error = body?.error ?? fallbackError(response);
    const isRefresh = config?.url === '/auth/refresh';
    if (response?.status === 401 && !config._retried && !isRefresh) {
      // 재발급은 한 번만
      config._retried = true;
      try {
        refreshing ??= api.post('/auth/refresh').finally(() => {
          refreshing = null;
        });
        await refreshing;
        return api(config);
      } catch {
        // 아래 랜딩 이동으로 넘어간다
      }
    }
    const loggedOut =
      response?.status === 401 || error.code === 'MEMBER_INACTIVE';
    // 재발급 요청 자신은 이동하지 않는다. 이동 여부는 원래 요청의 skipAuthRedirect로 정한다
    if (loggedOut && !isRefresh && !config?.skipAuthRedirect) {
      location.href = `/?redirect=${encodeURIComponent(location.pathname + location.search)}`;
    }
    return Promise.reject(error);
  },
);
