import { Link, useParams } from 'react-router-dom';
import InquiryDetail from '@/features/inquiry/InquiryDetail';
import { useInquiry } from '@/features/inquiry/queries';
import { PATHS } from '@/routes/paths';

export default function InquiryDetailPage() {
  const otoInqrySn = Number(useParams().otoInqrySn);
  const { data: inquiry, isPending, isError } = useInquiry(otoInqrySn);

  if (isPending) return <p className="text-[#566465]">불러오는 중이에요</p>;
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

  return <InquiryDetail inquiry={inquiry} />;
}
