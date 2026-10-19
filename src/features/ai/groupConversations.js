const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

// 오늘·어제·지난 7일·이전 순서로 묶는다. 대화가 없는 묶음은 뺀다. 목록은 이미 최근순이라고 본다
export function groupConversations(conversations, now = new Date()) {
  const groups = [
    { label: '오늘', items: [] },
    { label: '어제', items: [] },
    { label: '지난 7일', items: [] },
    { label: '이전', items: [] },
  ];

  conversations.forEach((conversation) => {
    // 날짜끼리 뺀다. 시각까지 빼면 어제 밤 11시 대화가 아침에 '오늘'로 묶인다
    const diffDays = Math.round(
      (startOfDay(now) - startOfDay(new Date(conversation.crtDt))) / DAY_MS,
    );
    const index =
      diffDays <= 0 ? 0 : diffDays === 1 ? 1 : diffDays <= 7 ? 2 : 3;
    groups[index].items.push(conversation);
  });

  return groups.filter((group) => group.items.length > 0);
}
