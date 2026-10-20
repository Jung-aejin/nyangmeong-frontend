const MAX_BYTES = 10 * 1024 * 1024;
const HEADER_BYTES = 12;

export const RECEIPT_ACCEPT = '.jpg,.jpeg,.png,.webp';
export const RECEIPT_HELP = 'jpg·jpeg·png·webp · 1장 10MB 이하';

const UNSUPPORTED =
  '지원하지 않는 형식이에요. jpg·jpeg·png·webp 이미지를 올려 주세요';
const TOO_LARGE = '용량이 너무 커요. 10MB 이하 이미지를 올려 주세요';

/** 파일 앞 바이트 기반 실제 형식 판별 */
const detectType = (bytes) => {
  const startsWith = (signature, offset = 0) =>
    signature.every((byte, i) => bytes[offset + i] === byte);
  if (startsWith([0xff, 0xd8, 0xff])) return 'jpg';
  if (startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    return 'png';
  if (
    startsWith([0x52, 0x49, 0x46, 0x46]) &&
    startsWith([0x57, 0x45, 0x42, 0x50], 8)
  ) {
    return 'webp';
  }
  return null;
};

/** 업로드 가능 여부 검사 */
export const validateReceiptFile = async (file) => {
  const ext = file.name.split('.').pop().toLowerCase();
  const expectedType = ext === 'jpeg' ? 'jpg' : ext;
  if (!['jpg', 'png', 'webp'].includes(expectedType)) return UNSUPPORTED;
  if (file.size > MAX_BYTES) return TOO_LARGE;
  const header = new Uint8Array(
    await file.slice(0, HEADER_BYTES).arrayBuffer(),
  );
  return detectType(header) === expectedType ? null : UNSUPPORTED;
};
