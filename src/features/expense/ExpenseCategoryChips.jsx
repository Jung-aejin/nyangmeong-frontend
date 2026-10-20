import { useId } from 'react';
import { EXPND_CLSF_LIST } from './expenseCodes';

// 카테고리 7종을 칩으로 원탭 선택한다
export default function ExpenseCategoryChips({ value, onChange }) {
  const name = useId();

  return (
    <div
      role="radiogroup"
      aria-label="카테고리"
      className="flex flex-wrap gap-2"
    >
      {EXPND_CLSF_LIST.map((clsf) => (
        <label key={clsf.code} className="cursor-pointer">
          <input
            type="radio"
            name={name}
            checked={value === clsf.code}
            onChange={() => onChange(clsf.code)}
            className="peer sr-only"
          />
          <span className="inline-flex h-9 items-center rounded-full border border-line bg-white px-3.5 text-sm font-medium peer-checked:border-brand-500 peer-checked:bg-brand-500 peer-checked:text-white peer-focus-visible:ring-focus hover:border-line-strong">
            {clsf.name}
          </span>
        </label>
      ))}
    </div>
  );
}
