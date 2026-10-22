import { useState } from 'react';
import { useResetPassword } from '../queries';
import { isValidPassword } from '../shared/validate';
import { PASSWORD_MESSAGES as MSG } from './passwordMessages';

// 비밀번호 재설정 입력과 오류. 두 칸이 올바를 때만 저장할 수 있다
export default function usePasswordReset() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [touched, setTouched] = useState({ password: false, confirm: false });
  const [notice, setNotice] = useState(null);
  const [isDone, setIsDone] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const reset = useResetPassword();

  const passwordError = !touched.password
    ? ''
    : !password
      ? MSG.pwEmpty
      : !isValidPassword(password)
        ? MSG.pwRule
        : '';
  const confirmError = !touched.confirm
    ? ''
    : !confirm
      ? MSG.confirmEmpty
      : password !== confirm
        ? MSG.confirmMismatch
        : '';
  const confirmSuccess =
    touched.confirm && confirm && password === confirm ? MSG.confirmMatch : '';
  const canSubmit = isValidPassword(password) && password === confirm;

  const changePassword = (value) => {
    setPassword(value);
    setTouched((prev) => ({ ...prev, password: true }));
    setNotice(null);
  };

  const changeConfirm = (value) => {
    setConfirm(value);
    setTouched((prev) => ({ ...prev, confirm: true }));
    setNotice(null);
  };

  const blurConfirm = () => setTouched((prev) => ({ ...prev, confirm: true }));

  const submit = (event) => {
    event.preventDefault();
    if (!canSubmit) return;
    reset.mutate(
      { pswd: password },
      {
        onSuccess: (result) => {
          if (result.ok) setIsDone(true);
          else if (result.reason === 'EXPIRED') setIsExpired(true);
          else setNotice({ type: 'error', message: MSG.saveFailed });
        },
        onError: () => setNotice({ type: 'error', message: MSG.saveFailed }),
      },
    );
  };

  const guideTarget = passwordError
    ? 'password'
    : confirmError
      ? 'confirm'
      : notice
        ? 'notice'
        : null;

  return {
    password,
    confirm,
    passwordError,
    confirmError,
    confirmSuccess,
    canSubmit,
    notice,
    isDone,
    isExpired,
    isPending: reset.isPending,
    guideTarget,
    changePassword,
    changeConfirm,
    blurConfirm,
    submit,
  };
}
