// 앞 단계에서 확인한 값을 읽기 전용으로 보여 준다. 비밀번호·인증번호는 넣지 않는다
export default function SignupSummary({ rows }) {
  return (
    <div className="rounded-box bg-surface-2 p-4 leading-6 text-ink-2">
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between gap-3">
          <span className="text-muted">{label}</span>
          <strong className="min-w-0 truncate font-semibold text-ink">
            {value}
          </strong>
        </div>
      ))}
    </div>
  );
}
