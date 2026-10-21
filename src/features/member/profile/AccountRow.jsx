import { ROW_BTN } from '../shared/profileStyles';

/**
 * 항목명 | 값 | 오른쪽 끝 버튼 한 줄. isEditing이면 값과 버튼 자리에 children(입력 영역)이 펼쳐진다.
 * actionLabel이 없으면 조회 전용 줄이다
 */
export default function AccountRow({
  label,
  value,
  actionLabel,
  isEditing = false,
  onEdit,
  children,
}) {
  return (
    <div
      className={`grid min-h-16 grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 border-t border-line-soft px-5 py-3 first:border-t-0 sm:grid-cols-[140px_minmax(0,1fr)_auto] sm:px-8 ${
        isEditing ? 'items-start' : 'items-center'
      }`}
    >
      <span
        className={`col-span-full text-sm text-muted sm:col-span-1 sm:text-base ${
          isEditing ? 'sm:pt-[18px]' : ''
        }`}
      >
        {label}
      </span>
      {isEditing ? (
        <div className="col-span-full flex max-w-[440px] flex-col gap-3 py-2 sm:col-span-2 sm:col-start-2">
          {children}
        </div>
      ) : (
        <>
          <span className="min-w-0 font-medium">{value}</span>
          {actionLabel && (
            <button type="button" onClick={onEdit} className={ROW_BTN}>
              {actionLabel}
            </button>
          )}
        </>
      )}
    </div>
  );
}
