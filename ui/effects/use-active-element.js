import { useEffect, useState } from 'react';

export const useActiveElement = () => {
  const [active, setActive] = useState(document.activeElement);

  const handleFocus = (e) => {
    setActive(document.activeElement);
  };

  useEffect(() => {
    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleFocus);
    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleFocus);
    };
  }, []);

  return active;
};
