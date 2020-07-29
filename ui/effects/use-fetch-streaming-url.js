import React from 'react';
import { Lbry } from 'lbry-redux';
import useIsMounted from 'effects/use-is-mounted';

// Fetch streaming url
export default function useFetchStreamingUrl(uri) {
  const isMounted = useIsMounted();

  const [state, setState] = React.useState({
    error: false,
    fetching: false,
    streamingUrl: null,
  });

  React.useEffect(() => {
    async function fetchClaim(claimUri) {
      try {
        setState({ fetching: true });
        const data = await Lbry.get({ uri: claimUri });

        if (data && isMounted.current) {
          const { streaming_url: streamingUrl } = data;
          setState({ fetching: false, streamingUrl });
        }
      } catch (error) {
        if (isMounted.current) {
          setState({ error, fetching: false });
        }
      }
    }

    if (uri && !state.error && !state.fetching && !state.streamingUrl) {
      fetchClaim(uri);
    }
  }, [uri, state]);

  return state;
}
