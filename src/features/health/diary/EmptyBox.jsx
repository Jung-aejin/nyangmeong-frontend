import Icon from '@/components/Icon';

/**
 * [빈 상태 점선 박스]
 * - 영역 아이콘 + 무엇이 없는지·다음에 할 일 2줄 + 선택 동작 버튼
 */
export default function EmptyBox({ icon, title, description, action }) {
  return (
    <div className="rounded-[10px] border border-dashed border-line-strong">
      <div className="flex flex-col items-center gap-2.5 px-6 py-14 text-center text-muted">
        <span className="grid size-16 place-items-center rounded-full bg-surface-2 text-line-strong">
          <Icon name={icon} className="text-[32px]" />
        </span>
        <p className="text-lg/[1.6] font-bold text-ink">{title}</p>
        <p>{description}</p>
        {action}
      </div>
    </div>
  );
}
