import React from 'react';

export default function useConnectionStatus() {
  const [online, setOnline] = React.useState(window.navigator.onLine);

  React.useEffect(() => {
    function handleOnline(event) {
      setOnline(true);
    }

    function handleOffline(event) {
      setOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { online };
}
