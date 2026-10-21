import Card from '@/components/Card';
import Icon from '@/components/Icon';
import {
  getDay,
  getDaysInMonth,
  getTodayYmd,
  getWeekdayIndex,
  makeYmd,
} from '@/utils/formatDate';
import {
  compareSchedules,
  getScheduleTone,
  getScheduleKindName,
} from './scheduleTypes';

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];
const DAYS_PER_WEEK = 7;
// 날짜 칸은 80px(시안의 기본 칸)로 고정한다. 일정은 두 줄 태그 1건만 보여 주고 나머지는 날짜 옆 +n으로 줄인다
const MAX_DAY_TAGS = 1;

const navButtonClass =
  'grid size-9 place-items-center rounded-full text-[#566465] hover:bg-[#ebf0f0] hover:text-[#1a3234] disabled:opacity-40 disabled:hover:bg-transparent';

// 월간 캘린더 카드(FN-HLT-003-29·30). schedules는 이미 표시 반려동물 필터를 거친 그 달 일정이다
// children은 달력 위에 놓는 표시 반려동물 필터다
export default function MonthCalendar({
  year,
  month,
  schedules,
  selectedYmd,
  canMoveMonth,
  onMoveMonth,
  onSelectDate,
  children,
}) {
  const todayYmd = getTodayYmd();
  const daysInMonth = getDaysInMonth(year, month);
  const leadingBlanks = getWeekdayIndex(makeYmd(year, month, 1));
  const trailingBlanks =
    (DAYS_PER_WEEK - ((leadingBlanks + daysInMonth) % DAYS_PER_WEEK)) %
    DAYS_PER_WEEK;
  const days = Array.from({ length: daysInMonth }, (_, index) =>
    makeYmd(year, month, index + 1),
  );
  const sorted = [...schedules].sort(compareSchedules);

  const renderBlanks = (count, keyPrefix) =>
    Array.from({ length: count }, (_, index) => (
      <div
        key={`${keyPrefix}-${index}`}
        aria-hidden="true"
        className="border-r border-b border-[#e2e7e7] bg-[#f4f6f6]"
      />
    ));

  return (
    <Card
      title="통합 케어 캘린더"
      action={
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="이전 달"
            disabled={!canMoveMonth}
            className={navButtonClass}
            onClick={() => onMoveMonth(-1)}
          >
            <Icon name="chevron_left" />
          </button>
          <span className="min-w-28 text-center text-lg font-semibold text-[#1a3234]">
            {year}년 {month}월
          </span>
          <button
            type="button"
            aria-label="다음 달"
            disabled={!canMoveMonth}
            className={navButtonClass}
            onClick={() => onMoveMonth(1)}
          >
            <Icon name="chevron_right" />
          </button>
        </div>
      }
    >
      {children}
      <div
        role="grid"
        aria-label={`${year}년 ${month}월`}
        className="grid grid-cols-7 overflow-hidden rounded-[10px] border-t border-l border-[#e2e7e7]"
      >
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="min-w-0 border-r border-b border-[#e2e7e7] bg-[#f4f6f6] py-2 text-center text-sm font-semibold text-[#667374]"
          >
            {label}
          </div>
        ))}
        {renderBlanks(leadingBlanks, 'lead')}
        {days.map((ymd) => {
          const daySchedules = sorted.filter(
            (schedule) => schedule.schdlYmd === ymd,
          );
          const isSelected = ymd === selectedYmd;
          const isToday = ymd === todayYmd;
          const isPast = ymd < todayYmd;
          return (
            <button
              key={ymd}
              type="button"
              aria-pressed={isSelected}
              aria-label={`${month}월 ${getDay(ymd)}일, 일정 ${daySchedules.length}건`}
              className={`flex h-20 min-w-0 flex-col items-stretch gap-1 overflow-hidden border-r border-b border-[#e2e7e7] p-1 text-left sm:p-2 ${
                isSelected
                  ? 'bg-[#e9f2f2] shadow-[inset_0_0_0_2px_#285a5c]'
                  : 'bg-white hover:bg-[#f4f6f6]'
              }`}
              onClick={() => onSelectDate(ymd)}
            >
              <span className="flex items-start justify-between">
                <span
                  className={`text-sm ${
                    isToday
                      ? 'inline-grid h-6 min-w-6 place-items-center self-start rounded-full bg-[#285a5c] text-white'
                      : isSelected
                        ? 'font-bold text-[#1e4a4c]'
                        : 'text-[#667374]'
                  }`}
                >
                  {getDay(ymd)}
                </span>
                {daySchedules.length > MAX_DAY_TAGS && (
                  <span
                    aria-label={`일정 ${daySchedules.length - MAX_DAY_TAGS}건 더 있어요`}
                    className="pt-1"
                  >
                    <span className="text-[13px] leading-4 font-semibold text-[#667374]">
                      +{daySchedules.length - MAX_DAY_TAGS}
                    </span>
                  </span>
                )}
              </span>
              {daySchedules.slice(0, MAX_DAY_TAGS).map((schedule) => (
                <span
                  key={schedule.schdlSn}
                  title={`${schedule.petNm} · ${getScheduleKindName(schedule)}`}
                  className={`block truncate rounded-[4px] px-1 text-[13px] leading-tight font-semibold ${
                    isPast ? 'opacity-60' : ''
                  }`}
                  style={{
                    backgroundColor: getScheduleTone(schedule).bg,
                    color: getScheduleTone(schedule).fg,
                  }}
                >
                  <span className="block truncate">{schedule.petNm}</span>
                  <span className="block truncate">
                    {getScheduleKindName(schedule)}
                  </span>
                </span>
              ))}
            </button>
          );
        })}
        {renderBlanks(trailingBlanks, 'trail')}
      </div>
    </Card>
  );
}
