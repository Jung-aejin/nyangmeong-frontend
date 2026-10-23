import { OUTLINE_BTN, PRIMARY_BTN } from '../shared/authStyles';
import AuthField from '../shared/AuthField';
import { SIGNUP_MESSAGES as MSG } from './signupMessages';

const SIDE_BTN = `${OUTLINE_BTN} !w-auto min-w-[88px] shrink-0 px-4 whitespace-nowrap`;

// 2단계. 이메일 인증을 마치면 다음이 열린다. 이메일을 바꾸면 인증은 다시 해야 한다
export default function EmailStep({ form }) {
  const target = form.guideTarget;
  return (
    <>
      <div className="flex flex-col gap-5">
        <AuthField
          id="signup-email"
          label="이메일 (로그인 아이디)"
          value={form.email}
          onChange={form.changeEmail}
          placeholder="이메일 주소 입력"
          autoComplete="username"
          inputMode="email"
          error={form.errors.email}
          hasGuide={target === 'email'}
          action={
            <button
              type="button"
              onClick={form.submitSend}
              disabled={form.isSending}
              className={SIDE_BTN}
            >
              {form.isSent ? '다시 보내기' : '인증코드 발송'}
            </button>
          }
        />
        {form.isSent && (
          <AuthField
            id="signup-code"
            label="인증번호"
            value={form.code}
            onChange={form.changeCode}
            placeholder="숫자 6자리 입력"
            autoComplete="one-time-code"
            inputMode="numeric"
            maxLength={6}
            readOnly={form.isEmailVerified}
            error={form.errors.code}
            success={form.isEmailVerified ? MSG.verified : ''}
            help={MSG.sent}
            hasGuide={target === 'code'}
            endAdornment={
              !form.isEmailVerified && (
                <span className="font-semibold text-danger tabular-nums">
                  {form.countdown.text}
                </span>
              )
            }
            action={
              <button
                type="button"
                onClick={form.submitVerify}
                disabled={form.isVerifying || form.isEmailVerified}
                className={`${SIDE_BTN} !border-transparent !bg-brand-50 !text-brand-600 hover:enabled:!bg-brand-100 disabled:!bg-surface-3 disabled:!text-line-strong`}
              >
                인증 확인
              </button>
            }
          />
        )}
      </div>
      <p className="mt-3 text-sm leading-5 text-muted">
        {form.isEmailVerified
          ? '다음을 눌러 휴대전화번호를 입력해 주세요.'
          : '이메일 인증이 완료되면 다음으로 넘어갈 수 있어요.'}
      </p>
      <button
        type="button"
        disabled={!form.isEmailVerified}
        onClick={() => form.goStep('phone')}
        className={`${PRIMARY_BTN} mt-8`}
      >
        다음
      </button>
    </>
  );
}
