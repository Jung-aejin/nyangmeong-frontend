import Icon from '@/components/Icon';
import { formatMonthDayDot, getTodayYmd } from '@/utils/formatDate';

// 기록 내용(FN-HLT-003-12). 토탈 케어리스트 카드 안에 놓는다. 아이콘을 누르면 그날 완료 기록이 취소되고, 마우스를 올리면 아이콘이 ✕로 바뀐다
export default function CareRecordList({ records, onCancel }) {
  const todayYmd = getTodayYmd();
  const dates = [...new Set(records.map((record) => record.careYmd))]
    .sort()
    .reverse();

  return (
    <div className="mt-8">
      <div className="mb-2 flex items-baseline gap-3">
        <h3 className="text-lg font-semibold text-[#1a3234]">기록 내용</h3>
        <span className="text-sm text-[#667374]">
          일상관리·정기관리 완료 기록 통합
        </span>
      </div>
      {dates.length === 0 ? (
        <div className="rounded-[10px] border border-dashed border-[#b9c4c4]">
          <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
            <span className="grid size-10 place-items-center rounded-full bg-[#f4f6f6] text-[#667374]">
              <Icon name="task_alt" />
            </span>
            <p className="text-sm font-semibold text-[#1a3234]">
              아직 완료한 케어가 없어요
            </p>
            <p className="text-sm text-[#566465]">
              위 케어 항목을 누르면 완료로 표시되고 여기에 날짜별로 쌓여요
            </p>
          </div>
        </div>
      ) : (
        <ul className="max-h-48 overflow-y-auto">
          {dates.map((ymd) => (
            <li
              key={ymd}
              className="flex items-start gap-3.5 border-b border-[#edf1f1] py-3.5 last:border-b-0"
            >
              <span className="w-[88px] flex-none text-[#3d4a4b] tabular-nums">
                {ymd === todayYmd
                  ? `오늘 · ${formatMonthDayDot(ymd)}`
                  : formatMonthDayDot(ymd)}
              </span>
              <span className="flex flex-wrap gap-x-3 gap-y-2">
                {records
                  .filter((record) => record.careYmd === ymd)
                  .map((record) => (
                    <button
                      key={record.careRcdSn}
                      type="button"
                      aria-label={`${formatMonthDayDot(ymd)} ${record.careItemNm} 완료 기록 취소`}
                      className="group inline-flex items-center gap-1 text-[#1a3234]"
                      onClick={() => onCancel(record)}
                    >
                      <span className="relative grid size-7 place-items-center rounded-full bg-[#ebf0f0] text-[#566465] group-hover:bg-[#fbeeec] group-hover:text-[#b4473a]">
                        <Icon
                          name={record.careIconCn}
                          className="text-[18px] group-hover:hidden"
                        />
                        <Icon
                          name="close"
                          className="hidden text-[18px] group-hover:inline-flex"
                        />
                        {record.rptTypeCd === 'REGULAR' && (
                          <span
                            aria-hidden="true"
                            className="absolute -top-1 -left-1 grid size-4 place-items-center rounded-full bg-[#5f49b0] text-[13px] leading-none font-semibold text-white"
                          >
                            R
                          </span>
                        )}
                      </span>
                      {record.careItemNm}
                    </button>
                  ))}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
