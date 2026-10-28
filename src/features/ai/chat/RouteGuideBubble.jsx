import aiCharacter from '@/assets/ai-character.png';
import useRouteCountdown, { ROUTE_GRACE_SECONDS } from './useRouteCountdown';

/** 이동 안내 말풍선 */
export default function RouteGuideBubble({
  label,
  status,
  onCancel,
  onElapsed,
}) {
  const isWaiting = status === 'waiting';
  const secondsLeft = useRouteCountdown({ isActive: isWaiting, onElapsed });

  return (
    <div className="flex min-w-0 items-start gap-3">
      <img
        src={aiCharacter}
        alt=""
        width="36"
        height="36"
        className="size-9 shrink-0 rounded-full border border-[#e2e7e7] bg-[#e9f2f2] object-contain p-1"
      />
      <div className="max-w-[592px] rounded-[4px_18px_18px_18px] border border-[#e2e7e7] bg-white px-4 py-3 text-[15px] leading-relaxed text-[#1a3234]">
        <p>
          <b>{label}</b> 화면으로 이동할게요.
        </p>
        {isWaiting ? (
          <div className="mt-3 flex items-center gap-3">
            <span role="timer" className="shrink-0 text-sm text-[#566465]">
              <b>{secondsLeft}</b>초 후 이동합니다
            </span>
            <div
              aria-hidden="true"
              className="h-2.5 min-w-24 flex-1 overflow-hidden rounded-full bg-[#ebf0f0]"
            >
              <i
                className="block h-full rounded-full bg-[#285a5c] transition-[width] duration-1000 ease-linear motion-reduce:transition-none"
                style={{
                  width: `${(secondsLeft / ROUTE_GRACE_SECONDS) * 100}%`,
                }}
              />
            </div>
            <button
              type="button"
              className="h-8 shrink-0 rounded-md border border-[#e2e7e7] bg-white px-3 text-sm font-semibold hover:bg-[#f4f6f6]"
              onClick={onCancel}
            >
              취소
            </button>
          </div>
        ) : (
          <p className="mt-2 border-t border-dashed border-[#e2e7e7] pt-2 text-sm text-[#566465]">
            이동을 취소했어요. 계속 대화할 수 있어요.
          </p>
        )}
      </div>
    </div>
  );
}
