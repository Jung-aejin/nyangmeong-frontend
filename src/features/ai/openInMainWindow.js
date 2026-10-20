// 본창을 path로 이동시키고 이 창은 닫는다. 본창이 닫혀 있으면 새 탭으로 연다
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
