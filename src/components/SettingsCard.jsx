/** 제목 줄(아이콘+제목)과 본문(children)으로 이뤄진 설정 카드 */
export default function SettingsCard({ icon, title, children }) {
  const Icon = icon;

  return (
    <section className="overflow-hidden rounded-[14px] border border-[#e2e7e7] bg-white">
      <h2 className="flex items-center gap-2 border-b border-[#edf1f1] px-5 py-4 text-base font-bold text-[#1a3234]">
        <Icon size={18} className="text-[#285a5c]" aria-hidden="true" />
        {title}
      </h2>
      {children}
    </section>
  );
}
