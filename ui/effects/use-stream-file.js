import React from 'react';
import useIsMounted from 'effects/use-is-mounted';

// Returns a blob from the download path
export default function useFileStream(fileStream) {
  const isMounted = useIsMounted();

  const [state, setState] = React.useState({
    error: false,
    loading: true,
    content: null,
  });

  React.useEffect(() => {
    if (fileStream && isMounted.current) {
      let chunks = [];
      const stream = fileStream();
      // Handle steam chunk recived
      stream.on('data', chunk => {
        if (isMounted.current) {
          chunks.push(chunk);
        } else {
          // Cancel stream if component is not mounted:
          // The user has left the viewer page
          stream.destroy();
        }
      });
      // Handle stream ended
      stream.on('end', () => {
        if (isMounted.current) {
          const buffer = Buffer.concat(chunks);
          const blob = new Blob([buffer]);
          setState({ content: blob, loading: false });
        }
      });
      // Handle stream error
      stream.on('error', () => {
        if (isMounted.current) {
          setState({ error: true, loading: false });
        }
      });
    }
  }, [fileStream, isMounted]);

  return state;
}
