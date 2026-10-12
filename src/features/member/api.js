import { api } from '@/api/axios';

// 비로그인 사용자의 401로 랜딩 이동이 반복되지 않게 이 요청만 이동을 끈다
export const getMe = () => api.get('/members/me', { skipAuthRedirect: true });
