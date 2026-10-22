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

const PERIOD_OPTIONS = [3, 7, 14];
const DEFAULT_PERIOD = 3;

const TABLE_COLUMNS = ['날짜', ...RECORD_TYPES.map((type) => type.nm)];

/** 상세 모달의 종류 순서: 시안은 표 머리와 달리 산책이 배변상태 앞 */
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
 * - 하루치를 종류별 합계(횟수)로 한 줄, 행을 누르면 그날 상세 기록 모달 (FN-HLT-002-13)
 * - 모달의 기록 줄을 누르면 그 줄만 인라인 편집, 삭제는 확인 후 처리
 */
export default function RecentRecordTable({ records, todayYmd }) {
  const [periodDays, setPeriodDays] = useState(DEFAULT_PERIOD);
  const [detailYmd, setDetailYmd] = useState(null);
  const [editingSn, setEditingSn] = useState(null);
  const [deleteSn, setDeleteSn] = useState(null);
  const deleteRecord = useDeleteDailyRecord();

  const ymds = getRecordedYmds(records, todayYmd, periodDays);

  const closeDetail = () => {
    setDetailYmd(null);
    setEditingSn(null);
  };

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
                  aria-label="상세"
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
                  dayRecords={records.filter((record) => record.rcdYmd === ymd)}
                  onOpen={() => setDetailYmd(ymd)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {detailYmd !== null && (
        <DetailModal
          ymd={detailYmd}
          isToday={detailYmd === todayYmd}
          dayRecords={records.filter((record) => record.rcdYmd === detailYmd)}
          editingSn={editingSn}
          onEdit={setEditingSn}
          onRequestDelete={setDeleteSn}
          onClose={closeDetail}
        />
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

function DayRows({ ymd, isToday, dayRecords, onOpen }) {
  const dateText = formatDate(ymd, { hasYear: false, weekday: true });
  const cellClass = `h-12 px-3 tabular-nums ${isToday ? 'bg-brand-50 text-brand-600' : 'text-ink'}`;

  return (
    <tr
      className={`cursor-pointer ${isToday ? '' : 'hover:[&>td]:bg-[#fbfcfc]'}`}
      onClick={onOpen}
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
          aria-haspopup="dialog"
          aria-label={`${dateText} 상세 기록 보기`}
          className="grid size-9 place-items-center rounded-md text-subtle hover:bg-surface-3"
        >
          <Icon name="chevron_right" />
        </button>
      </td>
    </tr>
  );
}

function DetailModal({
  ymd,
  isToday,
  dayRecords,
  editingSn,
  onEdit,
  onRequestDelete,
  onClose,
}) {
  const dateText = formatDate(ymd, { hasYear: false, weekday: true });
  const summaries = DETAIL_ORDER.map((typeCd) => ({
    typeCd,
    ...summarizeType(dayRecords, typeCd),
  }));
  /** 같은 순번의 기록이 같은 줄에 놓인다. 기록이 하나도 없으면 "-" 한 줄 */
  const rowCount = Math.max(1, ...summaries.map((summary) => summary.count));

  return (
    <Modal
      title={`${isToday ? '오늘 ' : ''}${dateText} 상세 기록`}
      isWide
      onClose={onClose}
      footer={
        <button type="button" className={BTN_SECONDARY} onClick={onClose}>
          닫기
        </button>
      }
    >
      <div className="max-h-[60vh] overflow-auto rounded-[10px] border border-line-strong">
        <table className="w-full min-w-[640px] table-fixed border-collapse text-sm/[1.6]">
          <thead>
            <tr>
              {summaries.map(({ typeCd }) => (
                <th
                  key={typeCd}
                  scope="col"
                  className="border-b border-line-strong bg-surface-3 px-3 py-2 text-center text-base/[1.6] font-normal text-ink-2 not-first:border-l not-first:border-l-line-strong"
                >
                  {findRecordType(typeCd).nm}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }, (_, rowIndex) => (
              <tr key={rowIndex} className="odd:bg-surface-2">
                {summaries.map(({ typeCd, items }) => {
                  const record = items[rowIndex];
                  return (
                    <td
                      key={typeCd}
                      className="border-b border-line px-3 py-1.5 align-middle tabular-nums not-first:border-l not-first:border-l-line-strong"
                    >
                      {record ? (
                        <RecordCell
                          record={record}
                          isEditing={record.dlyRcdSn === editingSn}
                          onEdit={onEdit}
                          onRequestDelete={onRequestDelete}
                        />
                      ) : (
                        rowIndex === 0 && (
                          <span className="block text-center text-line-strong">
                            -
                          </span>
                        )
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              {summaries.map(({ typeCd, count, sum }) => (
                <td
                  key={typeCd}
                  className="border-t border-line-strong px-3 py-2 text-right font-semibold text-subtle tabular-nums not-first:border-l not-first:border-l-line-strong"
                >
                  {typeCd === WEIGHT || typeCd === STOOL
                    ? `총 ${count}회`
                    : `총 ${formatAmount(typeCd, sum)} · ${count}회`}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </Modal>
  );
}

function RecordCell({ record, isEditing, onEdit, onRequestDelete }) {
  if (isEditing)
    return (
      <RecordEditor
        record={record}
        onClose={() => onEdit(null)}
        onRequestDelete={() => onRequestDelete(record.dlyRcdSn)}
      />
    );
  return (
    <button
      type="button"
      className="group flex w-full items-center justify-between gap-2 text-left tabular-nums"
      onClick={() => onEdit(record.dlyRcdSn)}
    >
      <span className="text-muted">{record.rcdTm}</span>
      <b className="font-normal text-ink group-hover:text-brand-600">
        {formatRecordValue(record)}
      </b>
    </button>
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
