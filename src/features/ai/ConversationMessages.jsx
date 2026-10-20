import AnswerBubble from './AnswerBubble';

const ROLE_USER = 'USER';
const INCOMPLETE = 'N';

// 저장된 메시지를 보여 준다. children은 저장 전의 진행 중인 답변 말풍선이다
// 미완료 답변의 [다시 생성]은 마지막 메시지일 때만 둔다
export default function ConversationMessages({
  messages,
  onRegenerate,
  children,
}) {
  const lastSn = messages.at(-1)?.aiCnvrsMsgSn;

  return (
    <ul className="mx-auto flex w-full max-w-[820px] flex-col gap-4">
      {messages.map((message) => {
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
