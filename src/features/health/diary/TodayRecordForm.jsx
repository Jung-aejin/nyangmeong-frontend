import { useEffect, useRef, useState } from 'react';
import { BTN_PRIMARY } from '@/components/buttonStyles';
import { getNowHm, getTodayYmd } from '@/utils/formatDate';
import {
  NORMAL_STOOL,
  RECORD_TYPES,
  STOOL,
  STOOL_STATES,
  findRecordType,
} from '../diaryTypes';
import { useCreateDailyRecord } from '../queries';
import {
  INPUT_CLASS,
  LABEL_CLASS,
  SELECT_ARROW_STYLE,
  SELECT_CLASS,
} from './formStyles';

/**
 * [오늘 기록하기]
 * - 기록 종류를 고르고 시간·값을 입력해 오늘 기록으로 등록 (FN-HLT-002-11)
 * - 열릴 때 이 영역으로 스크롤하고 첫 입력칸에 포커스
 */
export default function TodayRecordForm({ petSn, initialTypeCd }) {
  const formRef = useRef(null);
  const timeRef = useRef(null);
  const valueRef = useRef(null);
  const [typeCd, setTypeCd] = useState(initialTypeCd);
  const [rcdTm, setRcdTm] = useState(getNowHm);
  const [value, setValue] = useState('');
  const [stlSttsCd, setStlSttsCd] = useState(NORMAL_STOOL);
  const createRecord = useCreateDailyRecord();

  useEffect(() => {
    formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    timeRef.current.focus({ preventScroll: true });
  }, []);

  const type = findRecordType(typeCd);
  const isStool = typeCd === STOOL;
  const canSubmit =
    rcdTm !== '' && (isStool || (value !== '' && Number(value) > 0));

  const handleTypeChange = (nextTypeCd) => {
    setTypeCd(nextTypeCd);
    setValue('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit || createRecord.isPending) return;
    createRecord.mutate(
      {
        petSn,
        rcdTypeCd: typeCd,
        rcdYmd: getTodayYmd(),
        rcdTm,
        rcdVal: value,
        stlSttsCd,
      },
      {
        onSuccess: () => {
          setValue('');
          valueRef.current?.focus();
        },
      },
    );
  };

  return (
    <form
      ref={formRef}
      id="hlt002-record-form"
      className="rounded-[14px] border border-line bg-white px-6 py-5 shadow-[0_1px_2px_rgba(26,50,52,0.04)]"
      onSubmit={handleSubmit}
    >
      <h3 className="text-lg/[1.6] font-semibold text-ink">오늘 기록하기</h3>
      <p className="mt-1 text-subtle">
        기록 종류를 선택하고 내용을 입력해주세요
      </p>

      <div
        role="radiogroup"
        aria-label="기록 종류"
        className="mt-3 mb-4 flex h-10 max-w-lg rounded-[6px] border border-[#e6eaeb] bg-[#f1f3f4] p-[3px]"
      >
        {RECORD_TYPES.map((item) => {
          const isSelected = item.cd === typeCd;
          return (
            <button
              key={item.cd}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`flex flex-1 items-center justify-center rounded-[4px] whitespace-nowrap ${
                isSelected
                  ? 'bg-white font-semibold text-brand-600 shadow-[0_1px_2px_rgba(26,50,52,0.08),0_0_0_1px_rgba(40,90,92,0.18)]'
                  : 'font-medium text-muted hover:text-ink'
              }`}
              onClick={() => handleTypeChange(item.cd)}
            >
              {item.nm}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <label className="flex w-52 flex-col gap-1.5">
          <span className={LABEL_CLASS}>시간</span>
          <input
            ref={timeRef}
            type="time"
            value={rcdTm}
            className={`${INPUT_CLASS} tabular-nums`}
            onChange={(event) => setRcdTm(event.target.value)}
          />
        </label>
        {isStool ? (
          <label className="flex w-52 flex-col gap-1.5">
            <span className={LABEL_CLASS}>{type.valueLabel}</span>
            <select
              value={stlSttsCd}
              className={SELECT_CLASS}
              style={SELECT_ARROW_STYLE}
              onChange={(event) => setStlSttsCd(event.target.value)}
            >
              {STOOL_STATES.map((state) => (
                <option key={state.cd} value={state.cd}>
                  {state.nm}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label className="flex w-52 flex-col gap-1.5">
            <span className={LABEL_CLASS}>{type.valueLabel}</span>
            <span className="relative block">
              <input
                ref={valueRef}
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                value={value}
                className={`${INPUT_CLASS} pr-12 text-right tabular-nums`}
                onChange={(event) => setValue(event.target.value)}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted">
                {type.unit}
              </span>
            </span>
          </label>
        )}
        <button
          type="submit"
          disabled={!canSubmit || createRecord.isPending}
          className={`${BTN_PRIMARY} ml-auto min-w-24`}
        >
          등록하기
        </button>
      </div>
    </form>
  );
}
