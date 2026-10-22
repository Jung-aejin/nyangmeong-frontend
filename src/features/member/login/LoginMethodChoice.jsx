import { Mail } from 'lucide-react';
import { showToast } from '@/components/toastStore';
import AuthCard from '../shared/AuthCard';
import AuthHeading from '../shared/AuthHeading';
import { LOGIN_MESSAGES as MSG } from './loginMessages';
import SnsLoginButtons from './SnsLoginButtons';

export default function LoginMethodChoice({ onBack, onSelectEmail }) {
  return (
    <AuthCard onBack={onBack}>
      <AuthHeading title="로그인" subtitle="가입한 방법으로 로그인해 주세요." />
      <SnsLoginButtons />
      <div className="my-6 flex items-center gap-4 text-subtle before:h-px before:flex-1 before:bg-line after:h-px after:flex-1 after:bg-line">
        또는
      </div>
      <button
        type="button"
        onClick={onSelectEmail}
        className="inline-flex h-[46px] w-full items-center justify-center gap-1.5 rounded-md bg-brand-500 font-semibold text-white hover:bg-brand-600"
      >
        <Mail className="size-5" />
        이메일로 로그인하기
      </button>
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
    </AuthCard>
  );
}
