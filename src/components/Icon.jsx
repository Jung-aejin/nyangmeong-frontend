// Material Symbols Rounded 아이콘. name은 글꼴의 아이콘 이름이다(예: hearing, dentistry)
export default function Icon({ name, filled = false, className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`icon ${filled ? 'icon-filled' : ''} ${className}`}
    >
      {name}
    </span>
  );
}
