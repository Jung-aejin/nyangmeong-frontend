import { Check } from 'lucide-react';

const STEPS = ['약관 동의', '이메일', '휴대전화', '비밀번호'];

// 4단계 진행 표시. 모바일에서는 현재 단계 이름만 보인다
export default function SignupStepper({ current }) {
  return (
    <ol
      aria-label={`전체 4단계 중 ${current}단계`}
      className="mb-8 flex items-center max-md:mb-6"
    >
      {STEPS.map((label, index) => {
        const number = index + 1;
        const isCurrent = number === current;
        const isDone = number < current;
        return (
          <li
            key={label}
            aria-current={isCurrent ? 'step' : undefined}
            className={`flex items-center gap-2 leading-6 whitespace-nowrap after:mx-1.5 after:h-px after:min-w-2 after:flex-1 after:bg-line last:flex-none last:after:hidden ${
              number === STEPS.length ? '' : 'flex-1'
            } ${
              isCurrent
                ? 'font-semibold text-ink'
                : isDone
                  ? 'text-brand-600'
                  : 'text-subtle'
            }`}
          >
            <b
              className={`grid size-6 shrink-0 place-items-center rounded-full text-sm font-semibold ${
                isCurrent
                  ? 'bg-brand-500 text-white'
                  : isDone
                    ? 'bg-brand-50 text-brand-600'
                    : 'bg-surface-3 text-muted'
              }`}
            >
              {isDone ? <Check className="size-3.5" /> : number}
            </b>
            <span className={isCurrent ? '' : 'max-md:hidden'}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
