/** 켜짐·꺼짐 스위치(label은 스크린리더용) */
export default function Toggle({ checked, onChange, label, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className={`relative h-[26px] w-[44px] shrink-0 rounded-full transition-colors disabled:opacity-50 ${
        checked ? 'bg-[#285a5c]' : 'bg-[#cdd5d5]'
      }`}
      onClick={() => onChange(!checked)}
    >
      <span
        className={`absolute top-[3px] left-[3px] h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-[18px]' : ''
        }`}
      />
    </button>
  );
}
