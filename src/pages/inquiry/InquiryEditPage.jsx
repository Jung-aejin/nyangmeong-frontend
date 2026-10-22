import {
  generatePath,
  Link,
  Navigate,
  useNavigate,
  useParams,
} from 'react-router-dom';
import PageSkeleton from '@/components/PageSkeleton';
import SkeletonCard from '@/components/SkeletonCard';
import InquiryForm from '@/features/inquiry/InquiryForm';
import { useInquiry, useUpdateInquiry } from '@/features/inquiry/queries';
import { PATHS } from '@/routes/paths';

export default function InquiryEditPage() {
  const navigate = useNavigate();
  const otoInqrySn = Number(useParams().otoInqrySn);
  const { data: inquiry, isPending, isError } = useInquiry(otoInqrySn);
  const update = useUpdateInquiry();
  const detailPath = generatePath(PATHS.INQUIRY_DETAIL, { otoInqrySn });

  if (isPending) {
    return (
      <PageSkeleton>
        <SkeletonCard className="h-[986px]" />
      </PageSkeleton>
    );
  }
  if (isError) {
    return (
      <div role="alert" className="text-[#566465]">
        <p>문의를 찾지 못했어요</p>
        <Link
          to={PATHS.INQUIRIES}
          className="mt-3 inline-block font-medium underline"
        >
          목록으로
        </Link>
      </div>
    );
  }

  /** 답변이 등록된 문의는 수정할 수 없다: 상세로 */
  if (inquiry.ansCn) return <Navigate to={detailPath} replace />;

  const handleSubmit = (values) =>
    update.mutate(
      { otoInqrySn, ...values },
      { onSuccess: () => navigate(detailPath) },
    );

  return (
    <InquiryForm
      key={otoInqrySn}
      mode="edit"
      initial={inquiry}
      cancelTo={detailPath}
      isPending={update.isPending}
      errorMessage={
        update.isError && '문의를 저장하지 못했어요. 잠시 뒤 다시 시도해 주세요'
      }
      onSubmit={handleSubmit}
    />
  );
}
