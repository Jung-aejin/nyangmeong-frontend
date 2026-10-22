import PostBadges from './PostBadges';
import { BBS_DAILY, BBS_INFO } from './postCodes';

const ITEM_CLASS =
  'flex flex-col gap-1 border-t border-[#e2e7e7] py-3.5 first:border-t-0 first:pt-1.5';
const TITLE_CLASS =
  'flex flex-wrap items-center gap-x-1 text-base font-semibold text-[#1a3234]';
const DESC_CLASS = 'text-sm leading-[1.6] text-[#566465]';

/** 글쓰기·글수정 오른쪽 「이렇게 써 주세요」: 박스 없이 구분선으로 나뉜 안내(디자인 .wr-rail) */
export default function PostWriteGuide() {
  return (
    <aside aria-label="글쓰기 안내" className="min-w-0 max-[1100px]:mt-6">
      <section aria-labelledby="post-guide-title">
        <h2
          id="post-guide-title"
          className="pb-2 text-lg leading-[1.4] font-bold text-[#1a3234]"
        >
          이렇게 써 주세요
        </h2>
        <ul>
          <li className={ITEM_CLASS}>
            <b className={TITLE_CLASS}>
              <PostBadges post={{ bbsCd: BBS_INFO }} />
              정보 · 꿀팁
            </b>
            <p className={DESC_CLASS}>
              건강 관리, 용품 후기, 산책 · 미용 팁처럼 다른 보호자에게 도움이
              되는 이야기
            </p>
          </li>
          <li className={ITEM_CLASS}>
            <b className={TITLE_CLASS}>
              <PostBadges post={{ bbsCd: BBS_DAILY }} />
              일상 · 사진
            </b>
            <p className={DESC_CLASS}>
              우리 아이 귀여운 순간, 여행 · 나들이 기록처럼 함께 나누고 싶은
              이야기
            </p>
          </li>
          <li className={ITEM_CLASS}>
            <b className={TITLE_CLASS}>사진은 밝고 선명하게</b>
            <p className={DESC_CLASS}>
              얼굴이 잘 보이는 사진을 첫 번째로 올리면 목록에서 더 눈에 띄어요
            </p>
          </li>
        </ul>
      </section>
    </aside>
  );
}
