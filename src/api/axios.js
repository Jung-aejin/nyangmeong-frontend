import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  /** 서버의 상태 변경 요청 거절(403) 방지용 헤더 */
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
});

/** 진행 중인 재발급 공유 */
let refreshing = null;

/** 서버 오류 형식 통일 */
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
  /** 응답 data 추출(파일은 Blob 그대로) */
  (res) => (res.config.responseType === 'blob' ? res.data : res.data.data),
  async (err) => {
    const { config, response } = err;
    let body = response?.data;
    /** 파일 요청 실패 시 오류 Blob 파싱 */
    if (body instanceof Blob) {
      body = await body
        .text()
        .then(JSON.parse)
        .catch(() => null);
    }
    /** 서버 오류 { code, message, data } 정리(fields는 검증 오류의 data) */
    const error = body?.code
      ? {
          code: body.code,
          message: body.message,
          fields: body.code === 'INVALID_INPUT_VALUE' ? body.data : null,
        }
      : fallbackError(response);
    const isRefresh = config?.url === '/auth/refresh';
    if (
      response?.status === 401 &&
      error.code === 'TOKEN_EXPIRED' &&
      !config._retried &&
      !isRefresh
    ) {
      /** 재발급 1회 제한 */
      config._retried = true;
      try {
        refreshing ??= api.post('/auth/refresh').finally(() => {
          refreshing = null;
        });
        await refreshing;
        return api(config);
      } catch {
        /** 재발급 실패 시 랜딩 이동으로 진행 */
      }
    }
    const loggedOut =
      response?.status === 401 || error.code === 'MEMBER_INACTIVE';
    /** 재발급 요청 자신은 이동 제외 */
    if (loggedOut && !isRefresh && !config?.skipAuthRedirect) {
      location.href = `/?redirect=${encodeURIComponent(location.pathname + location.search)}`;
    }
    return Promise.reject(error);
  },
);
