import { PATHS } from './paths';

const BASE = 'http://redirect.invalid';

/** 로그인 성공 뒤 이동 경로(?redirect=), 같은 사이트 밖이면 메인 */
export function getRedirectPath(search) {
  const raw = new URLSearchParams(search).get('redirect');
  if (!raw || !raw.startsWith('/')) return PATHS.MAIN;

  /** 프로토콜 상대·역슬래시 URL의 외부 사이트 해석 차단 */
  const url = new URL(raw, BASE);
  if (url.origin !== BASE) return PATHS.MAIN;

  /** 랜딩·로그인 복귀 시 순환 방지 */
  if (url.pathname === PATHS.HOME || url.pathname === PATHS.LOGIN) {
    return PATHS.MAIN;
  }
  return url.pathname + url.search + url.hash;
}
