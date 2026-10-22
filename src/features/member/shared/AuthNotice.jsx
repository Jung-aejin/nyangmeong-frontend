import { CircleAlert, Info } from 'lucide-react';
import AiErrorGuide from '@/components/AiErrorGuide';

const STYLES = {
  error: { box: 'bg-danger-soft', icon: 'text-danger', Icon: CircleAlert },
  warn: { box: 'bg-warn-soft', icon: 'text-warn', Icon: CircleAlert },
  info: { box: 'bg-brand-50', icon: 'text-brand-500', Icon: Info },
};

// 처리 결과를 폼 위에 알린다. hasGuide면 AI 안내를 함께 보인다
export default function AuthNotice({ type, message, hasGuide }) {
  const style = STYLES[type];
  const Icon = style.Icon;
  return (
    <div
      role="alert"
      className={`relative mb-6 flex flex-wrap gap-2.5 rounded-box px-4 py-3.5 leading-6 text-ink-2 ${style.box}`}
    >
      <Icon className={`mt-0.5 size-5 shrink-0 ${style.icon}`} />
      <span className="min-w-0 flex-1">{message}</span>
      {hasGuide && <AiErrorGuide message={message} />}
    </div>
  );
}
