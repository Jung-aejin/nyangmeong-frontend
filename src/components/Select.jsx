import { ChevronDown } from 'lucide-react';

// options: [{ value, label }]. value는 문자열로 비교한다
export default function Select({
  value,
  onChange,
  options,
  label,
  className = '',
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="block h-10 w-full cursor-pointer appearance-none rounded-md border border-input-line bg-white pr-9 pl-3 hover:border-line-strong focus:border-brand-500 focus:ring-focus focus:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-subtle" />
    </div>
  );
}
