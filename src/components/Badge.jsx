const TONES = {
  brand: 'bg-[#e9f2f2] text-[#1e4a4c]',
  gray: 'bg-[#eef1f4] text-[#59636e]',
  amber: 'bg-[#fcf1df] text-[#9a5c0c]',
  white: 'bg-white text-[#1e4a4c]',
  ok: 'bg-[#e6f4ec] text-[#22744a] before:size-1.5 before:rounded-full before:bg-current before:content-[""]',
  outline: 'bg-white text-[#3d4a4b] shadow-[inset_0_0_0_1px_#e2e7e7]',
};

// 알약 모양 뱃지. 높이·여백·글자는 퍼블리싱 시안의 .badge와 같다(24px, 위 1.5px·옆 10px)
export default function Badge({ tone = 'gray', className = '', children }) {
  return (
    <span
      className={`inline-flex h-6 items-center gap-[5px] rounded-full px-2.5 pt-[1.5px] align-middle text-[13px] leading-none font-semibold whitespace-nowrap ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
