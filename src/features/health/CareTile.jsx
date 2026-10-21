import { Link } from 'react-router-dom';
import Badge from '@/components/Badge';
import Icon from '@/components/Icon';
import { PATHS } from '@/routes/paths';
import { formatMonthDayDot } from '@/utils/formatDate';
import { getCycleName, getDueBadge } from './careDue';

const BADGE_TONES = { today: 'brand', upcoming: 'gray', late: 'amber' };

// 출처 검진상세에서 투약은 처방약 탭, 반복 예방은 반복 예방 탭을 연다(FN-HLT-005-15)
const getSourcePath = (item) =>
  `${PATHS.HEALTH}/checkups/${item.ckupRcdSn}?tab=${
    item.lnkgTypeCd === 'PRSC' ? 'prescription' : 'prevention'
  }`;

// 케어 항목 한 줄(FN-HLT-003-12·13). 본문 클릭 = 완료 체크, ★ = 메인 표시. 완료는 배경, 메인은 ★로 따로 보여 준다
export default function CareTile({
  item,
  onCheck,
  onToggleMain,
  onCancelLastDose,
}) {
  const isDose = item.dayGoalCnt != null;
  const isRegular = item.rptTypeCd === 'REGULAR';
  const badge = isRegular ? getDueBadge(item.nextSchdYmd) : null;
  const hasActions = isDose || (item.lnkgTypeCd && item.ckupRcdSn);

  return (
    <div
      className={`grid break-inside-avoid grid-cols-[minmax(0,1fr)_auto] items-center border-b [grid-template-areas:'b_s'_'a_a'] ${
        item.todayDoneYn ? 'border-[#cde0e0] bg-[#e9f2f2]' : 'border-[#edf1f1]'
      }`}
    >
      <button
        type="button"
        aria-pressed={item.todayDoneYn}
        className={`flex w-full items-center gap-3 px-2 py-3 text-left [grid-area:b] ${
          isRegular
            ? 'max-sm:grid max-sm:grid-cols-[auto_auto_minmax(0,1fr)] max-sm:gap-y-1 sm:grid sm:grid-cols-[minmax(0,1fr)_80px_80px_48px] sm:gap-x-2'
            : ''
        }`}
        onClick={() => onCheck(item)}
      >
        <span
          className={`flex min-w-0 items-center gap-3 ${isRegular ? 'max-sm:col-span-full' : 'flex-1'}`}
        >
          <span
            aria-hidden="true"
            className={`grid size-8 flex-none place-items-center ${
              item.todayDoneYn ? 'text-[#1e4a4c]' : 'text-[#566465]'
            }`}
          >
            <Icon name={item.careIconCn} />
          </span>
          <span
            className={`min-w-0 flex-1 ${item.todayDoneYn ? 'text-[#1e4a4c]' : 'text-[#1a3234]'}`}
          >
            {item.careItemNm}
          </span>
          {isDose && (
            <span className="text-sm text-[#3d4a4b] tabular-nums">
              {item.todayChckCnt}/{item.dayGoalCnt}회
            </span>
          )}
        </span>
        {isRegular && (
          <>
            <span className="flex items-center text-sm text-[#566465]">
              {getCycleName(item)} 주기
            </span>
            <span className="contents">
              <span className="flex items-center text-sm text-[#566465] tabular-nums">
                {formatMonthDayDot(item.nextSchdYmd)} 예정
              </span>
              {badge && (
                <Badge
                  tone={
                    item.todayDoneYn && badge.tone === 'today'
                      ? 'white'
                      : BADGE_TONES[badge.tone]
                  }
                  className="justify-self-end tabular-nums"
                >
                  {badge.label}
                </Badge>
              )}
            </span>
          </>
        )}
      </button>

      <button
        type="button"
        aria-label={`${item.careItemNm} 메인 표시`}
        aria-pressed={item.mainExpsrYn}
        className="mr-2 grid size-8 place-items-center rounded-full [grid-area:s] hover:bg-[#ebf0f0]"
        onClick={() => onToggleMain(item)}
      >
        <Icon
          name="star"
          filled={item.mainExpsrYn}
          className={item.mainExpsrYn ? 'text-[#1a3234]' : 'text-[#b9c4c4]'}
        />
      </button>

      {hasActions && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pr-2 pb-3 pl-[52px] [grid-area:a]">
          {item.lnkgTypeCd && (
            <span className="inline-flex items-center gap-2 text-sm text-[#667374] tabular-nums">
              <Badge tone={item.todayDoneYn ? 'white' : 'brand'}>
                처방약 연동
              </Badge>
              {item.dosEndYmd && `~${formatMonthDayDot(item.dosEndYmd)}`}
            </span>
          )}
          {isDose && (
            <button
              type="button"
              disabled={item.todayChckCnt === 0}
              className="text-sm text-[#1e4a4c] hover:underline hover:underline-offset-[3px] disabled:opacity-40 disabled:hover:no-underline"
              onClick={() => onCancelLastDose(item)}
            >
              마지막 1회 취소
            </button>
          )}
          {item.lnkgTypeCd && item.ckupRcdSn && (
            <Link
              to={getSourcePath(item)}
              className="text-sm text-[#1e4a4c] hover:underline hover:underline-offset-[3px]"
            >
              출처 보기
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
