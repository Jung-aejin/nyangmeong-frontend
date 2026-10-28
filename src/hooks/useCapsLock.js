import { useState } from 'react';

export default function useCapsLock() {
  const [isCapsOn, setIsCapsOn] = useState(false);
  const update = (event) => setIsCapsOn(event.getModifierState('CapsLock'));

  return {
    isCapsOn,
    capsProps: {
      onKeyDown: update,
      onKeyUp: update,
      onBlur: () => setIsCapsOn(false),
    },
  };
}
