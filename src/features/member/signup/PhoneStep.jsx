import { OUTLINE_BTN, PRIMARY_BTN } from '../shared/authStyles';
import AuthField from '../shared/AuthField';
import SignupSummary from './SignupSummary';
import { SIGNUP_MESSAGES as MSG } from './signupMessages';

// 3단계. 문자 인증 없이 번호 중복만 확인한다. 번호를 바꾸면 확인을 다시 해야 한다
export default function PhoneStep({ form }) {
  return (
    <>
      <div className="flex flex-col gap-5">
        <AuthField
          id="signup-phone"
          label="휴대전화번호"
          value={form.phone}
          onChange={form.changePhone}
          placeholder="01012345678"
          autoComplete="tel"
          inputMode="tel"
          error={form.errors.phone}
          success={form.isPhoneChecked ? MSG.phoneAvailable : ''}
          help={form.phone ? MSG.phoneNeedCheck : MSG.phoneHelp}
          hasGuide={form.guideTarget === 'phone'}
          action={
            <button
              type="button"
              onClick={form.submitPhoneCheck}
              disabled={form.isPhoneChecking}
              className={`${OUTLINE_BTN} !w-auto min-w-[88px] shrink-0 px-4 whitespace-nowrap`}
            >
              중복확인
            </button>
          }
        />
        <SignupSummary rows={[['이메일 · 인증 완료', form.email]]} />
      </div>
      <button
        type="button"
        disabled={!form.isPhoneChecked}
        onClick={() => form.goStep('password')}
        className={`${PRIMARY_BTN} mt-8`}
      >
        다음
      </button>
    </>
  );
}
