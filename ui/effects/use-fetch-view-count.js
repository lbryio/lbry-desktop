// @flow
import { useState, useEffect } from 'react';

/**
 *
 * @param {boolean} shouldFetch - Whether to get the views, not needed for some pages
 * @param {array} uris - Array of the LBRY uris of content to fetch views for
 * @param {object} claimsByUri - Function to get claimIds from claim uris
 * @param {function} doFetchViewCount - Get views account per a string of comma separated Claim Ids
 */
export default function useFetchViewCount(
  shouldFetch: ?boolean,
  uris: Array<string>,
  claimsByUri: {},
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
