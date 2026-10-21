import { CATEGORIES } from './placeData';

const STYLES = {
  rail: {
    button:
      'w-[54px] flex-col gap-1 rounded-card py-2.5 text-sm hover:bg-surface-2 hover:text-ink lg:w-[60px]',
    icon: 'size-6',
    pressed: 'bg-brand-50 font-bold text-brand-600',
    normal: 'font-medium text-muted',
  },
  chips: {
    button: 'h-9 shrink-0 flex-row gap-1 rounded-full px-3.5 text-sm shadow-sm',
    icon: 'size-[18px]',
    pressed: 'bg-brand-500 font-semibold text-white',
    normal: 'bg-white font-medium text-muted',
  },
};

export default function PlaceCategoryNav({ variant, category, onSelect }) {
  const style = STYLES[variant];
  return (
    <>
      {CATEGORIES.map((item) => {
        const { key, label } = item;
        const Icon = item.Icon;
        const isPressed = key === category;
        return (
          <button
            key={key}
            type="button"
            aria-pressed={isPressed}
            onClick={() => onSelect(key)}
            className={`flex items-center justify-center ${style.button} ${
              isPressed ? style.pressed : style.normal
            }`}
          >
            <Icon className={style.icon} />
            <span>{label}</span>
          </button>
        );
      })}
    </>
  );
}
