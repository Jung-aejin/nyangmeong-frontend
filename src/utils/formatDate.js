// 서버가 주는 날짜(2026-08-08 또는 2026-08-08T09:00:00)를 화면 표기 2026.08.08로 바꾼다
export const formatDate = (value) => value.slice(0, 10).replaceAll('-', '.');
