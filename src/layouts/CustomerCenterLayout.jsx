import { ChevronRight } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import pixelHead from '@/assets/csc_header_pixel.svg';
import { PATHS } from '@/routes/paths';

// description은 화면마다 Figma 부제가 있을 때만 적는다
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
    // 푸터 장식 띠(1376×100, 폭이 줄면 같이 줄어듦)가 본문 아래쪽에 겹쳐 놓이므로 그 높이만큼 더해 내용과 띠 사이를 100px로 둔다
    // main의 아래 여백 24px와 푸터 윗선 1px(띠는 윗선 안쪽에서 재므로 1px 내려앉음)는 75px(100-24-1)에 이미 반영했다
    <div className="pt-6 pb-[calc(75px+min(100px,(100vw-4rem)*100/1376))]">
      <header className="relative mb-10">
        <h1 className="flex items-center text-[28px] leading-[1.2]">
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
          className="absolute -top-2.5 right-0 w-40"
        />
      </header>

      <div className="grid grid-cols-[226px_1fr] gap-8">
        <aside className="-mt-[7px]">
          <nav aria-label="고객센터 메뉴">
            {MENUS.map((menu) => (
              <NavLink
                key={menu.to}
                to={menu.to}
                className={({ isActive }) =>
                  `flex items-center gap-1 py-2.5 text-base leading-normal ${isActive ? 'font-bold text-[#2f6f57]' : 'font-medium text-[#3d4a4b]'}`
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
