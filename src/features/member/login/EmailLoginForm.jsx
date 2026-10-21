import { showToast } from '@/components/toastStore';
import CaptchaBlock from './CaptchaBlock';
import LoginCard from './LoginCard';
import LoginField from './LoginField';
import LoginHeading from './LoginHeading';
import LoginNotice from './LoginNotice';
import { LOGIN_MESSAGES as MSG } from './loginMessages';
import useEmailLogin from './useEmailLogin';

export default function EmailLoginForm({ onBack, onSuccess }) {
  const form = useEmailLogin(onSuccess);
  const target = form.guideTarget;

  return (
    <LoginCard onBack={onBack}>
      <LoginHeading
        title="이메일로 로그인하기"
        subtitle="이메일 아이디와 비밀번호를 입력하세요."
        isMascotHidden={target !== null}
        isCompact={form.isCaptchaOn}
      />
      {form.notice && (
        <LoginNotice
          type={form.notice.type}
          message={form.notice.message}
          hasGuide={target === 'notice'}
        />
      )}
      <form noValidate onSubmit={form.submit} className="flex flex-col gap-5">
        <LoginField
          id="login-email"
          label="아이디(이메일)"
          value={form.email}
          onChange={form.changeEmail}
          onBlur={form.blurEmail}
          placeholder="이메일 주소를 입력하세요"
          autoComplete="username"
          inputMode="email"
          error={form.errors.email}
          hasGuide={target === 'email'}
        />
        <LoginField
          id="login-password"
          label="비밀번호"
          type="password"
          value={form.password}
          onChange={form.changePassword}
          placeholder="비밀번호 입력"
          autoComplete="current-password"
          error={form.errors.password}
          hasGuide={target === 'password'}
        />
        {form.isCaptchaOn && (
          <CaptchaBlock
            code={form.captchaCode}
            value={form.captchaInput}
            onChange={form.changeCaptcha}
            onRefresh={form.refreshCaptcha}
            error={form.errors.captcha}
            hasGuide={target === 'captcha'}
          />
        )}
        <div className="-mt-2 flex justify-end">
          <button
            type="button"
            onClick={() => showToast(MSG.notReady)}
            className="text-muted hover:underline hover:underline-offset-[3px]"
          >
            비밀번호 찾기
          </button>
        </div>
        <button
          type="submit"
          disabled={form.isPending}
          className="mt-3 inline-flex h-[46px] w-full items-center justify-center rounded-md bg-brand-500 font-semibold text-white hover:enabled:bg-brand-600 disabled:cursor-not-allowed disabled:bg-surface-3 disabled:text-line-strong"
        >
          로그인
        </button>
      </form>
      <div className="mt-6 flex justify-center gap-2 text-muted">
        아직 회원이 아니신가요?
        <button
          type="button"
          onClick={() => showToast(MSG.notReady)}
          className="font-semibold text-brand-600 hover:underline hover:underline-offset-[3px]"
        >
          회원가입
        </button>
      </div>
    </LoginCard>
  );
}
