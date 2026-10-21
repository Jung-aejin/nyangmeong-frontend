import { ChevronRight } from 'lucide-react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

/** 커뮤니티 메뉴: description은 화면별 부제가 있을 때만 */
const MENUS = [
  { label: '펫이야기', to: PATHS.COMMUNITY, end: true },
  { label: '우리동네 펫돌봄', to: PATHS.COMMUNITY_PETCARE },
  { label: '실종센터', to: PATHS.COMMUNITY_MISSING },
  {
    label: '펫뉴스',
    to: PATHS.COMMUNITY_NEWS,
    description: '반려생활에 도움이 되는 소식을 언론사에서 모아 전해 드려요',
  },
];

export default function CommunityLayout() {
  const { pathname } = useLocation();
  /** 가장 긴 경로가 맞는 메뉴(`/community`는 모든 하위 경로에 맞으므로) */
  const current = MENUS.filter((menu) => pathname.startsWith(menu.to)).sort(
    (a, b) => b.to.length - a.to.length,
  )[0];

  return (
    <div className="pt-6">
      <header className="mb-10 max-[760px]:mb-6">
        <h1 className="flex items-center text-[28px] leading-[1.2] max-[760px]:text-2xl">
          <Link to={PATHS.COMMUNITY} className="font-normal text-[#566465]">
            커뮤니티
          </Link>
          <ChevronRight size={20} className="mx-1 text-[#b9c4c4]" />
          <span className="font-bold text-[#1a3234]">{current?.label}</span>
        </h1>
        {current?.description && (
          <p className="mt-2 text-base leading-[1.6] text-[#566465]">
            {current.description}
          </p>
        )}
      </header>

      <div className="grid grid-cols-[226px_1fr] gap-8 max-[1100px]:grid-cols-[160px_1fr] max-[1100px]:gap-6 max-[760px]:grid-cols-1 max-[760px]:gap-4">
        <aside className="-mt-[7px] max-[760px]:mt-0">
          <nav
            aria-label="커뮤니티 메뉴"
            className="max-[760px]:flex max-[760px]:gap-5 max-[760px]:overflow-x-auto"
          >
            {MENUS.map((menu) => (
              <NavLink
                key={menu.to}
                to={menu.to}
                end={menu.end}
                className={({ isActive }) =>
                  `flex items-center gap-1 py-2.5 text-base leading-normal max-[760px]:shrink-0 max-[760px]:whitespace-nowrap ${isActive ? 'font-bold text-[#2f6f57]' : 'font-medium text-[#3d4a4b]'}`
                }
              >
                {({ isActive }) => (
                  <>
                    {menu.label}
                    {isActive && <ChevronRight size={18} />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </aside>
        <section className="min-w-0">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
