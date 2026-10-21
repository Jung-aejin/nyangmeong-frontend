import { api } from '@/api/axios';

/** 비로그인 401 랜딩 이동 반복 방지용 이동 끄기 */
export const getMe = () => api.get('/members/me', { skipAuthRedirect: true });

/**
 * [회원 API 가짜 응답]
 * - 회원 요약(LJS)·로그아웃(YAY) API 전까지 사용, api.get()·api.post()로 교체
 * - 필드는 MemberSummaryResponse 기준(docs/api/member.md), 연결 때 Swagger 재확인
 */
export const getMemberSummary = () =>
  Promise.resolve({
    mbrNcnm: '초코보호자',
    maskedAcntEml: 'jin****@gmail.com',
  });

export const logout = () => Promise.resolve();
