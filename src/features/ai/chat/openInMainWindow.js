/** 본창 이동 후 현재 창 닫기 */
export function openInMainWindow(path) {
  const opener = window.opener;
  if (opener && !opener.closed) {
    opener.location.href = path;
    opener.focus();
  } else {
    window.open(path, '_blank');
  }
  window.close();
}
