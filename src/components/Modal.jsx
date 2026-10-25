import { X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';

/**
 * isConfirm: 가운데 정렬 확인 팝업, 아니면 제목 줄과 ✕가 있는 입력 모달
 * isLarge: 화면을 크게 덮는 모달. 본문(children)이 남는 높이를 차지하고 푸터는 맨 아래에 구분선과 함께 고정,
 *          760px 이하에서는 화면 전체
 * isSheet: 760px 이하에서만 아래에서 올라오는 시트(손잡이 막대 포함), 그 위 폭은 가운데 모달 그대로
 */
export default function Modal({
  title,
  description,
  footer,
  isConfirm = false,
  isLarge = false,
  isSheet = false,
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
      className={`m-auto bg-white p-0 shadow-depth-lg backdrop:bg-[rgba(15,23,35,0.45)] ${
        isLarge
          ? 'h-[min(660px,calc(100dvh-2rem))] max-h-none w-[min(760px,calc(100vw-2rem))] max-w-none flex-col rounded-modal open:flex max-[760px]:h-dvh max-[760px]:w-screen max-[760px]:rounded-none'
          : 'max-h-[calc(100vh-2rem)] w-[min(440px,calc(100vw-2rem))] rounded-modal'
      } ${
        isSheet
          ? 'max-[760px]:relative max-[760px]:m-0 max-[760px]:mt-auto max-[760px]:max-h-[calc(100dvh-2rem)] max-[760px]:w-full max-[760px]:max-w-none max-[760px]:rounded-b-none'
          : ''
      }`}
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
          {isSheet && (
            <span
              aria-hidden="true"
              className="absolute top-2 left-1/2 h-1 w-9 -translate-x-1/2 rounded-xs bg-line-strong min-[761px]:hidden"
            />
          )}
          <header
            className={`flex shrink-0 items-center justify-between gap-3 border-b border-line-soft px-6 ${isLarge ? 'py-2.5' : 'py-4'}`}
          >
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
          <div
            className={
              isLarge
                ? 'flex min-h-0 flex-1 flex-col overflow-y-auto min-[761px]:overflow-hidden'
                : 'px-6 py-5'
            }
          >
            {children}
          </div>
        </>
      )}
      <footer
        className={
          isLarge
            ? 'flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-line px-6 py-2.5'
            : 'flex gap-2 px-6 pb-6 *:min-w-0 *:flex-1'
        }
      >
        {footer}
      </footer>
    </dialog>
  );
}
