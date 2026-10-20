import { useParams } from 'react-router-dom';
import NoticeDetail from '@/features/notice/NoticeDetail';
import { useNotice } from '@/features/notice/queries';

export default function NoticeDetailPage() {
  const ntcMttrSn = Number(useParams().ntcMttrSn);
  const { data: notice, isPending, isError } = useNotice(ntcMttrSn);

  if (isPending) return <p className="text-[#566465]">불러오는 중이에요</p>;
  if (isError) {
    return (
      <p role="alert" className="text-[#566465]">
        공지를 불러오지 못했어요. 잠시 뒤 다시 시도해 주세요
      </p>
    );
  }

  return <NoticeDetail notice={notice} />;
}
