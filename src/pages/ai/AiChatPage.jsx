import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ConversationHeader from '@/features/ai/ConversationHeader';
import ConversationMessages from '@/features/ai/ConversationMessages';
import ConversationSidebar from '@/features/ai/ConversationSidebar';
import { fakePets } from '@/features/ai/fakePets';
import { useConversation } from '@/features/ai/queries';
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
          setFirstMessage(null);
          setSelectedRoomSn(aiCnvrsRoomSn);
        }}
        onNewChat={() => {
          setFirstMessage(null);
          setSelectedRoomSn(null);
        }}
        onOpenSettings={handleOpenSettings}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        {conversation && (
          <ConversationHeader
            conversation={conversation}
            onDeleted={() => setSelectedRoomSn(null)}
          />
        )}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-8">
          {isError && (
            <p role="alert" className="text-center text-[#667374]">
              대화를 불러오지 못했어요. 잠시 뒤 다시 시도해 주세요
            </p>
          )}
          {conversation && (
            <ConversationMessages messages={conversation.messages} />
          )}
          {selectedRoomSn === null && (
            // 웰컴 메시지와 바로가기 칩, 입력창은 SCR-AIM-001에서 이 자리를 채운다.
            // data-first-message는 그때 첫 메시지를 자동 전송(011-05, 001-06)할 값을 넘기는 자리다
            <p
              data-first-message={firstMessage ?? undefined}
              className="mx-auto max-w-[820px] text-[15px] text-[#667374]"
            >
              대화를 고르거나 새 대화를 시작해 보세요
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
