import { useEffect, useRef } from 'react';

export default function ConfirmModal({
  title,
  confirmLabel = '확인',
  cancelLabel = '취소',
  errorMessage,
  isPending = false,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);
  const cancelRef = useRef(null);

  // showModal은 dialog를 top layer에 올리고 뒤 페이지를 비활성으로 만들어서, 포털과 포커스 가두기 코드가 필요 없다.
  // cleanup에서 닫는 이유: StrictMode가 이 effect를 두 번 돌리는데, 이미 열린 dialog에 showModal을 또 부르면 오류가 난다
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    // 실수로 Enter를 눌러도 확정되지 않게 안전한 선택지에 포커스를 둔다
    cancelRef.current.focus();
    return () => dialog.close();
  }, []);

  // ESC는 cancel 이벤트를 낸다. 브라우저 기본 닫기는 막고, 닫는 것은 이 컴포넌트를 내리는 부모에게 맡긴다
  const handleCancel = (event) => {
    event.preventDefault();
    if (!isPending) onCancel();
  };

  // dialog에 padding이 없어서, dialog 자체가 mousedown 대상이면 배경(backdrop)을 누른 것이다
  // preventDefault를 하지 않으면 mousedown이 끝난 뒤 브라우저가 포커스를 body로 옮겨서, 부모가 돌려준 포커스가 사라진다
  const handleMouseDown = (event) => {
    if (event.target !== event.currentTarget || isPending) return;
    event.preventDefault();
    onCancel();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label={title}
      className="m-auto w-80 rounded-[14px] bg-white p-0 shadow-lg backdrop:bg-black/40"
      onCancel={handleCancel}
      onMouseDown={handleMouseDown}
    >
      <div className="p-6">
        <p className="text-base font-bold text-[#1a3234]">{title}</p>
        {errorMessage && (
          <p role="alert" className="mt-2 text-sm text-[#f44b21]">
            {errorMessage}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            disabled={isPending}
            className="h-10 rounded-lg border border-[#e2e7e7] px-4 text-sm text-[#3d4a4b] hover:bg-[#f4f6f6] disabled:opacity-50"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isPending}
            className="h-10 rounded-lg bg-[#285a5c] px-4 text-sm font-bold text-white hover:bg-[#1f4a4c] disabled:opacity-50"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
