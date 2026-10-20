import { PATHS } from '@/routes/paths';

// 대표 진입점 7종이다. 전체 라우팅 대상은 기능명세서 부록 매핑표를 따른다
export const shortcutChips = [
  { label: '건강기록', path: PATHS.HEALTH },
  { label: '동물병원 찾기', path: `${PATHS.PLACES}?category=hospital` },
  { label: '플레이스', path: PATHS.PLACES },
  { label: '커뮤니티', path: PATHS.COMMUNITY },
  { label: '마이페이지', path: PATHS.MYPAGE },
  { label: '캐릭터 꾸미기', path: PATHS.MYPAGE_CHARACTERS },
  { label: '고객센터', path: PATHS.NOTICES },
];
