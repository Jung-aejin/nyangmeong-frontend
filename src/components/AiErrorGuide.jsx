import aiCharacter from '@/assets/ai-character.png';

export default function AiErrorGuide({ message }) {
  return (
    <aside
      aria-hidden="true"
      className="mt-2 flex items-start gap-2 max-[1100px]:basis-full"
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
