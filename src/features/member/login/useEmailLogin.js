import { useState } from 'react';
import { useLogin, useLoginStatus, useNewCaptcha } from '../queries';
import { isValidEmail } from '../shared/validate';
import { LOGIN_MESSAGES as MSG } from './loginMessages';

const CAPTCHA_FORMAT = /^[A-Z0-9]{6}$/;
const cleanCaptcha = (value) =>
  value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 6);

// 이메일 로그인 폼의 값·오류·보안코드 상태를 한곳에서 다룬다. 로그인에 성공하면 onSuccess를 부른다
export default function useEmailLogin(onSuccess) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [isCaptchaOn, setIsCaptchaOn] = useState(false);
  const login = useLogin();
  const status = useLoginStatus();
  const captcha = useNewCaptcha();

  const setError = (key, message) =>
    setErrors((prev) => ({ ...prev, [key]: message }));

  const refreshCaptcha = () => {
    setCaptchaInput('');
    setError('captcha', '');
    captcha.mutate();
  };

  const requireCaptcha = (nextNotice) => {
    setNotice(nextNotice);
    if (!isCaptchaOn) {
      setIsCaptchaOn(true);
      captcha.mutate();
    }
  };

  const changeEmail = (value) => {
    setEmail(value);
    setError('email', '');
    if (isCaptchaOn) {
      setPassword('');
      refreshCaptcha();
    }
  };

  const changePassword = (value) => {
    setPassword(value);
    setError('password', '');
  };

  const changeCaptcha = (value) => {
    setCaptchaInput(cleanCaptcha(value));
    setError('captcha', '');
  };

  // 형식이 맞는 이메일은 서버에서 보안코드 요구 여부를 미리 확인한다
  const blurEmail = () => {
    const trimmed = email.trim();
    if (!trimmed) return;
    if (!isValidEmail(trimmed)) {
      setError('email', MSG.emailFormat);
      return;
    }
    status.mutate(
      { acntEml: trimmed },
      {
        onSuccess: ({ captchaRequired }) => {
          if (captchaRequired && !isCaptchaOn) {
            requireCaptcha({ type: 'warn', message: MSG.captchaRequired });
          }
        },
      },
    );
  };

  const handleResult = (result) => {
    if (result.ok) {
      onSuccess();
      return;
    }
    setPassword('');
    setCaptchaInput('');
    if (result.reason === 'captcha') {
      setErrors({ captcha: MSG.captchaMismatch });
      captcha.mutate();
      return;
    }
    if (!result.captchaRequired) {
      setNotice({ type: 'error', message: MSG.mismatch });
      return;
    }
    // 5회째 실패는 보안코드 안내, 그 뒤 실패는 불일치 안내를 보이고 보안코드는 새로 만든다
    if (isCaptchaOn) {
      setNotice({ type: 'error', message: MSG.mismatch });
      captcha.mutate();
    } else {
      requireCaptcha({ type: 'warn', message: MSG.captchaRequired });
    }
  };

  const submit = (event) => {
    event.preventDefault();
    const trimmed = email.trim();
    const next = {};
    if (!trimmed) next.email = MSG.emailEmpty;
    else if (!isValidEmail(trimmed)) next.email = MSG.emailFormat;
    if (!password) next.password = MSG.passwordEmpty;
    if (isCaptchaOn) {
      if (!captchaInput) next.captcha = MSG.captchaEmpty;
      else if (!CAPTCHA_FORMAT.test(captchaInput)) {
        next.captcha = MSG.captchaFormat;
      }
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setNotice(null);
      return;
    }
    login.mutate(
      {
        acntEml: trimmed,
        pswd: password,
        captchaId: captcha.data?.captchaId,
        captchaCd: captchaInput,
      },
      { onSuccess: handleResult },
    );
  };

  // 입력칸 오류가 있으면 그 칸을, 없으면 폼 위 알림을 AI가 안내한다
  const guideTarget = errors.email
    ? 'email'
    : errors.password
      ? 'password'
      : errors.captcha
        ? 'captcha'
        : notice
          ? 'notice'
          : null;

  return {
    email,
    password,
    captchaInput,
    errors,
    notice,
    isCaptchaOn,
    captchaCode: captcha.data?.captchaCd,
    isPending: login.isPending,
    guideTarget,
    changeEmail,
    changePassword,
    changeCaptcha,
    blurEmail,
    refreshCaptcha,
    submit,
  };
}
