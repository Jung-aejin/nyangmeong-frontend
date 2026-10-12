const DURATION_MS = 3000;

let toasts = [];
let nextId = 1;
const listeners = new Set();

const emit = () => listeners.forEach((listener) => listener());

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getToasts = () => toasts;

// 컴포넌트 밖(mutation의 onError 등)에서도 부를 수 있다
export const showToast = (message) => {
  const id = nextId++;
  toasts = [...toasts, { id, message }];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((toast) => toast.id !== id);
    emit();
  }, DURATION_MS);
};
