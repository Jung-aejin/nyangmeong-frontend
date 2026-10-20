import { useState } from 'react';
import { ArrowUp } from 'lucide-react';

const MAX_LENGTH = 1000;

/** 입력 규칙 전담 */
export default function ChatInput({ petNm, isDisabled, onSubmit }) {
  const [text, setText] = useState('');
  const [isTrimmed, setIsTrimmed] = useState(false);

  const canSubmit = text.trim() !== '' && !isDisabled;

  const handleChange = (event) => {
    const value = event.target.value;
    /** 입력 길이 제한 */
    if (value.length > MAX_LENGTH) {
      setText(value.slice(0, MAX_LENGTH));
      setIsTrimmed(true);
      return;
    }
    setText(value);
    setIsTrimmed(false);
  };

  const submit = () => {
    if (!canSubmit) return;
    onSubmit(text.trim());
    setText('');
    setIsTrimmed(false);
  };

  const handleKeyDown = (event) => {
    /** 한글 조합 중 Enter 전송 방지 */
    if (
      event.key !== 'Enter' ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    )
      return;
    event.preventDefault();
    submit();
  };

  return (
    <div className="mx-auto w-full max-w-[820px] px-6 pb-4">
      <form
        className="flex items-center gap-3 rounded-[14px] border border-[#d3dae2] bg-white px-4 py-3"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <textarea
          value={text}
          rows={1}
          aria-label="메시지 입력"
          placeholder={`${petNm ?? '반려동물'}에 대해 물어보거나, "병원 찾아줘"처럼 말해보세요`}
          className="max-h-40 min-w-0 flex-1 resize-none bg-transparent text-base text-[#1a3234] outline-none [field-sizing:content] placeholder:text-[#8c9899]"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <span className="shrink-0 text-sm text-[#667374]">
          <b>{text.length}</b>/ {MAX_LENGTH.toLocaleString()}
        </span>
        <button
          type="submit"
          aria-label="전송"
          disabled={!canSubmit}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#285a5c] text-white disabled:bg-[#ebf0f0] disabled:text-[#8c9899]"
        >
          <ArrowUp size={20} aria-hidden="true" />
        </button>
      </form>
      {isTrimmed && (
        <p role="status" className="mt-2 text-center text-sm text-[#b42318]">
          {MAX_LENGTH.toLocaleString()}자까지 입력할 수 있어요. 넘는 부분은
          잘랐어요
        </p>
      )}
      <p className="mt-2 text-center text-sm text-[#667374]">
        AI 매니저는 진단·의료 판단을 하지 않습니다. 이상 징후가 있으면 수의사와
        상담하세요.
      </p>
    </div>
  );
}
