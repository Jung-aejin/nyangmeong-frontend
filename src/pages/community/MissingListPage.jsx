import { useSearchParams } from 'react-router-dom';
import {
  PET_SE_BY_FILTER,
  STTS_BY_TAB,
  STATUS_TABS,
  PET_FILTERS,
  PERIOD_FILTERS,
  REGION_OPTIONS,
  hasDong,
  DONG_BY_REGION,
} from '@/features/community/missingCodes';
import { useMissingList } from '@/features/community/missingQueries';
import MissingList from '@/features/community/missing/MissingList';
import MissingRail from '@/features/community/missing/MissingRail';
import SubPageLayout from '@/layouts/SubPageLayout';
import { PATHS } from '@/routes/paths';

const PAGE_SIZE = 12;
const DESCRIPTION =
  '잃어버린 반려동물을 함께 찾아요. 비슷한 아이를 보셨다면 댓글로 알려 주세요';

/** URL 값이 허용 목록에 없으면 기본값('')으로 */
const pick = (value, options) =>
  options.some((option) => option.value === value) ? value : '';

export default function MissingListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const stts = pick(searchParams.get('stts'), STATUS_TABS);
  const region = pick(searchParams.get('rgn'), REGION_OPTIONS);
  const dongParam = searchParams.get('dong') ?? '';
  const dong =
    hasDong(region) && DONG_BY_REGION[region].includes(dongParam)
      ? dongParam
      : '';
  const pet = pick(searchParams.get('pet'), PET_FILTERS);
  const period = pick(searchParams.get('period'), PERIOD_FILTERS);
  const keyword = searchParams.get('q') ?? '';
  const filters = { stts, region, dong, pet, period, keyword };

  const {
    data: posts,
    isPending,
    isError,
  } = useMissingList({
    page,
    size: PAGE_SIZE,
    lostTpofSttsCd: STTS_BY_TAB[stts] ?? '',
    sggNm: region,
    emdNm: dong,
    petSeCd: PET_SE_BY_FILTER[pet] ?? '',
    period,
    keyword,
  });

  /** 빈 값은 URL에 남기지 않는다. 조건이 바뀌면 첫 쪽부터 */
  const setQuery = (next) => {
    const merged = { ...filters, ...next };
    setSearchParams(
      Object.fromEntries(
        Object.entries({
          stts: merged.stts,
          rgn: merged.region,
          dong: merged.dong,
          pet: merged.pet,
          period: merged.period,
          q: merged.keyword,
          page: merged.page > 1 ? merged.page : '',
        }).filter(([, value]) => value),
      ),
    );
  };

  let body;
  if (isPending) {
    body = <p className="text-muted">불러오는 중이에요</p>;
  } else if (isError) {
    body = (
      <p role="alert" className="text-muted">
        게시글을 불러오지 못했어요. 잠시 뒤 다시 시도해 주세요
      </p>
    );
  } else {
    body = (
      <MissingList
        key={keyword}
        posts={posts}
        filters={filters}
        onChange={(next) => setQuery({ ...next, page: 1 })}
        onReset={() => setSearchParams({})}
        onPageChange={(nextPage) => setQuery({ page: nextPage })}
      />
    );
  }

  return (
    <SubPageLayout
      section="community"
      menu={PATHS.COMMUNITY_MISSING}
      description={DESCRIPTION}
      contentClassName="min-[1101px]:pt-[7px]"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_280px] items-start gap-8 max-[1100px]:grid-cols-1 max-[1100px]:gap-10">
        <div className="min-w-0">{body}</div>
        <MissingRail />
      </div>
    </SubPageLayout>
  );
}
