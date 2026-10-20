import { Menu, PawPrint, Plus, User } from 'lucide-react';
import { groupConversations } from './groupConversations';
import { useConversations } from './queries';

/** 대화 목록 사이드바 */
export default function ConversationSidebar({
  pets,
  nickname,
  selectedPetSn,
  selectedRoomSn,
  isCollapsed,
  onTogglePanel,
  onSelectPet,
  onSelectRoom,
  onNewChat,
  onOpenSettings,
}) {
  const {
    data: conversations,
    isPending,
    isError,
  } = useConversations(selectedPetSn);

  return (
    /** 접힘 폭 56px: 펼침 단추 유지, 안쪽은 펼친 폭 고정으로 글자 줄바꿈 방지 */
    <aside
      className={`relative shrink-0 overflow-hidden border-r border-[#e2e7e7] bg-white transition-[width] duration-200 ease-out motion-reduce:transition-none ${
        isCollapsed ? 'w-14' : 'w-[296px]'
      }`}
    >
      <button
        type="button"
        aria-label="사이드바 펼치기"
        inert={!isCollapsed}
        className={`absolute left-2.5 top-3.5 flex size-9 items-center justify-center rounded-full text-[#3d4a4b] transition-opacity duration-200 hover:bg-[#f4f6f6] motion-reduce:transition-none ${
          isCollapsed ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onTogglePanel}
      >
        <Menu size={20} aria-hidden="true" />
      </button>

      <div
        inert={isCollapsed}
        className={`flex h-full w-[295px] flex-col transition-opacity duration-200 motion-reduce:transition-none ${
          isCollapsed ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#edf1f1] px-4">
          <div className="flex items-center gap-2 font-bold text-[#1a3234]">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#285a5c] text-white">
              <PawPrint size={16} aria-hidden="true" />
            </span>
            AI 매니저
          </div>
          <button
            type="button"
            aria-label="사이드바 접기"
            className="flex size-9 items-center justify-center rounded-full text-[#3d4a4b] hover:bg-[#f4f6f6]"
            onClick={onTogglePanel}
          >
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="border-b border-[#e2e7e7] p-4">
          <button
            type="button"
            className="flex h-10 w-full items-center justify-center gap-1.5 rounded-md bg-[#285a5c] text-sm font-medium text-white hover:bg-[#1f4a4c]"
            onClick={onNewChat}
          >
            <Plus size={16} aria-hidden="true" />새 대화
          </button>
          <p className="mt-4 text-xs text-[#667374]">반려동물</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {[{ petSn: null, petNm: '전체' }, ...pets].map((pet) => (
              <button
                key={pet.petSn ?? 'all'}
                type="button"
                aria-pressed={selectedPetSn === pet.petSn}
                className={`h-9 rounded-full px-4 text-sm ${
                  selectedPetSn === pet.petSn
                    ? 'bg-[#285a5c] font-medium text-white'
                    : 'border border-[#e2e7e7] text-[#3d4a4b] hover:bg-[#f4f6f6]'
                }`}
                onClick={() => onSelectPet(pet.petSn)}
              >
                {pet.petNm}
              </button>
            ))}
          </div>
        </div>

        <nav
          aria-label="대화 목록"
          className="min-h-0 flex-1 overflow-y-auto p-2"
        >
          {isPending && (
            <p className="p-2 text-sm text-[#667374]">불러오는 중이에요</p>
          )}
          {isError && (
            <p role="alert" className="p-2 text-sm text-[#667374]">
              대화 목록을 불러오지 못했어요
            </p>
          )}
          {conversations?.length === 0 && (
            <p className="p-2 text-sm text-[#667374]">저장된 대화가 없어요</p>
          )}
          {conversations &&
            groupConversations(conversations).map((group) => (
              <section key={group.label} className="mb-3">
                <h2 className="px-2 py-2 text-sm font-bold text-[#3d4a4b]">
                  {group.label}
                </h2>
                <ul>
                  {group.items.map((conversation) => (
                    <li key={conversation.aiCnvrsRoomSn}>
                      <button
                        type="button"
                        aria-current={
                          selectedRoomSn === conversation.aiCnvrsRoomSn
                            ? 'true'
                            : undefined
                        }
                        className={`flex h-[42px] w-full items-center gap-2 rounded-lg px-2 text-left text-sm text-[#1a3234] ${
                          selectedRoomSn === conversation.aiCnvrsRoomSn
                            ? 'bg-[#e9f2f2]'
                            : 'hover:bg-[#f4f6f6]'
                        }`}
                        onClick={() => onSelectRoom(conversation.aiCnvrsRoomSn)}
                      >
                        <span className="shrink-0 rounded-full bg-[#edf1f1] px-2 py-0.5 text-xs text-[#3d4a4b]">
                          {conversation.petNm ?? '전체'}
                        </span>
                        <span className="truncate">
                          {conversation.aiCnvrsRoomCnvrsTtl}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
        </nav>

        <div className="flex h-14 items-center gap-2 border-t border-[#edf1f1] px-4">
          <span className="flex size-8 items-center justify-center rounded-full border border-[#e2e7e7] bg-[#ebf0f0] text-[#667374]">
            <User size={16} aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-bold text-[#1a3234]">
            {nickname}
          </span>
          <button
            type="button"
            className="rounded-md px-2 py-1 text-sm font-medium text-[#285a5c] hover:bg-[#f4f6f6]"
            onClick={onOpenSettings}
          >
            설정
          </button>
        </div>
      </div>
    </aside>
  );
}
