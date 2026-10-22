import { useState } from 'react';
import useCountdown from '@/hooks/useCountdown';
import { useSendRecoveryCode, useVerifyRecoveryCode } from '../queries';
import { isValidEmail } from '../shared/validate';
import { PASSWORD_MESSAGES as MSG } from './passwordMessages';

// 비밀번호 찾기 화면의 단계(email, code, sns)와 입력·오류를 한곳에서 다룬다. 일반 계정이 인증되면 onVerified를 부른다
export default function usePasswordFind(onVerified) {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [isSent, setIsSent] = useState(false);
  const [expiresAt, setExpiresAt] = useState(0);
  const [snsTyCd, setSnsTyCd] = useState('');
  const send = useSendRecoveryCode();
  const verify = useVerifyRecoveryCode();
  const countdown = useCountdown(expiresAt);

  const changeEmail = (value) => {
    setEmail(value);
    setErrors({});
  };

  const changeCode = (value) => {
    setCode(value.replace(/\D/g, '').slice(0, 6));
    setErrors({});
  };

  const sendCode = (acntEml) => {
    send.mutate(
      { acntEml },
      {
        onSuccess: (result) => {
          setEmail(acntEml);
          setExpiresAt(result.expiresAt);
          setCode('');
          setErrors({});
          setNotice(null);
          setIsSent(true);
          setStep('code');
        },
        onError: () => setNotice({ type: 'error', message: MSG.sendFailed }),
      },
    );
  };

  const submitEmail = (event) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setErrors({ email: MSG.emailEmpty });
      return;
    }
    if (!isValidEmail(trimmed)) {
      setErrors({ email: MSG.emailFormat });
      return;
    }
    setNotice(null);
    sendCode(trimmed);
  };

  const resend = () => sendCode(email);

  // 이메일을 다시 입력하면 이전 인증번호는 쓸 수 없다
  const editEmail = () => {
    setStep('email');
    setCode('');
    setErrors({});
    setNotice(null);
    setIsSent(false);
    setExpiresAt(0);
  };

  const handleResult = ({ result, snsTyCd: provider }) => {
    setNotice(null);
    if (result === 'RESET') onVerified();
    else if (result === 'SNS') {
      setSnsTyCd(provider);
      setStep('sns');
    } else if (result === 'NOT_FOUND') {
      setNotice({ type: 'error', message: MSG.notFound });
    } else if (result === 'WITHDRAWN') {
      setNotice({ type: 'error', message: MSG.withdrawn, isWithdrawn: true });
    } else if (result === 'EXPIRED') {
      setErrors({ code: MSG.codeExpired });
    } else {
      setErrors({ code: MSG.codeMismatch });
    }
  };

  const submitCode = (event) => {
    event.preventDefault();
    if (!code) {
      setErrors({ code: MSG.codeEmpty });
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      setErrors({ code: MSG.codeFormat });
      return;
    }
    setIsSent(false);
    verify.mutate(
      { acntEml: email, authCd: code },
      { onSuccess: handleResult },
    );
  };

  const guideTarget = errors.email
    ? 'email'
    : errors.code
      ? 'code'
      : notice
        ? 'notice'
        : null;

  return {
    step,
    email,
    code,
    errors,
    notice,
    isSent,
    snsTyCd,
    countdown,
    isPending: send.isPending || verify.isPending,
    guideTarget,
    changeEmail,
    changeCode,
    submitEmail,
    submitCode,
    resend,
    editEmail,
  };
}
