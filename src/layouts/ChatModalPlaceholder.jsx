import { useChatModal } from '@/context/chatModal';

// 채팅 API가 없어 확인용으로 둔 가짜 방. KSJ의 목록·대화 영역으로 바꾼다
const FAKE_ROOMS = ['room-a', 'room-b', 'room-c'];

export default function ChatModalPlaceholder() {
  const { roomSn, selectRoom, open } = useChatModal();

  return (
    <div className="flex min-h-0 flex-1">
      <ul className="w-[380px] shrink-0 border-r border-[#e2e7e7]">
        {FAKE_ROOMS.map((room) => (
          <li key={room}>
            <button
              type="button"
              className={`w-full px-6 py-4 text-left text-[#3d4a4b] hover:bg-[#f4f6f6] ${
                room === roomSn ? 'bg-[#f4f6f6] font-bold' : ''
              }`}
              onClick={() => selectRoom(room)}
            >
              {room}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex flex-1 flex-col items-start gap-4 p-6 text-[#566465]">
        <p>선택된 방: {roomSn ?? '없음'}</p>
        {/* 게시글 [채팅하기]가 open(방)을 부르는 상황을 흉내 낸다 */}
        <button
          type="button"
          className="h-10 rounded-lg border border-[#e2e7e7] px-4 text-sm hover:bg-[#f4f6f6]"
          onClick={() => open('room-c')}
        >
          채팅하기 흉내 (room-c)
        </button>
      </div>
    </div>
  );
}
