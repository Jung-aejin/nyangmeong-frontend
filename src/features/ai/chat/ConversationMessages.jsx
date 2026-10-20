import AnswerBubble from './AnswerBubble';
import FallbackBubble from './FallbackBubble';
import { FALLBACK_MESSAGE, FAQ_FAIL_COUNT } from '../shared/fallbackCount';

const ROLE_USER = 'USER';
const INCOMPLETE = 'N';

/** 저장된 메시지 목록 */
export default function ConversationMessages({
  messages,
  fallbackCount,
  onRegenerate,
  children,
}) {
  const lastSn = messages.at(-1)?.aiCnvrsMsgSn;

  return (
    <ul className="mx-auto flex w-full max-w-[820px] flex-col gap-4">
      {messages.map((message) => {
        if (
          message.aiCnvrsMsgRoleCd !== ROLE_USER &&
          message.aiCnvrsMsgCn === FALLBACK_MESSAGE
        ) {
          return (
            <li key={message.aiCnvrsMsgSn}>
              <FallbackBubble
                text={message.aiCnvrsMsgCn}
                hasActions={message.aiCnvrsMsgSn === lastSn}
                hasFaqGuide={fallbackCount >= FAQ_FAIL_COUNT}
              />
            </li>
          );
        }
        if (message.aiCnvrsMsgRoleCd !== ROLE_USER) {
          const isIncomplete = message.aiCnvrsMsgCmptnYn === INCOMPLETE;
          return (
            <li key={message.aiCnvrsMsgSn}>
              <AnswerBubble
                status={isIncomplete ? 'incomplete' : 'done'}
                text={message.aiCnvrsMsgCn}
                onRegenerate={
                  isIncomplete && message.aiCnvrsMsgSn === lastSn
                    ? () => onRegenerate(message)
                    : undefined
                }
              />
            </li>
          );
        }
        return (
          <li key={message.aiCnvrsMsgSn} className="flex justify-end">
            <p className="max-w-[592px] whitespace-pre-wrap rounded-[18px_4px_18px_18px] border border-[#e8d27e] bg-[#f9eaa6] px-4 py-3 text-[15px] leading-relaxed text-[#1a3234]">
              {message.aiCnvrsMsgCn}
            </p>
          </li>
        );
      })}
      {children && <li>{children}</li>}
    </ul>
  );
}
