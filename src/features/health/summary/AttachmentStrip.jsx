import { useState } from 'react';
import Card from '@/components/Card';
import Icon from '@/components/Icon';
import { showToast } from '@/components/toastStore';
import { formatDate } from '@/utils/formatDate';
import PhotoModal from './PhotoModal';
import { CardTitle, SummaryEmpty } from './SummaryParts';
import { DIARY_EXAM_PATH } from './summaryUtils';

/**
 * [첨부 자료] (FN-HLT-011-09)
 * - 검진기록 첨부파일 최신 4건을 가로로 나열(미리보기 → 파일명 → 날짜), 업로드·삭제 없음
 * - 이미지는 누르면 미리보기, PDF 등은 내려받기. [전체 보기]는 없음(명세 v1.1)
 * - 제목 줄 어디를 눌러도(버튼 포함) 목록을 접고 펼침(처음은 접힘, 명세 v1.1)
 */
export default function AttachmentStrip({ attachments }) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (attachment) => {
    if (!attachment.fileUrl) {
      showToast(
        isImage(attachment)
          ? '미리볼 수 있는 파일이 없어요'
          : '내려받을 수 있는 파일이 없어요',
      );
      return;
    }
    if (isImage(attachment)) {
      setPhotoUrl(attachment.fileUrl);
      return;
    }
    const link = document.createElement('a');
    link.href = attachment.fileUrl;
    link.download = attachment.fileNm;
    link.click();
  };

  return (
    <Card
      title={<CardTitle icon="description">첨부 자료</CardTitle>}
      action={
        <button
          type="button"
          aria-expanded={isOpen}
          className="inline-flex shrink-0 items-center gap-0.5 font-semibold whitespace-nowrap text-muted hover:text-ink"
        >
          {isOpen ? '접기' : '펼치기'}
          <Icon
            name={isOpen ? 'expand_less' : 'expand_more'}
            className="text-xl"
          />
        </button>
      }
      onHeaderClick={() => setIsOpen((open) => !open)}
      bodyClassName={isOpen ? '' : 'hidden'}
    >
      {attachments.length === 0 ? (
        <SummaryEmpty
          icon="description"
          description="검진상세에 올린 결과지·증명서·영상 사진이 여기에 모여요"
          action="건강 일지에서 검진기록 등록하기"
          to={DIARY_EXAM_PATH}
        />
      ) : (
        <ul className="grid grid-cols-2 gap-4 min-[761px]:grid-cols-4 min-[1101px]:grid-cols-[repeat(4,160px)]">
          {attachments.map((attachment) => {
            const image = isImage(attachment);
            const actionLabel = `${attachment.fileNm} ${image ? '미리보기' : '다운로드'}`;
            return (
              <li key={attachment.atchSn} className="min-w-0">
                <button
                  type="button"
                  aria-label={actionLabel}
                  className="group relative flex w-full flex-col gap-1 text-left"
                  onClick={() => handleOpen(attachment)}
                >
                  <span
                    className={`relative mb-2 grid aspect-[4/3] place-items-center overflow-hidden rounded-[10px] border border-line bg-surface-2 text-line-strong group-hover:border-brand-100 ${
                      image ? 'border-dashed' : ''
                    }`}
                  >
                    {image && attachment.fileUrl ? (
                      <img
                        src={attachment.fileUrl}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      <Icon
                        name={image ? 'image' : 'description'}
                        className="text-[52px]"
                      />
                    )}
                    <em className="absolute top-2 left-2 rounded-[4px] bg-ink px-2 text-[13px] font-semibold text-white not-italic">
                      {image ? 'IMG' : 'PDF'}
                    </em>
                  </span>
                  <span className="truncate text-lg/[1.6] font-semibold group-hover:text-brand-600">
                    {attachment.fileNm}
                  </span>
                  <span className="text-sm/[1.6] text-subtle">
                    {formatDate(attachment.ckupYmd)}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute top-2 right-2 grid size-8 place-items-center rounded-full border border-line bg-white text-muted"
                  >
                    <Icon
                      name={image ? 'zoom_in' : 'download'}
                      className="text-[18px]"
                    />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {photoUrl && (
        <PhotoModal src={photoUrl} onClose={() => setPhotoUrl(null)} />
      )}
    </Card>
  );
}

const isImage = (attachment) => attachment.mimeType.startsWith('image/');
