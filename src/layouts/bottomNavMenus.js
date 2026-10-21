import { PATHS } from '@/routes/paths';
import { GNB_MENUS } from './gnbMenus';

const gnbItems = (label) =>
  GNB_MENUS.find((menu) => menu.label === label).items;

/**
 * [모바일 바텀 네비]
 * - 760px 미만에서 메인·플레이스를 뺀 사용자 화면은 푸터 대신 바텀 네비를 둠(docs/convention/ui.md)
 * - paths는 바텀 네비를 둘 경로(하위 경로 포함), items는 그 메뉴의 서브 메뉴
 */
export const BOTTOM_NAV_MENUS = [
  {
    label: '건강기록',
    paths: [PATHS.HEALTH],
    items: gnbItems('건강기록'),
  },
  {
    label: '커뮤니티',
    paths: [PATHS.COMMUNITY],
    items: gnbItems('커뮤니티'),
  },
  {
    label: '마이페이지',
    paths: [PATHS.MYPAGE],
    items: [
      { label: '반려동물', to: PATHS.MYPAGE_PETS },
      { label: '소비', to: PATHS.MYPAGE_EXPENSES },
      { label: '캐릭터', to: PATHS.MYPAGE_CHARACTERS },
      { label: '포인트', to: PATHS.MYPAGE_POINTS },
    ],
  },
  {
    label: '고객센터',
    paths: [PATHS.NOTICES, PATHS.FAQS, PATHS.INQUIRIES],
    items: [
      { label: '공지사항', to: PATHS.NOTICES },
      { label: '자주하는 질문', to: PATHS.FAQS },
      { label: '1:1 문의', to: PATHS.INQUIRIES },
    ],
  },
  {
    label: '설정',
    paths: [PATHS.SETTINGS_NOTIFICATIONS],
    items: [{ label: '알림 설정', to: PATHS.SETTINGS_NOTIFICATIONS }],
  },
];

/** pathname이 paths 중 하나이거나 그 하위 경로인 메뉴 */
export const findBottomNavMenu = (pathname) =>
  BOTTOM_NAV_MENUS.find((menu) =>
    menu.paths.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    ),
  );
