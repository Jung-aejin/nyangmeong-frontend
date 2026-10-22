/** 글 길이에 맞춰 높이를 맞춘다. 높이를 비우는 동안 문서가 짧아져 스크롤이 튀는 것을 되돌린다 */
export const fitHeight = (textarea) => {
  const scrollY = window.scrollY;
  textarea.style.height = 'auto';
  const border = textarea.offsetHeight - textarea.clientHeight;
  textarea.style.height = `${textarea.scrollHeight + border}px`;
  window.scrollTo(0, scrollY);
};
