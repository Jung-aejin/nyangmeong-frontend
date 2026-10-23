import aiCharacter from '@/assets/ai-character.png';

// isInline: 모달처럼 오른쪽 공간이 없는 곳에서 입력칸 바로 아래에 놓는다
export default function AiErrorGuide({ message, isInline = false }) {
  return (
    <aside
      aria-hidden="true"
      className={`mt-2 flex items-start gap-2 max-[1100px]:basis-full ${
        isInline
          ? ''
          : 'min-[1101px]:absolute min-[1101px]:top-0 min-[1101px]:left-[calc(100%+40px)] min-[1101px]:mt-0 min-[1101px]:w-[260px]'
      }`}
    >
      <img src={aiCharacter} alt="" className="mt-1 w-10 shrink-0" />
      <div className="flex-1 rounded-box border border-danger bg-white px-4 py-3 leading-6 text-danger shadow-depth-sm">
        <small className="mb-0.5 block text-sm font-semibold text-subtle">
          AI 매니저
        </small>
        {message}
      </div>
    </aside>
  );
}
