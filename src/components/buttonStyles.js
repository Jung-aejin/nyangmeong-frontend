const BASE =
  'inline-flex h-10 items-center justify-center gap-1.5 rounded-md border px-4 font-semibold disabled:cursor-not-allowed';

export const BTN_PRIMARY = `${BASE} border-transparent bg-brand-500 text-white hover:enabled:bg-brand-600 disabled:bg-surface-3 disabled:text-line-strong`;
export const BTN_SECONDARY = `${BASE} border-line bg-white hover:enabled:border-line-strong hover:enabled:bg-surface-2 disabled:border-transparent disabled:bg-surface-3 disabled:text-line-strong`;
export const BTN_DANGER = `${BASE} border-transparent bg-danger text-white hover:enabled:bg-[#983a2f] disabled:bg-surface-3 disabled:text-line-strong`;
