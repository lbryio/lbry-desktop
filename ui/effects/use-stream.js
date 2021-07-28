import React from 'react';
import https from 'https';
import useIsMounted from 'effects/use-is-mounted';

// Returns web blob from the streaming url
export default function useStream(url) {
  const isMounted = useIsMounted();

  const [state, setState] = React.useState({
    error: false,
    loading: true,
    content: null,
  });

  React.useEffect(() => {
    if (url && isMounted.current) {
      https.get(url, response => {
        if (isMounted && response.statusCode >= 200 && response.statusCode < 300) {
          let chunks = [];
          // Handle stream chunk recived
          response.on('data', function(chunk) {
            if (isMounted.current) {
              chunks.push(chunk);
            } else {
              // Cancel stream if component is not mounted:
              // The user has left the viewer page
              response.destroy();
            }
          });
          // Handle stream ended
          response.on('end', () => {
            if (isMounted.current) {
              const buffer = Buffer.concat(chunks);
              const blob = new Blob([buffer]);
              setState({ content: blob, loading: false });
            }
          });
          // Handle stream error
          response.on('error', () => {
            if (isMounted.current) {
              setState({ error: true, loading: false });
            }
          });
        } else {
          // Handle network error
          if (isMounted.current) {
            setState({ error: true, loading: false });
          }
        }
      });
    }
  }, [url, isMounted]);

  return state;
}
