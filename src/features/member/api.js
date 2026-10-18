import { api } from '@/api/axios';

// 비로그인 사용자의 401로 랜딩 이동이 반복되지 않게 이 요청만 이동을 끈다
export const getMe = () => api.get('/members/me', { skipAuthRedirect: true });

// 회원 요약 조회(LJS 백엔드)와 로그아웃(AIC) API가 생기기 전까지 쓰는 가짜 응답이다.
// api.get() / api.post()로 바꾼다. 필드 이름은 백엔드 명세 MemberSummaryResponse 기준이다
// (docs/api/member.md). 실제 연결 때 Swagger로 다시 확인한다
export const getMemberSummary = () =>
  Promise.resolve({ mbrNcnm: '초코보호자', maskedAcntEml: 'jin****@gmail.com' });

export const logout = () => Promise.resolve();
