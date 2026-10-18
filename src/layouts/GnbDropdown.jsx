import { Link } from 'react-router-dom';

// 호버한 1차 메뉴 아래에 뜨는 카드(SCR-COM-006). items: [{ label, to }]
export default function GnbDropdown({ items, onNavigate }) {
  return (
    <ul
      className="absolute left-0 top-[58px] z-40 w-[180px] rounded-[10px] border border-[#e2e7e7] bg-white p-1.5 shadow-sm"
      role="menu"
      data-menu="gnb"
    >
      {items.map((item) => (
        <li key={item.label}>
          <Link
            to={item.to}
            role="menuitem"
            onClick={onNavigate}
            className="block rounded-md px-3 py-[9px] text-base leading-6 text-[#3d4a4b] hover:bg-[#ebf0f0] focus-visible:bg-[#ebf0f0]"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
