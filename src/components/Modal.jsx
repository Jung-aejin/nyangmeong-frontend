import { X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';

/** isConfirm: 가운데 정렬 확인 팝업, 아니면 제목 줄과 ✕가 있는 입력 모달 */
export default function Modal({
  title,
  description,
  footer,
  isConfirm = false,
  isPending = false,
  onClose,
  children,
}) {
  const dialogRef = useRef(null);
  const titleId = useId();

  /** ConfirmModal과 같은 showModal·cleanup 방식 */
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  const handleCancel = (event) => {
    event.preventDefault();
    if (!isPending) onClose();
  };

  /** 배경(backdrop) 클릭 판별 */
  const handleMouseDown = (event) => {
    if (event.target !== event.currentTarget || isPending) return;
    event.preventDefault();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="m-auto max-h-[calc(100vh-2rem)] w-[min(440px,calc(100vw-2rem))] rounded-modal bg-white p-0 shadow-depth-lg backdrop:bg-[rgba(15,23,35,0.45)]"
      onCancel={handleCancel}
      onMouseDown={handleMouseDown}
    >
      {isConfirm ? (
        <div className="px-8 pt-8 pb-6 text-center">
          <h2
            id={titleId}
            className="text-lg leading-[1.35] font-bold break-keep"
          >
            {title}
          </h2>
          {description && (
            <p className="mt-2 leading-[1.6] break-keep text-muted">
              {description}
            </p>
          )}
          {children}
        </div>
      ) : (
        <>
          <header className="flex items-center justify-between gap-3 border-b border-line-soft px-6 py-4">
            <h2 id={titleId} className="text-lg font-bold">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              aria-label="닫기"
              className="grid size-8 place-items-center rounded-md text-subtle hover:bg-surface-2"
            >
              <X className="size-5" />
            </button>
          </header>
          <div className="px-6 py-5">{children}</div>
        </>
      )}
      <footer className="flex gap-2 px-6 pb-6 *:min-w-0 *:flex-1">
        {footer}
      </footer>
    </dialog>
  );
}
