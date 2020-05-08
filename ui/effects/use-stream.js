// @flow
import React from 'react';
import https from 'https';

// Returns web blob from the streaming url
export default function useStream(url: (?string) => any) {

  const [state, setState] = React.useState({
    error: false,
    content: null,
    loading: false,
  });

  React.useEffect(() => {
    if (url) {
      let chunks = [];

      // Start loading state
      setState({loading: true})

      https.get(
        url,
        response => {
          if (response.statusCode >= 200 && response.statusCode < 300) {
            let chunks = []
            response.on('data', function(chunk) {
              chunks.push(chunk);
            });
            response.on('end', () => {
              const buffer = Buffer.concat(chunks)
              const blob = new Blob([buffer])
              console.info(response)
              setState({ content: blob, loading: false });
            });
          } else {
            console.info(response)
            setState({ error: true, loading: false });
          }
        }
      );
    }
  }, []);

  return state;
}
