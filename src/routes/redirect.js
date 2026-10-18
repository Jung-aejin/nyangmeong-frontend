import { PATHS } from './paths';

const BASE = 'http://redirect.invalid';

// 로그인 성공 뒤 갈 곳을 ?redirect= 에서 꺼낸다. 같은 사이트 안의 경로가 아니면 메인이다
export function getRedirectPath(search) {
  const raw = new URLSearchParams(search).get('redirect');
  if (!raw || !raw.startsWith('/')) return PATHS.MAIN;

  // //evil.com 과 /\evil.com 은 /로 시작해도 브라우저가 다른 사이트로 해석한다
  const url = new URL(raw, BASE);
  if (url.origin !== BASE) return PATHS.MAIN;

  // 랜딩·로그인으로 돌아가면 같은 곳을 맴돈다
  if (url.pathname === PATHS.HOME || url.pathname === PATHS.LOGIN) {
    return PATHS.MAIN;
  }
  return url.pathname + url.search + url.hash;
}
