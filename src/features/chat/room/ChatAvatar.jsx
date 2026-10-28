const SIZES = {
  sm: 'size-8 text-sm',
  md: 'size-9',
  lg: 'size-11',
};

/** 닉네임 첫 글자 동그라미 */
export default function ChatAvatar({ name, size = 'md' }) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-[#ebf0f0] font-bold text-[#3d4a4b] ${SIZES[size]}`}
    >
      {name?.charAt(0)}
    </span>
  );
}
