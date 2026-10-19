const ROLE_USER = 'USER';

// 저장된 메시지를 읽기만 한다. 이어서 입력하는 창은 SCR-AIM-001에서 붙인다
export default function ConversationMessages({ messages }) {
  return (
    <ul className="mx-auto flex w-full max-w-[820px] flex-col gap-4">
      {messages.map((message) => {
        const isUser = message.aiCnvrsMsgRoleCd === ROLE_USER;
        return (
          <li
            key={message.aiCnvrsMsgSn}
            className={isUser ? 'flex justify-end' : 'flex justify-start'}
          >
            <p
              className={`max-w-[592px] whitespace-pre-wrap rounded-[14px] border px-4 py-3 text-[15px] leading-relaxed text-[#1a3234] ${
                isUser
                  ? 'border-[#e8d27e] bg-[#f9eaa6]'
                  : 'border-[#e2e7e7] bg-white'
              }`}
            >
              {message.aiCnvrsMsgCn}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
