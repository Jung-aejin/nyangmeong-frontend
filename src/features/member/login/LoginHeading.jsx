import aiCharacter from '@/assets/ai-character.png';

// AI 안내가 보이는 동안은 캐릭터가 겹치지 않게 제목 위 캐릭터를 가린다
export default function LoginHeading({
  title,
  subtitle,
  isMascotHidden = false,
  isCompact = false,
}) {
  return (
    <div className="mb-8 text-center max-md:mb-6">
      <div
        className={`mx-auto grid place-items-center rounded-full bg-brand-50 ${
          isCompact ? 'mb-3 size-12' : 'mb-4 size-[72px]'
        } ${isMascotHidden ? 'invisible' : ''}`}
      >
        <img
          src={aiCharacter}
          alt=""
          className={isCompact ? 'w-[38px]' : 'w-14'}
        />
      </div>
      <h1 className="text-page font-bold tracking-[-0.02em] text-ink max-md:text-2xl">
        {title}
      </h1>
      <p className="mt-2 leading-normal text-muted">{subtitle}</p>
    </div>
  );
}
