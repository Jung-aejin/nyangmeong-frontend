import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/Icon';
import { findActiveItem, SUB_MENUS } from './subMenus';

/**
 * [사이드 메뉴]
 * - 1101px 이상에서만 보이는 왼쪽 2차 메뉴(디자인 COM-5)
 * - section: SUB_MENUS 키, active: 선택 메뉴의 to. menuLabel(섹션 이름)은 기존 화면 호환용
 */
export default function SideMenu({ section, active, menuLabel }) {
  const { pathname } = useLocation();
  const menu =
    SUB_MENUS[section] ??
    Object.values(SUB_MENUS).find((item) => item.label === menuLabel);
  if (!menu) return null;
  const activeItem = findActiveItem(menu, active, pathname);

  return (
    <aside className="sticky top-[104px] hidden self-start pt-2.5 min-[1101px]:block">
      <nav aria-label={`${menu.label} 하위 메뉴`}>
        <ul className="flex flex-col gap-1">
          {menu.items.map((item) => {
            const isActive = item === activeItem;
            return (
              <li key={item.label}>
                <Link
                  to={item.to}
                  aria-current={isActive ? 'page' : undefined}
                  className={`-mx-3 flex min-h-10 items-center gap-3 rounded-lg px-3 text-base/[1.6] transition-colors ${
                    isActive
                      ? 'font-bold text-[#2f6f57]'
                      : 'font-medium text-[#3d4a4b] hover:bg-[#ebf0f0] hover:text-[#1a3234]'
                  }`}
                >
                  {item.label}
                  {isActive && <Icon name="chevron_right" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
