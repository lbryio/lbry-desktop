// @flow
import React from 'react';
import { lighthouse } from 'redux/actions/search';
import { getSearchQueryString } from 'util/query-params';
import { isURIValid } from 'lbry-redux';
import useThrottle from './use-throttle';

export default function useLighthouse(query: string, showMature?: boolean, size?: number = 6) {
  const THROTTLE_MS = 1000;
  const [results, setResults] = React.useState();
  const [loading, setLoading] = React.useState();
  const queryString = query ? getSearchQueryString(query, { nsfw: showMature, size }) : '';
  const throttledQuery = useThrottle(queryString, THROTTLE_MS);

  React.useEffect(() => {
    if (throttledQuery) {
      setLoading(true);
      setResults(null);

      let isSubscribed = true;
      lighthouse
        .search(throttledQuery)
        .then((results) => {
          if (isSubscribed) {
            setResults(
              results.map((result) => `lbry://${result.name}#${result.claimId}`).filter((uri) => isURIValid(uri))
            );
            setLoading(false);
          }
        })
        .catch(() => {
          setLoading(false);
        });

      return () => {
        isSubscribed = false;
      };
    }
  }, [throttledQuery]);

  return { results, loading };
}
