import { NavLink } from 'react-router-dom';
import Icon from '@/components/Icon';
import { GNB_MENUS } from './gnbMenus';

// 1101px 이상에서만 보이는 왼쪽 2차 메뉴. menuLabel은 GNB 1차 메뉴 이름이다(예: 건강기록)
export default function SideMenu({ menuLabel }) {
  const menu = GNB_MENUS.find((item) => item.label === menuLabel);
  if (!menu) return null;

  return (
    <aside className="sticky top-[104px] hidden self-start pt-2.5 min-[1101px]:block">
      <nav aria-label={`${menuLabel} 메뉴`}>
        <ul className="flex flex-col gap-1">
          {menu.items.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.to}
                end
                className={({ isActive }) =>
                  `-mx-3 flex min-h-10 items-center gap-3 rounded-lg px-3 text-base transition-colors ${
                    isActive
                      ? 'font-bold text-[#2f6f57]'
                      : 'font-medium text-[#3d4a4b] hover:bg-[#ebf0f0] hover:text-[#1a3234]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && <Icon name="chevron_right" />}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
