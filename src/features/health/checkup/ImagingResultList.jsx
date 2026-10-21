import { useState } from 'react';
import Icon from '@/components/Icon';
import Modal from '@/components/Modal';
import { BTN_SECONDARY } from '@/components/buttonStyles';
import { ROW_LINE, TEXT_BTN } from './checkupStyles';
import { IMAGING_KINDS, IMAGING_PARTS, findName } from './checkupTypes';

/**
 * [영상검사 목록]
 * - 첨부 자료 중 "영상 사진" 유형만 영상 종류·촬영 부위·썸네일로 보여 주는 조회 영역 (FN-HLT-005-02)
 * - 썸네일 클릭 → 원본 미리보기, 등록·교체·삭제는 첨부 자료 탭에서
 */
export default function ImagingResultList({ attachments, onGoAttachments }) {
  const [previewAttachment, setPreviewAttachment] = useState(null);

  return (
    <div>
      {attachments.length === 0 && <p className="text-muted">결과 없음</p>}
      <ul>
        {attachments.map((attachment) => (
          <li
            key={attachment.atchSn}
            className={`flex items-center gap-3.5 py-3.5 ${ROW_LINE}`}
          >
            <button
              type="button"
              aria-label={`${attachment.fileNm} 원본 미리보기`}
              className="grid aspect-[4/3] w-14 shrink-0 cursor-zoom-in place-items-center overflow-hidden rounded-[10px] border border-dashed border-line-strong bg-surface-2 text-line-strong"
              onClick={() => setPreviewAttachment(attachment)}
            >
              {attachment.fileUrl ? (
                <img
                  src={attachment.fileUrl}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <Icon name="image" className="text-[28px]" />
              )}
            </button>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">
                {findName(IMAGING_KINDS, attachment.imgKindCd)} ·{' '}
                {findName(IMAGING_PARTS, attachment.imgPartCd)}
              </span>
              <span className="flex items-center gap-1 text-subtle">
                <Icon name="image" className="text-lg" />
                <span className="break-all">{attachment.fileNm}</span>
              </span>
            </span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={`${TEXT_BTN} mt-4`}
        onClick={onGoAttachments}
      >
        첨부 자료 탭에서 등록하기
        <Icon name="chevron_right" className="text-lg" />
      </button>

      {previewAttachment && (
        <Modal
          title={previewAttachment.fileNm}
          onClose={() => setPreviewAttachment(null)}
          footer={
            <button
              type="button"
              className={BTN_SECONDARY}
              onClick={() => setPreviewAttachment(null)}
            >
              닫기
            </button>
          }
        >
          {previewAttachment.fileUrl ? (
            <img
              src={previewAttachment.fileUrl}
              alt={previewAttachment.fileNm}
              className="max-h-[60vh] w-full object-contain"
            />
          ) : (
            <div className="grid aspect-[4/3] place-items-center rounded-[10px] bg-surface-2 text-line-strong">
              <Icon name="image" className="text-[52px]" />
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
