// @flow
import React from 'react';

// Returns a blob from the download path
export default function useFileStream(fileStream: (?string) => any) {

  const [state, setState] = React.useState({
    error: false,
    content: null,
    loading: true,
  });

  React.useEffect(() => {
    if (fileStream) {
      let chunks = []
      const stream = fileStream();

      stream.on('data', chunk => {
        chunks.push(chunk)
      });

      stream.on('end', () => {
        const buffer = Buffer.concat(chunks)
        const blob = new Blob([buffer])
        setState({ content: blob, loading: false });
      });

      stream.on('error', () => {
        setState({ error: true, loading: false });

      });
    }
  }, []);

  return state;
}
