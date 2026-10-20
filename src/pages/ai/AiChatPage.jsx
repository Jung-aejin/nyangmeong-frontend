import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatInput from '@/features/ai/ChatInput';
import ConversationHeader from '@/features/ai/ConversationHeader';
import ConversationMessages from '@/features/ai/ConversationMessages';
import AnswerBubble from '@/features/ai/AnswerBubble';
import ConversationSidebar from '@/features/ai/ConversationSidebar';
import { fakePets } from '@/features/ai/fakePets';
import { useConversation, useSendMessage } from '@/features/ai/queries';
import useAnswerStream from '@/features/ai/useAnswerStream';
import WelcomeMessage from '@/features/ai/WelcomeMessage';
import { useMemberSummary } from '@/features/member/queries';
import { PATHS } from '@/routes/paths';

// 연결할 때는 fakePets 대신 features/pet의 훅으로 바꾼다
const pets = fakePets;
const representativePet = pets.find((pet) => pet.rprsPetYn === 'Y');

// 헤더·GNB·푸터가 없는 별도 창 화면이라 UserLayout 밖에서 전체 화면을 쓴다
export default function AiChatPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedPetSn, setSelectedPetSn] = useState(
    representativePet?.petSn ?? null,
  );
  // null이면 새 대화다. 대화는 첫 메시지를 보낼 때 만들어지므로 지금은 서버에 아무것도 없다
  const [selectedRoomSn, setSelectedRoomSn] = useState(null);
  // 히어로 검색바로 열렸을 때 새 대화의 첫 메시지가 될 문장이다. 창을 연 첫 화면에서만 쓰므로 다른 대화로 가면 비운다
  const [searchParams] = useSearchParams();
  const [firstMessage, setFirstMessage] = useState(() => searchParams.get('q'));

  const { data: member } = useMemberSummary();
  const { data: conversation, isError } = useConversation(selectedRoomSn);
  const sendMessage = useSendMessage();
  const answer = useAnswerStream();
  const isAnswering =
    answer.status === 'waiting' || answer.status === 'streaming';

  const selectedPet = pets.find((pet) => pet.petSn === selectedPetSn);

  // 새 대화면 서버가 이 메시지로 대화를 만들고, 돌려준 방을 선택한다
  const handleSend = (aiCnvrsMsgCn) => {
    sendMessage.mutate(
      {
        aiCnvrsRoomSn: selectedRoomSn,
        petSn: selectedPet?.petSn,
        petNm: selectedPet?.petNm,
        aiCnvrsMsgCn,
      },
      {
        onSuccess: ({ aiCnvrsRoomSn, intent }) => {
          setFirstMessage(null);
          setSelectedRoomSn(aiCnvrsRoomSn);
          // 검색 질문만 이 화면에서 답한다. 라우팅·폴백·일정 등록은 각 화면에서 처리한다
          if (intent === 'SEARCH') {
            answer.start({ aiCnvrsRoomSn, question: aiCnvrsMsgCn });
          }
        },
      },
    );
  };

  // 미완료 답변을 같은 질문으로 다시 만들어 그 말풍선을 바꾼다
  const handleRegenerate = (message) => {
    const messages = conversation?.messages ?? [];
    const index = messages.findIndex(
      (item) => item.aiCnvrsMsgSn === message.aiCnvrsMsgSn,
    );
    const question = messages
      .slice(0, index)
      .findLast((item) => item.aiCnvrsMsgRoleCd === 'USER')?.aiCnvrsMsgCn;
    if (!question) return;
    answer.start({
      aiCnvrsRoomSn: selectedRoomSn,
      question,
      replaceMsgSn: message.aiCnvrsMsgSn,
    });
  };

  // 개발 모드의 StrictMode는 effect를 두 번 실행하므로 ref로 한 번만 보낸다
  const hasSentFirstMessage = useRef(false);
  useEffect(() => {
    if (!firstMessage || hasSentFirstMessage.current) return;
    hasSentFirstMessage.current = true;
    handleSend(firstMessage.slice(0, 1000));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 창을 연 직후 한 번만 보낸다
  }, []);

  // 설정은 이 창 안에서 열지 않고 본창에서 연다. 본창이 닫혔으면 새 탭으로 연다
  const handleOpenSettings = () => {
    const opener = window.opener;
    if (opener && !opener.closed) {
      opener.location.href = PATHS.SETTINGS_NOTIFICATIONS;
      opener.focus();
    } else {
      window.open(PATHS.SETTINGS_NOTIFICATIONS, '_blank');
    }
  };

  return (
    <div className="flex h-screen bg-[#faf8f5] font-sans">
      <ConversationSidebar
        pets={pets}
        nickname={member?.mbrNcnm ?? ''}
        selectedPetSn={selectedPetSn}
        selectedRoomSn={selectedRoomSn}
        isCollapsed={isCollapsed}
        onTogglePanel={() => setIsCollapsed((prev) => !prev)}
        onSelectPet={setSelectedPetSn}
        onSelectRoom={(aiCnvrsRoomSn) => {
          answer.reset();
          setFirstMessage(null);
          setSelectedRoomSn(aiCnvrsRoomSn);
        }}
        onNewChat={() => {
          answer.reset();
          setFirstMessage(null);
          setSelectedRoomSn(null);
        }}
        onOpenSettings={handleOpenSettings}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        {selectedRoomSn === null && (
          <header className="flex h-16 shrink-0 items-center gap-3 border-b border-[#e2e7e7] bg-white px-6">
            <h1 className="text-lg font-bold text-[#1a3234]">새 대화</h1>
            <span className="shrink-0 rounded-full bg-[#e9f2f2] px-2.5 py-0.5 text-xs font-medium text-[#285a5c]">
              {selectedPet?.petNm ?? '전체'}
            </span>
          </header>
        )}
        {conversation && (
          <ConversationHeader
            conversation={conversation}
            onDeleted={() => {
              answer.reset();
              setSelectedRoomSn(null);
            }}
          />
        )}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-8">
          {isError && (
            <p role="alert" className="text-center text-[#667374]">
              대화를 불러오지 못했어요. 잠시 뒤 다시 시도해 주세요
            </p>
          )}
          {conversation && (
            <ConversationMessages
              messages={conversation.messages.filter(
                (message) =>
                  !answer.hiddenMsgSns.includes(message.aiCnvrsMsgSn),
              )}
              onRegenerate={handleRegenerate}
            >
              {answer.status !== 'idle' && (
                <AnswerBubble
                  status={answer.status}
                  text={answer.text}
                  shortcuts={answer.shortcuts}
                  onRetry={() =>
                    answer.start({
                      aiCnvrsRoomSn: answer.aiCnvrsRoomSn,
                      question: answer.question,
                    })
                  }
                  onRegenerate={() =>
                    answer.start({
                      aiCnvrsRoomSn: answer.aiCnvrsRoomSn,
                      question: answer.question,
                      replaceMsgSn: answer.hiddenMsgSns.at(-1),
                    })
                  }
                />
              )}
            </ConversationMessages>
          )}
          {selectedRoomSn === null && (
            <div className="flex min-h-full items-center justify-center">
              <WelcomeMessage
                nickname={member?.mbrNcnm ?? ''}
                petNm={selectedPet?.petNm}
              />
            </div>
          )}
        </div>
        {sendMessage.isError && (
          <p role="alert" className="pb-2 text-center text-sm text-[#b42318]">
            메시지를 보내지 못했어요. 잠시 뒤 다시 시도해 주세요
          </p>
        )}
        <ChatInput
          petNm={selectedPet?.petNm}
          isDisabled={sendMessage.isPending || isAnswering}
          onSubmit={handleSend}
        />
      </main>
    </div>
  );
}
