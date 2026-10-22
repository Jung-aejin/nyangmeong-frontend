import { generatePath, Link } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { usePopularNews } from './queries';

/** 오른쪽 레일의 「많이 본 뉴스」: 목록·상세가 같이 쓴다 */
export default function PopularNews() {
  const { data: popular } = usePopularNews();

  return (
    <section aria-labelledby="news-popular-title">
      <h2
        id="news-popular-title"
        className="pb-3 text-lg leading-[1.4] font-bold text-[#1a3234]"
      >
        많이 본 뉴스
      </h2>
      <ol>
        {popular?.map((item, index) => (
          <li
            key={item.newsSn}
            className="border-t border-[#e2e7e7] py-3 first:border-t-0 first:pt-0.5"
          >
            <Link
              to={generatePath(PATHS.COMMUNITY_NEWS_DETAIL, {
                newsSn: item.newsSn,
              })}
              className="group grid grid-cols-[24px_minmax(0,1fr)] items-baseline gap-x-2.5"
            >
              <span className="text-lg leading-[1.2] font-bold text-[#22744a]">
                {index + 1}
              </span>
              <span className="line-clamp-2 leading-[1.4] font-medium text-[#1a3234] group-hover:text-[#285a5c]">
                {item.newsTtl}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
