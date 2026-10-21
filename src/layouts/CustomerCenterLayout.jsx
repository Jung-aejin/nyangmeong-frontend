import { ChevronRight } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import pixelHead from '@/assets/csc_header_pixel.svg';
import { PATHS } from '@/routes/paths';

/** 고객센터 메뉴: description은 화면별 Figma 부제가 있을 때만 */
const MENUS = [
  {
    label: '공지사항',
    to: PATHS.NOTICES,
    description: '냥멍케어의 새로운 소식과 서비스 안내를 알려 드려요',
  },
  { label: '자주 묻는 질문', to: PATHS.FAQS },
  { label: '1:1 문의', to: PATHS.INQUIRIES },
];

export default function CustomerCenterLayout() {
  const { pathname } = useLocation();
  const current = MENUS.find((menu) => pathname.startsWith(menu.to));

  return (
    <div className="pt-6">
      <header className="relative mb-10 max-[760px]:mb-6">
        <h1 className="flex items-center text-[28px] leading-[1.2] max-[760px]:text-2xl">
          <span className="font-normal text-[#566465]">고객센터</span>
          <ChevronRight size={20} className="mx-1 text-[#b9c4c4]" />
          <span className="font-bold text-[#1a3234]">{current?.label}</span>
        </h1>
        {current?.description && (
          <p className="mt-2 text-base leading-[1.6] text-[#566465]">
            {current.description}
          </p>
        )}
        <img
          src={pixelHead}
          alt=""
          className="absolute -top-2.5 right-0 w-40 max-[760px]:hidden"
        />
      </header>

      <div className="grid grid-cols-[226px_1fr] gap-8 max-[1100px]:grid-cols-[160px_1fr] max-[1100px]:gap-6 max-[760px]:grid-cols-1 max-[760px]:gap-4">
        <aside className="-mt-[7px] max-[760px]:mt-0">
          <nav
            aria-label="고객센터 메뉴"
            className="max-[760px]:flex max-[760px]:gap-5 max-[760px]:overflow-x-auto"
          >
            {MENUS.map((menu) => (
              <NavLink
                key={menu.to}
                to={menu.to}
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
