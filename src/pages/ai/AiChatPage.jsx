import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatInput from '@/features/ai/ChatInput';
import ConversationHeader from '@/features/ai/ConversationHeader';
import ConversationMessages from '@/features/ai/ConversationMessages';
import AnswerBubble from '@/features/ai/AnswerBubble';
import ConversationSidebar from '@/features/ai/ConversationSidebar';
import { OPEN_CHAT_MODAL_MESSAGE } from '@/constants/chatModal';
import { CHAT_MODAL_ACTION } from '@/features/ai/fakeRoutingMap';
import { fakePets } from '@/features/ai/fakePets';
import {
  getFallbackCount,
  increaseFallbackCount,
  resetFallbackCount,
} from '@/features/ai/fallbackCount';
import { openInMainWindow } from '@/features/ai/openInMainWindow';
import { useConversation, useSendMessage } from '@/features/ai/queries';
import useAnswerStream from '@/features/ai/useAnswerStream';
import RouteGuideBubble from '@/features/ai/RouteGuideBubble';
import WelcomeMessage from '@/features/ai/WelcomeMessage';
import { useMemberSummary } from '@/features/member/queries';
import { PATHS } from '@/routes/paths';

/** 임시 반려동물 목록 */
const pets = fakePets;
const representativePet = pets.find((pet) => pet.rprsPetYn === 'Y');

/** 별도 창 전체 화면 AI 채팅 */
export default function AiChatPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedPetSn, setSelectedPetSn] = useState(
    representativePet?.petSn ?? null,
  );
  /** 선택된 대화 번호 */
  const [selectedRoomSn, setSelectedRoomSn] = useState(null);
  /** 첫 메시지 */
  const [searchParams] = useSearchParams();
  const [firstMessage, setFirstMessage] = useState(() => searchParams.get('q'));

  const { data: member } = useMemberSummary();
  const { data: conversation, isError } = useConversation(selectedRoomSn);
  const sendMessage = useSendMessage();
  const answer = useAnswerStream();
  /** 이동 안내 상태 */
  const [route, setRoute] = useState(null);
  /** 선택된 대화의 연속 실패 횟수 */
  const [fallbackCount, setFallbackCount] = useState(0);
  const isAnswering =
    answer.status === 'waiting' || answer.status === 'streaming';

  const selectedPet = pets.find((pet) => pet.petSn === selectedPetSn);

  /** 메시지 전송 */
  const handleSend = (aiCnvrsMsgCn) => {
    sendMessage.mutate(
      {
        aiCnvrsRoomSn: selectedRoomSn,
        petSn: selectedPet?.petSn,
        petNm: selectedPet?.petNm,
        aiCnvrsMsgCn,
      },
      {
        onSuccess: ({
          aiCnvrsRoomSn,
          intent,
          aiCnvrsMsgSn,
          route: nextRoute,
        }) => {
          setFirstMessage(null);
          setRoute(null);
          setSelectedRoomSn(aiCnvrsRoomSn);
          /** 검색·이동 안내·매칭 실패만 이 화면 처리 */
          if (intent === 'SEARCH') {
            answer.start({ aiCnvrsRoomSn, question: aiCnvrsMsgCn });
          }
          if (intent === 'ROUTE') {
            setRoute({ ...nextRoute, aiCnvrsMsgSn, status: 'waiting' });
          }
          if (intent === 'FALLBACK') {
            answer.reset();
            setFallbackCount(increaseFallbackCount(aiCnvrsRoomSn));
          }
          if (intent === 'ROUTE' || intent === 'REGISTER') {
            setFallbackCount(resetFallbackCount(aiCnvrsRoomSn));
          }
        },
      },
    );
  };

  /** 검색 답변 완료 시 실패 횟수 초기화 */
  useEffect(() => {
    if (answer.status !== 'done') return;
    /* eslint-disable-next-line react-hooks/set-state-in-effect -- 답변 완료 시점에 맞춘 초기화 */
    setFallbackCount(resetFallbackCount(answer.aiCnvrsRoomSn));
  }, [answer.status, answer.aiCnvrsRoomSn]);

  /** 미완료 답변 재생성 */
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

  /** 유예 종료 후 본창 이동 */
  const handleRouteElapsed = () => {
    if (route.action === CHAT_MODAL_ACTION) {
      /** 본창 없으면 새 탭 */
      const opener = window.opener;
      if (opener && !opener.closed) {
        opener.postMessage(
          { type: OPEN_CHAT_MODAL_MESSAGE },
          window.location.origin,
        );
        opener.focus();
      } else {
        window.open(PATHS.MAIN, '_blank');
      }
      window.close();
    } else {
      openInMainWindow(route.path);
    }
  };

  /** StrictMode effect 이중 실행 방지 */
  const hasSentFirstMessage = useRef(false);
  useEffect(() => {
    if (!firstMessage || hasSentFirstMessage.current) return;
    hasSentFirstMessage.current = true;
    handleSend(firstMessage.slice(0, 1000));
    /* eslint-disable-next-line react-hooks/exhaustive-deps -- 창을 연 직후 한 번만 전송 */
  }, []);

  /** 설정은 본창에서 열기 */
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
          setRoute(null);
          setFirstMessage(null);
          setSelectedRoomSn(aiCnvrsRoomSn);
          setFallbackCount(getFallbackCount(aiCnvrsRoomSn));
        }}
        onNewChat={() => {
          answer.reset();
          setRoute(null);
          setFirstMessage(null);
          setSelectedRoomSn(null);
          setFallbackCount(0);
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
              setRoute(null);
              setSelectedRoomSn(null);
              setFallbackCount(0);
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
                  !answer.hiddenMsgSns.includes(message.aiCnvrsMsgSn) &&
                  message.aiCnvrsMsgSn !== route?.aiCnvrsMsgSn,
              )}
              fallbackCount={fallbackCount}
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
              {route && (
                <RouteGuideBubble
                  key={route.aiCnvrsMsgSn}
                  label={route.label}
                  status={route.status}
                  onCancel={() => setRoute({ ...route, status: 'cancelled' })}
                  onElapsed={handleRouteElapsed}
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
