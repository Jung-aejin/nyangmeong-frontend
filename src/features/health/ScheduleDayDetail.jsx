import Badge from '@/components/Badge';
import Card from '@/components/Card';
import Icon from '@/components/Icon';
import {
  formatMonthDayWeekday,
  formatTime,
  getTodayYmd,
} from '@/utils/formatDate';
import {
  compareSchedules,
  getScheduleTone,
  getScheduleKindName,
  isHospital,
} from './scheduleTypes';

// 날짜 인라인 상세 카드(FN-HLT-003-31). petLabel은 제목 옆에 붙는 "전체 반려동물" 또는 고른 반려동물 이름이다
export default function ScheduleDayDetail({
  ymd,
  schedules,
  petLabel,
  onSelectSchedule,
  onCreate,
}) {
  const todayYmd = getTodayYmd();
  const isPast = ymd < todayYmd;
  const sorted = schedules
    .filter((schedule) => schedule.schdlYmd === ymd)
    .sort(compareSchedules);

  return (
    <Card
      as="h3"
      title={formatMonthDayWeekday(ymd)}
      sub={`${sorted.length}건 · ${petLabel}`}
    >
      {sorted.length === 0 ? (
        <div className="rounded-[10px] border border-dashed border-[#b9c4c4]">
          <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
            <span className="grid size-10 place-items-center rounded-full bg-[#f4f6f6] text-[#667374]">
              <Icon name="calendar_month" />
            </span>
            <p className="text-sm text-[#566465]">등록된 기록이 없습니다</p>
            <button
              type="button"
              className="h-8 rounded-[6px] border border-[#e2e7e7] bg-white px-3 text-sm font-semibold text-[#1a3234] hover:bg-[#f4f6f6]"
              onClick={onCreate}
            >
              새 일정 등록
            </button>
          </div>
        </div>
      ) : (
        <>
          <ul>
            {sorted.map((schedule) => (
              <li key={schedule.schdlSn}>
                <button
                  type="button"
                  className="group flex w-full items-start gap-3 border-b border-[#edf1f1] py-3 text-left"
                  onClick={() => onSelectSchedule(schedule)}
                >
                  <span
                    aria-hidden="true"
                    className="w-1 shrink-0 self-stretch rounded-full"
                    style={{
                      backgroundColor: getScheduleTone(schedule).fg,
                    }}
                  />
                  {schedule.schdlTm && (
                    <span className="shrink-0 whitespace-nowrap text-[#667374]">
                      {formatTime(schedule.schdlTm)}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span
                      className={`group-hover:text-[#1e4a4c] ${
                        isPast ? 'text-[#667374]' : 'text-[#1a3234]'
                      }`}
                    >
                      {schedule.petNm} · {getScheduleKindName(schedule)} ·{' '}
                      {isHospital(schedule)
                        ? schedule.hospNm
                        : schedule.schdlNm}
                    </span>
                    {isPast && isHospital(schedule) && (
                      <>
                        {' '}
                        <Badge
                          tone={schedule.ckupRcdCnt > 0 ? 'ok' : 'outline'}
                        >
                          {schedule.ckupRcdCnt > 0
                            ? '검진기록 있음'
                            : '검진기록 없음'}
                        </Badge>
                      </>
                    )}
                    {schedule.schdlMemoCn && (
                      <span className="block text-sm text-[#667374]">
                        {schedule.schdlMemoCn}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-3 text-sm font-semibold text-[#1e4a4c] hover:underline hover:underline-offset-[3px]"
            onClick={onCreate}
          >
            새 일정 등록
          </button>
        </>
      )}
    </Card>
  );
}
