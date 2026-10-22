import { RefreshCw } from 'lucide-react';
import AiErrorGuide from '@/components/AiErrorGuide';

const ART =
  'flex h-[46px] flex-1 items-center justify-center gap-2.5 rounded-md border border-line bg-[repeating-linear-gradient(13deg,var(--color-surface-3)_0_2px,var(--color-surface-2)_3px_7px)] text-[22px] font-bold text-ink-2 select-none';

// 보안코드 그림과 입력칸. 글자는 번갈아 기울여 그린다
export default function CaptchaBlock({
  code,
  value,
  onChange,
  onRefresh,
  error,
  hasGuide,
}) {
  return (
    <div className="relative">
      <label
        htmlFor="login-captcha"
        className="mb-2 block leading-6 font-semibold text-ink"
      >
        보안코드
        <span aria-hidden="true" className="ml-0.5 text-danger">
          *
        </span>
      </label>
      <div className="mb-2 flex gap-2">
        <div role="img" aria-label={`보안코드 ${code ?? ''}`} className={ART}>
          {[...(code ?? '')].map((char, index) => (
            <span
              key={index}
              className={
                index % 2
                  ? '-translate-y-[3px] rotate-[9deg]'
                  : 'translate-y-1 -rotate-12'
              }
            >
              {char}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={onRefresh}
          aria-label="보안코드 새로고침"
          className="grid size-[46px] place-items-center rounded-md border border-input-line text-ink-2 hover:bg-surface-2"
        >
          <RefreshCw className="size-6" />
        </button>
      </div>
      <div
        className={`flex h-[46px] items-center rounded-md border bg-white px-3 focus-within:ring-focus ${
          error
            ? 'border-danger focus-within:ring-error'
            : 'border-input-line focus-within:border-brand-500'
        }`}
      >
        <input
          id="login-captcha"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="영문 대문자와 숫자 6글자"
          maxLength={6}
          autoComplete="off"
          aria-required="true"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'login-captcha-error' : undefined}
          className="h-full w-full bg-transparent placeholder:text-placeholder focus:outline-none"
        />
      </div>
      {error && (
        <p
          id="login-captcha-error"
          role="alert"
          className="mt-2 text-sm leading-5 text-danger"
        >
          {error}
        </p>
      )}
      {error && hasGuide && <AiErrorGuide message={error} />}
    </div>
  );
}
