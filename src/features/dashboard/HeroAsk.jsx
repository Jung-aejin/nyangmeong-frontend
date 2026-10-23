import { ArrowUp } from 'lucide-react';
import { useState } from 'react';
import useAiWindow from '@/hooks/useAiWindow';

const SUGGESTIONS = [
  '체중 변화 알려줘',
  '다음 접종 언제야?',
  '근처 동물병원 찾아줘',
  '미용실 추천해줘',
];

export default function HeroAsk({ petNm }) {
  const openAiWindow = useAiWindow();
  const [text, setText] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);

  const ask = (question) => {
    const message = question.trim();
    if (!message) return;
    setIsBlocked(!openAiWindow(message));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    ask(text);
  };

  return (
    <div className="flex w-full min-w-0 flex-col items-center gap-4">
      <form
        role="search"
        onSubmit={handleSubmit}
        className="mt-10 flex h-[52px] w-full max-w-[600px] items-center gap-2 rounded-md border border-brand-500 bg-white py-0 pr-1.5 pl-5 shadow-depth-sm focus-within:ring-focus max-[700px]:pl-4"
      >
        <label htmlFor="main-ask" className="sr-only">
          AI 매니저에게 질문
        </label>
        <input
          id="main-ask"
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoComplete="off"
          required
          placeholder={`${petNm}의 건강, 근처 병원, 놀거리까지 무엇이든 물어보세요`}
          className="min-w-0 flex-1 truncate bg-transparent outline-none placeholder:text-placeholder"
        />
        <button
          type="submit"
          aria-label="AI 매니저에게 보내기"
          className="grid size-10 shrink-0 place-items-center rounded-md bg-brand-500 text-white hover:bg-brand-600"
        >
          <ArrowUp className="size-5" />
        </button>
      </form>
      <div
        aria-label="추천 질문"
        className="flex max-w-full gap-2 overflow-x-auto max-[700px]:self-stretch max-[700px]:[scrollbar-width:none] max-[700px]:[&::-webkit-scrollbar]:hidden"
      >
        {SUGGESTIONS.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => ask(question)}
            className="h-9 shrink-0 rounded-full border border-line bg-white/85 px-3.5 text-sm max-[700px]:h-8 max-[700px]:px-3 whitespace-nowrap text-ink-2 hover:border-brand-500 hover:text-brand-600"
          >
            {question}
          </button>
        ))}
      </div>
      {isBlocked && (
        <p role="alert" className="text-sm text-danger">
          팝업이 차단되어 AI 매니저를 열 수 없어요.
        </p>
      )}
      <p className="text-muted">
        AI 매니저가 반려동물 케어에 필요한 정보를 대화로 찾아드려요
      </p>
    </div>
  );
}
