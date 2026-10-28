import { MAX_ATTACHMENT_SIZE } from './checkupTypes';

const ALLOWED_FILE = /\.(jpe?g|png|webp|pdf)$/i;

/** 첨부 파일 오류 문구: 문제가 없으면 null */
export const getFileError = (file) => {
  if (!file) return '파일을 선택해 주세요';
  if (!ALLOWED_FILE.test(file.name)) {
    return 'jpg·jpeg·png·webp·pdf 파일만 올릴 수 있어요';
  }
  if (file.size > MAX_ATTACHMENT_SIZE) return '1건 10MB 이하로 올려 주세요';
  return null;
};
