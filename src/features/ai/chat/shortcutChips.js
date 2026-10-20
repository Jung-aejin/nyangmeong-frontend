import { PATHS } from '@/routes/paths';

/** 대표 바로가기 */
export const shortcutChips = [
  { label: '건강기록', path: PATHS.HEALTH },
  { label: '동물병원 찾기', path: `${PATHS.PLACES}?category=hospital` },
  { label: '플레이스', path: PATHS.PLACES },
  { label: '커뮤니티', path: PATHS.COMMUNITY },
  { label: '마이페이지', path: PATHS.MYPAGE },
  { label: '캐릭터 꾸미기', path: PATHS.MYPAGE_CHARACTERS },
  { label: '고객센터', path: PATHS.NOTICES },
];
