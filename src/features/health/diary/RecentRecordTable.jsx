import { useState } from 'react';
import Card from '@/components/Card';
import Icon from '@/components/Icon';
import Modal from '@/components/Modal';
import {
  BTN_DANGER,
  BTN_PRIMARY,
  BTN_SECONDARY,
} from '@/components/buttonStyles';
import { formatDate } from '@/utils/formatDate';
import {
  MEAL,
  RECORD_TYPES,
  STOOL,
  STOOL_STATES,
  WALK,
  WATER,
  WEIGHT,
  findRecordType,
} from '../diaryTypes';
import { useDeleteDailyRecord, useUpdateDailyRecord } from '../queries';
import EmptyBox from './EmptyBox';
import { INPUT_CLASS, SELECT_ARROW_STYLE, SELECT_CLASS } from './formStyles';
import {
  formatAmount,
  formatRecordValue,
  getRecordedYmds,
  summarizeType,
} from './recordUtils';

const PERIOD_OPTIONS = [7, 14];

const TABLE_COLUMNS = ['날짜', ...RECORD_TYPES.map((type) => type.nm)];

/** 펼친 상세의 종류 순서: 시안은 표 머리와 달리 산책이 배변상태 앞 */
const DETAIL_ORDER = [WEIGHT, MEAL, WATER, WALK, STOOL];

/** 표 칸의 하루 값: 체중·배변상태는 최신 값, 나머지는 합계와 횟수 */
const formatDayCell = (summary, typeCd) => {
  if (summary.count === 0) return '-';
  if (typeCd === WEIGHT || typeCd === STOOL)
    return formatRecordValue(summary.latest);
  return `${formatAmount(typeCd, summary.sum)} (${summary.count}회)`;
};

/**
 * [최근 건강기록 날짜별 표]
 * - 하루치를 종류별 합계(횟수)로 한 줄, [∨]로 그날 상세를 펼침 (FN-HLT-002-13)
 * - 상세의 기록 줄을 누르면 그 줄만 인라인 편집, 삭제는 확인 후 처리
 */
