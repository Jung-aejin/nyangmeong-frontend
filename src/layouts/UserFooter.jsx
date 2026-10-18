import { Link } from 'react-router-dom';
import footerPixel from '@/assets/footer_pixel.svg';
import { PATHS } from '@/routes/paths';

const DEV_TEAM = ['이진성', '안인철', '정애진', '서정민', '김선진', '윤아연'];
// Placeholder from the design. Real addresses are not committed to this public repo
const EMAIL_PLACEHOLDER = '0000@gmail.com';

export default function UserFooter() {
  return (
    <footer className="relative border-t border-[#e2e7e7] bg-[#f5f2ee] text-[#566465]">
      {/* Decorative band that sits right above the footer edge */}
      <img
        src={footerPixel}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-full left-1/2 h-auto w-[calc(100%-4rem)] max-w-[1376px] -translate-x-1/2"
      />
      <div className="mx-auto max-w-[1440px] px-8 py-10">
        <div className="flex items-start gap-8">
          <div className="w-[344px] shrink-0 space-y-1 text-[15px]">
            <p className="text-lg font-bold">냥멍케어</p>
            <p>우리 아이의 건강한 하루를 기록하세요.</p>
            <p>기록부터 케어까지, 냥멍케어가 함께합니다.</p>
            <p>(54888) 전북특별자치도 전주시 덕진구 기린대로 499</p>
          </div>
          <div>
            <p className="font-bold">Dev Team</p>
            <ul className="mt-1 grid grid-cols-2 gap-x-6 text-[15px]">
              {DEV_TEAM.map((name) => (
                <li key={name}>
                  <span className="font-bold">{name}</span> {EMAIL_PLACEHOLDER}
                </li>
              ))}
            </ul>
          </div>
          <nav className="ml-auto flex items-center gap-8 font-bold">
            <Link to={PATHS.NOTICES}>공지사항</Link>
            <i className="h-4 w-px bg-[#b9c4c4]" />
            <Link to={PATHS.FAQS}>자주하는 질문</Link>
            <i className="h-4 w-px bg-[#b9c4c4]" />
            <Link to={PATHS.INQUIRIES}>1:1 문의</Link>
          </nav>
        </div>

        <hr className="my-6 border-[#eae6e0]" />
        <div className="flex items-center justify-between gap-4 text-sm">
          <p>
            본 사이트는 팀 [꼬리연구소]의 공동 역량 증명을 위한 포트폴리오 용도로 제작되었으며,
            일체의 상업적 목적이 없음을 밝힙니다.
          </p>
          <p className="shrink-0">© 2026 꼬리연구소. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
