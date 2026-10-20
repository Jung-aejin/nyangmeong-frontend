import { EXPND_CLSF } from './expenseCodes';

export default function ExpenseCategoryBadge({ code }) {
  const clsf = EXPND_CLSF[code];
  return (
    <span
      className={`inline-flex h-6 min-w-12 shrink-0 items-center justify-center rounded-full px-2.5 text-badge font-semibold ${clsf.badge}`}
    >
      {clsf.name}
    </span>
  );
}
