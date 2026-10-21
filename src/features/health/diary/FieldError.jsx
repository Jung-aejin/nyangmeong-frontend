import Icon from '@/components/Icon';

/** 입력칸 아래 오류 안내 한 줄 */
export default function FieldError({ children }) {
  return (
    <p
      role="alert"
      className="flex items-center gap-1 text-sm/[1.6] text-danger"
    >
      <Icon name="error" className="text-base/[1.6]" />
      {children}
    </p>
  );
}
