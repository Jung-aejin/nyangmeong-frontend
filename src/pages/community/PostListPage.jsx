import { useSearchParams } from 'react-router-dom';
import PostList from '@/features/community/PostList';
import { getBoardCode } from '@/features/community/postCodes';
import { usePostList } from '@/features/community/queries';
import StoryRail from '@/features/community/StoryRail';
import SubPageLayout from '@/layouts/SubPageLayout';
import { PATHS } from '@/routes/paths';

const PAGE_SIZE = 10;
const DESCRIPTION = '반려생활의 일상과 유용한 정보를 함께 나눠요';

export default function PostListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const keyword = searchParams.get('q') ?? '';
  const sort = searchParams.get('sort') === 'hot' ? 'hot' : 'new';
  /** URL에는 게시판 이름, 서버에는 코드로 보낸다. 모르는 이름은 전체 */
  const boardName = searchParams.get('board') ?? '';
  const bbsCd = getBoardCode(boardName) ?? '';
  const board = bbsCd ? boardName : '';
  const {
    data: posts,
    isPending,
    isError,
  } = usePostList({ page, size: PAGE_SIZE, bbsCd, sort, keyword });

  /** 기본값(최신순)과 빈 값은 URL에 남기지 않는다. 검색어는 ?q= */
  const setQuery = ({ keyword: nextKeyword, ...rest }) => {
    const next = { ...rest, q: nextKeyword };
    setSearchParams(
      Object.fromEntries(
        Object.entries(next).filter(([key, value]) =>
          key === 'sort' ? value === 'hot' : value,
        ),
      ),
    );
  };

  /** 탭·정렬·검색어가 바뀌면 첫 쪽부터 */
  const handleBoardChange = (nextBoard) =>
    setQuery({ board: nextBoard, sort, keyword });

  const handleSortChange = (nextSort) =>
    setQuery({ board, sort: nextSort, keyword });

  const handleSearch = (nextKeyword) =>
    setQuery({ board, sort, keyword: nextKeyword });

  const handlePageChange = (nextPage) =>
    setQuery({ board, sort, keyword, page: nextPage > 1 ? nextPage : '' });

  let body;
  if (isPending) {
    body = <p className="text-[#566465]">불러오는 중이에요</p>;
  } else if (isError) {
    body = (
      <p role="alert" className="text-[#566465]">
        게시글을 불러오지 못했어요. 잠시 뒤 다시 시도해 주세요
      </p>
    );
  } else {
    body = (
      <PostList
        key={keyword}
        posts={posts}
        board={board}
        sort={sort}
        keyword={keyword}
        onBoardChange={handleBoardChange}
        onSortChange={handleSortChange}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        onReset={() => setSearchParams({})}
      />
    );
  }

  return (
    <SubPageLayout
      section="community"
      menu={PATHS.COMMUNITY}
      description={DESCRIPTION}
      contentClassName="min-[1101px]:pt-0"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_300px] items-start gap-8 max-[1100px]:grid-cols-2 max-[1100px]:gap-x-5 max-[1100px]:gap-y-0 max-[760px]:grid-cols-1">
        <div className="min-w-0 max-[1100px]:col-span-full">{body}</div>
        <StoryRail />
      </div>
    </SubPageLayout>
  );
}
