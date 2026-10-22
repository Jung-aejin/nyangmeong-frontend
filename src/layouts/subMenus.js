import cscHead from '@/assets/csc_header_pixel.svg';
import cmuHead from '@/assets/head_cmu.svg';
import hltHead from '@/assets/head_hlt.svg';
import mypHead from '@/assets/head_myp.svg';
import { PATHS } from '@/routes/paths';

/**
 * [섹션 메뉴]
 * - 사이드 메뉴·페이지 머리 경로·≤1100 메뉴 전환의 메뉴 목록
 * - pixel: 페이지 머리 오른쪽 픽셀 그림
 */
export const SUB_MENUS = {
  health: {
    label: '건강기록',
    to: PATHS.HEALTH,
    pixel: hltHead,
    items: [
      { label: '종합 건강기록', to: PATHS.HEALTH },
      { label: '건강 일지', to: PATHS.HEALTH_DIARY },
      { label: '케어 캘린더', to: PATHS.HEALTH_CALENDAR },
    ],
  },
  community: {
    label: '커뮤니티',
    to: PATHS.COMMUNITY,
    pixel: cmuHead,
    items: [
      { label: '펫이야기', to: PATHS.COMMUNITY },
      { label: '우리동네 펫돌봄', to: PATHS.COMMUNITY_PETCARE },
      { label: '실종센터', to: PATHS.COMMUNITY_MISSING },
      { label: '펫뉴스', to: PATHS.COMMUNITY_NEWS },
    ],
  },
  mypage: {
    label: '마이페이지',
    to: PATHS.MYPAGE,
    pixel: mypHead,
    items: [
      { label: '마이페이지 홈', to: PATHS.MYPAGE },
      { label: '반려동물 관리', to: PATHS.MYPAGE_PETS },
      { label: '픽셀 캐릭터', to: PATHS.MYPAGE_CHARACTERS },
      { label: '포인트 관리 / 케어미션', to: PATHS.MYPAGE_POINTS },
      { label: '가계부', to: PATHS.MYPAGE_EXPENSES },
      { label: '회원정보 수정', to: PATHS.MYPAGE_PROFILE },
    ],
  },
  support: {
    label: '고객센터',
    to: PATHS.NOTICES,
    pixel: cscHead,
    items: [
      { label: '공지사항', to: PATHS.NOTICES },
      { label: '자주 묻는 질문', to: PATHS.FAQS },
      { label: '1:1 문의', to: PATHS.INQUIRIES },
    ],
  },
};

/** 선택 메뉴: active가 없으면 현재 경로와 같은 메뉴 */
export const findActiveItem = (section, active, pathname) =>
  section.items.find((item) => item.to === (active ?? pathname));
