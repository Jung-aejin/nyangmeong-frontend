import { ChevronLeft, List, Megaphone } from 'lucide-react';
import { generatePath, Link } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { formatDate } from '@/utils/formatDate';
import { useNotices } from './queries';

const LATEST_SIZE = 5;

export default function NoticeDetail({ notice }) {
  const { data: latest } = useNotices({ page: 1, size: LATEST_SIZE });
  // 고정 공지는 첫 쪽에 따로 얹혀 오므로 최신 공지에서는 뺀다
  const latestNotices = latest?.content.filter((item) => !item.fixYn);

  return (
    <div>
      <Link
        to={PATHS.NOTICES}
        className="mb-2.5 inline-flex items-center gap-1 text-base leading-normal font-medium text-[#566465]"
      >
        <ChevronLeft size={16} />
        목록으로
      </Link>

      <article className="rounded-[14px] border border-[#e2e7e7] bg-white px-9 py-8">
        {notice.fixYn && (
          <span className="flex h-6 w-[42px] items-center justify-center rounded-xl bg-[#e9f2f2] text-[13px] leading-none font-medium text-[#1e4a4c]">
            공지
          </span>
        )}
        <h2 className="mt-3 text-2xl leading-[1.35] font-bold tracking-[-0.24px] text-[#1a3234]">
          {notice.ntcMttrTtl}
        </h2>
        <div className="mt-4 flex items-center gap-2 border-b border-[#e2e7e7] pb-6">
          <span className="flex size-8 items-center justify-center rounded-full bg-[#e9f2f2] text-[#285a5c]">
            <Megaphone size={18} />
          </span>
          <b className="text-base leading-normal font-medium text-[#1a3234]">
            관리자
          </b>
          <i className="text-sm text-[#b9c4c4] not-italic">·</i>
          <time className="text-sm text-[#667374]">
            {formatDate(notice.crtDt)}
          </time>
          <i className="text-sm text-[#b9c4c4] not-italic">·</i>
          <span className="text-sm text-[#667374]">조회 {notice.vwCnt}</span>
        </div>

        <div className="mt-6 text-base leading-[1.8] text-[#1a3234]">
          {notice.ntcMttrCn.split('\n\n').map((paragraph) => (
            <p key={paragraph} className="mb-5 whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>

        <section className="mt-10 border-t border-[#b9c4c4] pt-6">
          <h3 className="text-lg leading-[1.4] font-bold tracking-[-0.18px] text-[#1a3234]">
            최신 공지
          </h3>
          <ul className="mt-3">
            {latestNotices?.map((item) => (
              <li
                key={item.ntcMttrSn}
                className="h-[53px] border-b border-[#e2e7e7]"
              >
                <Link
                  to={generatePath(PATHS.NOTICE_DETAIL, {
                    ntcMttrSn: item.ntcMttrSn,
                  })}
                  className="flex h-full items-center justify-between gap-4"
                >
                  <span className="truncate text-base leading-[1.6] text-[#3d4a4b]">
                    {item.ntcMttrTtl}
                  </span>
                  <span className="shrink-0 text-sm text-[#667374]">
                    {formatDate(item.crtDt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-8 flex justify-start">
          <Link
            to={PATHS.NOTICES}
            className="inline-flex h-10 w-[120px] items-center justify-center gap-1.5 rounded-md border border-[#e2e7e7] bg-white text-sm font-medium text-[#1a3234]"
          >
            <List size={16} />
            목록
          </Link>
        </div>
      </article>
    </div>
  );
}
