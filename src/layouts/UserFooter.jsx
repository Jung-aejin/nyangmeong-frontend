import { Link } from 'react-router-dom';
import footerPixel from '@/assets/footer_pixel.svg';
import { PATHS } from '@/routes/paths';

const DEV_TEAM = ['이진성', '안인철', '정애진', '서정민', '김선진', '윤아연'];
/** 디자인 임시 값(실제 주소는 공개 저장소에 두지 않음) */
const EMAIL_PLACEHOLDER = '0000@gmail.com';
/** 대표전화·팩스 디자인 임시 값(실제 번호는 공개 저장소에 두지 않음) */
const TEL_PLACEHOLDER = '000-0000-0000';
const FAX_PLACEHOLDER = '02-0000-0000';

export default function UserFooter() {
  return (
    <footer className="relative border-t border-[#e2e7e7] bg-[#f5f2ee] text-[#566465]">
      {/** 푸터 윗선 위 장식 띠 */}
      <img
        src={footerPixel}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-full left-1/2 h-auto w-[calc(100%-4rem)] max-w-[1376px] -translate-x-1/2 max-[760px]:w-[calc(100%-2rem)]"
      />
      <div className="mx-auto max-w-[1440px] px-8 py-10 max-[1100px]:pt-0 max-[760px]:px-5">
        {/** 1100px 이하: 링크 줄이 맨 위로 올라가고 세로로 쌓임 */}
        <div className="flex items-start gap-8 max-[1100px]:flex-col max-[1100px]:gap-6">
          <div className="w-[344px] shrink-0 space-y-1 text-[15px] max-[1100px]:w-auto max-[760px]:space-y-2.5 max-[760px]:text-sm">
            <p className="text-lg font-bold">냥멍케어</p>
            {/** 한 묶음: 줄 사이 간격 없음 */}
            <div>
              <p>우리 아이의 건강한 하루를 기록하세요.</p>
              <p>기록부터 케어까지, 냥멍케어가 함께합니다.</p>
            </div>
            <div>
              <p>(54888) 전북특별자치도 전주시 덕진구 기린대로 499</p>
              <p>
                대표전화 : {TEL_PLACEHOLDER}
                <span className="ml-4">팩스 : {FAX_PLACEHOLDER}</span>
              </p>
            </div>
          </div>
          <div>
            <p className="font-bold">Dev Team</p>
            <ul className="mt-1 grid grid-cols-2 gap-x-6 text-[15px] max-[1100px]:grid-cols-3 max-[1100px]:gap-x-12 max-[1100px]:gap-y-1.5 max-[760px]:grid-cols-2 max-[760px]:gap-x-6 max-[760px]:gap-y-3 max-[760px]:text-sm">
              {DEV_TEAM.map((name) => (
                <li key={name}>
                  <span className="font-bold max-[760px]:block">{name}</span>{' '}
                  {EMAIL_PLACEHOLDER}
                </li>
              ))}
            </ul>
          </div>
          <nav className="ml-auto flex items-center gap-8 font-bold max-[1100px]:order-first max-[1100px]:-mx-8 max-[1100px]:w-[calc(100%+4rem)] max-[1100px]:justify-between max-[1100px]:border-b max-[1100px]:border-[#eae6e0] max-[1100px]:px-24 max-[1100px]:py-5 max-[1100px]:text-lg max-[760px]:-mx-5 max-[760px]:w-[calc(100%+2.5rem)] max-[760px]:gap-3 max-[760px]:px-5 max-[760px]:text-base">
            <Link to={PATHS.NOTICES}>공지사항</Link>
            <i className="h-4 w-px bg-[#b9c4c4]" />
            <Link to={PATHS.FAQS}>자주하는 질문</Link>
            <i className="h-4 w-px bg-[#b9c4c4]" />
            <Link to={PATHS.INQUIRIES}>1:1 문의</Link>
          </nav>
        </div>

        <hr className="my-6 border-[#eae6e0]" />
        <div className="flex items-center justify-between gap-4 text-sm max-[1100px]:flex-col max-[1100px]:items-start max-[1100px]:gap-2 max-[760px]:gap-3">
          <p>
            본 사이트는 팀 [꼬리연구소]의 공동 역량 증명을 위한 포트폴리오
            용도로 제작되었으며, 일체의 상업적 목적이 없음을 밝힙니다.
          </p>
          <p className="shrink-0">© 2026 꼬리연구소. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
