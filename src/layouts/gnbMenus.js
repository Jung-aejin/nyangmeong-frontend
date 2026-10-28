import { PATHS } from '@/routes/paths';
import { SUB_MENUS } from './subMenus';

const place = (category) => ({
  pathname: PATHS.PLACES,
  search: `?category=${category}`,
});

/** 섹션 메뉴의 2차 메뉴: NavDrawer가 to.pathname을 읽어 객체로 */
const sectionItems = (key) =>
  SUB_MENUS[key].items.map(({ label, to }) => ({
    label,
    to: { pathname: to },
  }));

/** 1차 메뉴는 첫 화면 이동, items는 2차 메뉴(SCR-COM-006) */
export const GNB_MENUS = [
  {
    label: '건강기록',
    to: { pathname: PATHS.HEALTH },
    items: sectionItems('health'),
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
    items: sectionItems('community'),
  },
];
