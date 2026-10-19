import { PATHS } from '@/routes/paths';

const place = (category) => ({ pathname: PATHS.PLACES, search: `?category=${category}` });

// 1차 메뉴는 첫 화면으로 이동하고, items는 2차 메뉴다(SCR-COM-006)
export const GNB_MENUS = [
  {
    label: '건강기록',
    to: { pathname: PATHS.HEALTH },
    items: [
      { label: '종합 건강기록', to: { pathname: PATHS.HEALTH } },
      { label: '건강 일지', to: { pathname: PATHS.HEALTH_DIARY } },
      { label: '케어 캘린더', to: { pathname: PATHS.HEALTH_CALENDAR } },
    ],
  },
  {
    label: '플레이스',
    to: place('hospital'),
    items: [
      { label: '병원', to: place('hospital') },
      { label: '미용', to: place('beauty') },
      { label: '용품', to: place('goods') },
      { label: '동반', to: place('pet-friendly') },
      { label: '호텔', to: place('hotel') },
    ],
  },
  {
    label: '커뮤니티',
    to: { pathname: PATHS.COMMUNITY },
    items: [
      { label: '펫이야기', to: { pathname: PATHS.COMMUNITY } },
      { label: '우리동네 펫돌봄', to: { pathname: PATHS.COMMUNITY_PETCARE } },
      { label: '실종센터', to: { pathname: PATHS.COMMUNITY_MISSING } },
      { label: '펫뉴스', to: { pathname: PATHS.COMMUNITY_NEWS } },
    ],
  },
];
