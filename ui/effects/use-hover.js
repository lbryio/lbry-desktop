import { useEffect, useState } from 'react';

export default function useHover(ref) {
  const [isHovering, setIsHovering] = useState(false);

  const hoverFunc = () => setIsHovering(true);
  const unHoverFunc = () => setIsHovering(false);

  useEffect(() => {
    const refElement = ref.current;
    if (refElement) {
      refElement.addEventListener('mouseenter', hoverFunc);
      refElement.addEventListener('mouseleave', unHoverFunc);

      return () => {
        refElement.removeEventListener('mouseenter', hoverFunc);
        refElement.removeEventListener('mouseleave', unHoverFunc);
      };
    }
  }, [ref, isHovering]);

  return isHovering;
}
