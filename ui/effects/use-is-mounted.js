import React from 'react';

// Check if component is mounted, useful to prevent state updates after component unmounted
function useIsMounted() {
  const isMounted = React.useRef(true);

  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Returning "isMounted.current" wouldn't work because we would return unmutable primitive
  return isMounted;
}

export default useIsMounted;
