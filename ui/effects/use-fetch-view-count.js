// @flow
import { useState, useEffect } from 'react';

export default function useFetchViewCount(
  shouldFetch: ?boolean,
  uris: Array<string>,
  claimsByUri: any,
  doFetchViewCount: (string) => void
) {
  const [fetchedUris, setFetchedUris] = useState([]);

  useEffect(() => {
    if (shouldFetch && uris && uris.length > 0) {
      const urisToFetch = uris.filter((uri) => uri && !fetchedUris.includes(uri) && Boolean(claimsByUri[uri]));

      if (urisToFetch.length > 0) {
        const claimIds = urisToFetch.map((uri) => claimsByUri[uri].claim_id);
        doFetchViewCount(claimIds.join(','));
        setFetchedUris([...fetchedUris, ...urisToFetch]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uris]);
}
