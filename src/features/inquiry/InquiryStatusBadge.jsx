import { INQUIRY_STATUS } from './api';

/** 처리 상태 뱃지: 미답변(amber), 답변 완료(green) */
export default function InquiryStatusBadge({ isAnswered }) {
  return (
    <span
      className={`inline-flex h-6 items-center rounded-full px-2.5 pt-[1.5px] align-middle text-[13px] leading-none font-semibold whitespace-nowrap ${isAnswered ? 'bg-[#e6f4ec] text-[#22744a]' : 'bg-[#fcf1df] text-[#9a5c0c]'}`}
    >
      {isAnswered ? INQUIRY_STATUS.DONE : INQUIRY_STATUS.OPEN}
    </span>
  );
}
