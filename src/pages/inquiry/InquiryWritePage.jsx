import { generatePath, useNavigate, useSearchParams } from 'react-router-dom';
import { INQUIRY_TYPES } from '@/features/inquiry/api';
import InquiryForm from '@/features/inquiry/InquiryForm';
import { useCreateInquiry } from '@/features/inquiry/queries';
import { PATHS } from '@/routes/paths';

export default function InquiryWritePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { mutate, isPending, isError } = useCreateInquiry();
  /** 픽셀 캐릭터 화면 등에서 ?type=으로 오면 문의 유형을 미리 고른다 */
  const typeParam = searchParams.get('type');
  const presetType = INQUIRY_TYPES.includes(typeParam) ? typeParam : '';

  const handleSubmit = (values) =>
    mutate(values, {
      onSuccess: ({ otoInqrySn }) =>
        navigate(generatePath(PATHS.INQUIRY_DETAIL, { otoInqrySn })),
    });

  return (
    <InquiryForm
      mode="write"
      initial={{
        inqryTyNm: presetType,
        inqryTtl: '',
        inqryCn: '',
        atchFiles: [],
      }}
      cancelTo={PATHS.INQUIRIES}
      isPending={isPending}
      errorMessage={
        isError && '문의를 등록하지 못했어요. 잠시 뒤 다시 시도해 주세요'
      }
      onSubmit={handleSubmit}
    />
  );
}
