import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import Select from '@/components/Select';
import {
  ALL_REGION,
  DONG_BY_REGION,
  hasDong,
  PERIOD_FILTERS,
  PET_FILTERS,
  REGION_OPTIONS,
} from '../missingCodes';

function Chips({ label, name, options, value, onChange, canClear = false }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      <span className="w-[72px] shrink-0 text-sm font-semibold text-ink-2">
        {label}
      </span>
      <div
        role="radiogroup"
        aria-label={label}
        className="flex flex-wrap gap-1.5"
      >
        {options.map((option) => (
          <label key={option.value}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              onClick={() => {
                /** 이미 고른 칩을 다시 누르면 해제(전체) */
                if (canClear && option.value && value === option.value) {
                  onChange('');
                }
              }}
              className="peer sr-only"
            />
            <span className="inline-flex h-9 cursor-pointer items-center rounded-full border border-input-line bg-white px-3.5 text-sm font-medium text-ink-2 peer-checked:border-brand-500 peer-checked:bg-brand-50 peer-checked:font-semibold peer-checked:text-brand-600 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/30 hover:border-line-strong">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

const countActive = ({ region, pet, period }) =>
  Number(region !== ALL_REGION) + Number(pet !== '') + Number(period !== '');

/**
 * 빠른 필터: 지역(시·군·구 → 읍·면·동) · 반려동물 · 실종 기간. 바꾸면 바로 적용(AND)
 * - filters: { region, dong, pet, period }, onChange(바뀐 값만), onReset
 * - 760px 이하에서는 [상세 필터] 버튼으로 열고 닫는다
 */
export default function MissingFilters({ filters, onChange, onReset }) {
  const [isOpen, setIsOpen] = useState(false);
  const { region, dong, pet, period } = filters;
  const activeCount = countActive(filters);
  const dongOptions = [
    { value: '', label: '읍·면·동 전체' },
    ...(DONG_BY_REGION[region] ?? []).map((name) => ({
      value: name,
      label: name,
    })),
  ];

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="missing-filter"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex h-10 w-fit items-center gap-1.5 rounded-md border border-line bg-white px-4 font-semibold hover:border-line-strong hover:bg-surface-2 min-[761px]:hidden"
      >
        <SlidersHorizontal size={16} aria-hidden="true" />
        상세 필터
        {activeCount > 0 && (
          <span
            aria-label={`적용된 필터 ${activeCount}개`}
            className="min-w-5 rounded-full bg-brand-500 px-1.5 text-xs leading-5 text-white"
          >
            {activeCount}
          </span>
        )}
      </button>
      <form
        id="missing-filter"
        aria-label="상세 필터"
        onSubmit={(event) => event.preventDefault()}
        className={`flex-col gap-4 rounded-[14px] border border-line bg-white px-6 py-5 max-[760px]:px-4 min-[761px]:flex ${isOpen ? 'flex' : 'hidden'}`}
      >
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="w-[72px] shrink-0 text-sm font-semibold text-ink-2">
            실종 지역
          </span>
          <div className="flex min-w-0 flex-1 flex-wrap gap-2">
            <Select
              label="시·군·구"
              value={region}
              options={REGION_OPTIONS}
              onChange={(next) => onChange({ region: next, dong: '' })}
              className="w-[180px] max-[760px]:flex-1"
            />
            {/* 전북 전체·전주시 전체는 읍·면·동을 고를 수 없다: fieldset disabled로 select를 함께 잠근다 */}
            <fieldset
              disabled={!hasDong(region)}
              className="m-0 w-[180px] min-w-0 border-0 p-0 disabled:opacity-45 max-[760px]:flex-1"
            >
              <Select
                label="읍·면·동"
                value={dong}
                options={dongOptions}
                onChange={(next) => onChange({ dong: next })}
              />
            </fieldset>
          </div>
        </div>
        <Chips
          label="반려동물"
          name="pet"
          options={PET_FILTERS}
          value={pet}
          onChange={(next) => onChange({ pet: next })}
        />
        <Chips
          label="실종 기간"
          name="period"
          options={PERIOD_FILTERS}
          canClear
          value={period}
          onChange={(next) => onChange({ period: next })}
        />
        <div className="flex justify-end border-t border-line pt-3">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-semibold text-muted hover:bg-surface-2"
          >
            <RotateCcw size={14} aria-hidden="true" />
            필터 초기화
          </button>
        </div>
      </form>
    </div>
  );
}
