import { Link, useLocation } from 'react-router-dom';

const itemPath = (to) => (typeof to === 'string' ? to : to.pathname);

/** 760px 미만 하단 고정 서브 메뉴 */
export default function BottomNav({ menu }) {
  const { pathname } = useLocation();
  /** 하위 경로도 강조하되, 상위 경로 항목(/health 등)이 함께 켜지지 않게 가장 길게 일치하는 하나만 */
  const activePath = menu.items
    .map((item) => itemPath(item.to))
    .filter((path) => pathname === path || pathname.startsWith(`${path}/`))
    .sort((a, b) => b.length - a.length)[0];

  return (
    <nav
      aria-label={`${menu.label} 메뉴`}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[#e2e7e7] bg-white pb-[env(safe-area-inset-bottom)] min-[760px]:hidden"
    >
      <ul className="flex h-[60px]">
        {menu.items.map((item) => {
          const isActive = itemPath(item.to) === activePath;
          return (
            <li key={item.label} className="flex-1">
              <Link
                to={item.to}
                aria-current={isActive ? 'page' : undefined}
                className={`flex h-full items-center justify-center text-[15px] ${
                  isActive ? 'font-bold text-[#285a5c]' : 'text-[#566465]'
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
