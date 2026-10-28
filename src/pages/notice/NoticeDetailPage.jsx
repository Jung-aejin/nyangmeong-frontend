import { useParams } from 'react-router-dom';
import PageSkeleton from '@/components/PageSkeleton';
import SkeletonCard from '@/components/SkeletonCard';
import NoticeDetail from '@/features/notice/NoticeDetail';
import { useNotice } from '@/features/notice/queries';

export default function NoticeDetailPage() {
  const ntcMttrSn = Number(useParams().ntcMttrSn);
  const { data: notice, isPending, isError } = useNotice(ntcMttrSn);

  if (isPending) {
    return (
      <PageSkeleton>
        <SkeletonCard className="h-[605px]" />
        <SkeletonCard className="h-[111px]" />
      </PageSkeleton>
    );
  }
  if (isError) {
    return (
      <p role="alert" className="text-[#566465]">
        공지를 불러오지 못했어요. 잠시 뒤 다시 시도해 주세요
      </p>
    );
  }

  return <NoticeDetail notice={notice} />;
}