export default function RecentRecordTable({ records, todayYmd }) {
  const [periodDays, setPeriodDays] = useState(PERIOD_OPTIONS[0]);
  const [expandedYmds, setExpandedYmds] = useState(() => new Set([todayYmd]));
  const [editingSn, setEditingSn] = useState(null);
  const [deleteSn, setDeleteSn] = useState(null);
  const deleteRecord = useDeleteDailyRecord();

  const ymds = getRecordedYmds(records, todayYmd, periodDays);

  const toggle = (ymd) =>
    setExpandedYmds((prev) => {
      const next = new Set(prev);
      if (next.has(ymd)) next.delete(ymd);
      else next.add(ymd);
      return next;
    });

  const handleDelete = () =>
    deleteRecord.mutate(deleteSn, {
      onSuccess: () => {
        setDeleteSn(null);
        setEditingSn(null);
      },
    });

  return (
    <Card
      title="최근 건강기록"
      className="min-w-0"
      action={
        <select
          aria-label="조회기간"
          value={periodDays}
          className={`${SELECT_CLASS} w-32!`}
          style={SELECT_ARROW_STYLE}
          onChange={(event) => setPeriodDays(Number(event.target.value))}
        >
          {PERIOD_OPTIONS.map((days) => (
            <option key={days} value={days}>
              최근 {days}일
            </option>
          ))}
        </select>
      }
    >
      {ymds.length === 0 ? (
        <EmptyBox
          icon="edit_note"
          title={`최근 ${periodDays}일 동안 기록이 없어요`}
          description="위의 [오늘 기록추가]로 첫 기록을 남겨 보세요"
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm/[1.6]">
            <thead>
              <tr>
                {TABLE_COLUMNS.map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="h-10 border-b border-line-strong bg-surface-3 px-3 font-normal text-ink-2"
                  >
                    {column}
                  </th>
                ))}
                <th
                  scope="col"
                  aria-label="펼치기"
                  className="h-10 w-12 border-b border-line-strong bg-surface-3"
                />
              </tr>
            </thead>
            <tbody>
              {ymds.map((ymd) => (
                <DayRows
                  key={ymd}
                  ymd={ymd}
                  isToday={ymd === todayYmd}
                  isExpanded={expandedYmds.has(ymd)}
                  dayRecords={records.filter((record) => record.rcdYmd === ymd)}
                  editingSn={editingSn}
                  onToggle={() => toggle(ymd)}
                  onEdit={setEditingSn}
                  onRequestDelete={setDeleteSn}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteSn !== null && (
        <Modal
          isConfirm
          title="이 기록을 삭제할까요?"
          isPending={deleteRecord.isPending}
          onClose={() => setDeleteSn(null)}
          footer={
            <>
              <button
                type="button"
                className={BTN_SECONDARY}
                disabled={deleteRecord.isPending}
                onClick={() => setDeleteSn(null)}
              >
                취소
              </button>
              <button
                type="button"
                className={BTN_DANGER}
                disabled={deleteRecord.isPending}
                onClick={handleDelete}
              >
                삭제하기
              </button>
            </>
          }
        />
      )}
    </Card>
  );
}

function DayRows({
  ymd,
  isToday,
  isExpanded,
  dayRecords,
  editingSn,
  onToggle,
  onEdit,
  onRequestDelete,
}) {
  const dateText = formatDate(ymd, { hasYear: false, weekday: true });
  const cellClass = `h-12 px-3 tabular-nums ${isToday ? 'bg-brand-50 text-brand-600' : 'text-ink'}`;
  const detailId = `hlt002-detail-${ymd}`;

  return (
    <>
      <tr
        className={`cursor-pointer ${isToday ? '' : 'hover:[&>td]:bg-[#fbfcfc]'}`}
        onClick={onToggle}
      >
        <td className={cellClass}>{isToday ? `오늘 ${dateText}` : dateText}</td>
        {RECORD_TYPES.map((type) => (
          <td key={type.cd} className={cellClass}>
            {formatDayCell(summarizeType(dayRecords, type.cd), type.cd)}
          </td>
        ))}
        <td className={`${cellClass} text-center`}>
          <button
            type="button"
            aria-expanded={isExpanded}
            aria-controls={detailId}
            aria-label={`${dateText} 상세 ${isExpanded ? '접기' : '펼치기'}`}
            className="grid size-9 place-items-center rounded-md text-subtle hover:bg-surface-3"
          >
            <Icon name={isExpanded ? 'expand_less' : 'expand_more'} />
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr id={detailId}>
          <td colSpan={TABLE_COLUMNS.length + 1} className="bg-surface-2 p-4">
            <p className="mb-3 text-subtle tabular-nums">
              {isToday ? `오늘 ${dateText}` : dateText} · 상세 기록
            </p>
            <div className="grid grid-cols-2 gap-3 rounded-[10px] border border-line-strong bg-white p-4 min-[761px]:grid-cols-3 min-[1101px]:grid-cols-5">
              {DETAIL_ORDER.map((typeCd) => (
                <DayTypeColumn
                  key={typeCd}
                  typeCd={typeCd}
                  summary={summarizeType(dayRecords, typeCd)}
                  editingSn={editingSn}
                  onEdit={onEdit}
                  onRequestDelete={onRequestDelete}
                />
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function DayTypeColumn({
  typeCd,
  summary,
  editingSn,
  onEdit,
  onRequestDelete,
}) {
  const type = findRecordType(typeCd);
  const { items, count, sum } = summary;

  const totalText =
    typeCd === WEIGHT || typeCd === STOOL
      ? `총 ${count}회`
      : `총 ${formatAmount(typeCd, sum)} · ${count}회`;

  return (
    <div className="min-w-0">
      <p className="mb-2 border-b border-line-strong pb-2 text-center text-base/[1.6] text-ink">
        {type.nm}
      </p>
      {count === 0 ? (
        <p className="text-center text-line-strong">-</p>
      ) : (
        <>
          {items.map((record) =>
            record.dlyRcdSn === editingSn ? (
              <RecordEditor
                key={record.dlyRcdSn}
                record={record}
                onClose={() => onEdit(null)}
                onRequestDelete={() => onRequestDelete(record.dlyRcdSn)}
              />
            ) : (
              <button
                key={record.dlyRcdSn}
                type="button"
                className="group flex w-full items-center justify-between gap-2 border-b border-line py-1 text-left tabular-nums hover:border-line-strong"
                onClick={() => onEdit(record.dlyRcdSn)}
              >
                <span className="text-muted">{record.rcdTm}</span>
                <b className="font-normal text-ink group-hover:text-brand-600">
                  {formatRecordValue(record)}
                </b>
              </button>
            ),
          )}
          <p className="mt-1 text-right text-subtle tabular-nums">
            {totalText}
          </p>
        </>
      )}
    </div>
  );
}

function RecordEditor({ record, onClose, onRequestDelete }) {
  const type = findRecordType(record.rcdTypeCd);
  const isStool = record.rcdTypeCd === STOOL;
  const [rcdTm, setRcdTm] = useState(record.rcdTm);
  const [value, setValue] = useState(
    isStool ? record.stlSttsCd : String(record.rcdVal),
  );
  const updateRecord = useUpdateDailyRecord();

  const canSave =
    rcdTm !== '' && (isStool || (value !== '' && Number(value) > 0));

  const handleSave = () => {
    if (!canSave) return;
    updateRecord.mutate(
      {
        dlyRcdSn: record.dlyRcdSn,
        rcdTm,
        rcdVal: isStool ? null : value,
        stlSttsCd: isStool ? value : null,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="mb-1 flex flex-col gap-3 rounded-[8px] border border-brand-500 bg-white p-3 shadow-[0_0_0_3px_rgba(40,90,92,0.12)]">
      <label className="flex flex-col gap-1 text-sm/[1.6] font-medium text-muted">
        시각
        <input
          type="time"
          value={rcdTm}
          autoFocus
          className={`${INPUT_CLASS} tabular-nums`}
          onChange={(event) => setRcdTm(event.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm/[1.6] font-medium text-muted">
        {type.nm}
        {isStool ? (
          <select
            value={value}
            className={SELECT_CLASS}
            style={SELECT_ARROW_STYLE}
            onChange={(event) => setValue(event.target.value)}
          >
            {STOOL_STATES.map((state) => (
              <option key={state.cd} value={state.cd}>
                {state.nm}
              </option>
            ))}
          </select>
        ) : (
          <span className="relative block">
            <input
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              value={value}
              className={`${INPUT_CLASS} pr-11 text-right tabular-nums`}
              onChange={(event) => setValue(event.target.value)}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted">
              {type.unit}
            </span>
          </span>
        )}
      </label>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          className="min-h-9 text-sm/[1.6] font-semibold text-danger hover:underline"
          onClick={onRequestDelete}
        >
          삭제
        </button>
        <span className="flex gap-1">
          <button
            type="button"
            className={`${BTN_SECONDARY} h-8! px-3! text-base/[1.6]`}
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="button"
            disabled={!canSave || updateRecord.isPending}
            className={`${BTN_PRIMARY} h-8! px-3! text-base/[1.6]`}
            onClick={handleSave}
          >
            저장
          </button>
        </span>
      </div>
    </div>
  );
}
