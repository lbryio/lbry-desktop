// @flow
import React from 'react';
import { lighthouse } from 'redux/actions/search';
import { getSearchQueryString } from 'util/query-params';
import useThrottle from './use-throttle';

export default function useLighthouse(query: string, showMature?: boolean, size?: number = 5) {
  const [results, setResults] = React.useState();
  const [loading, setLoading] = React.useState();
  const queryString = query ? getSearchQueryString(query, { nsfw: showMature, size }) : '';
  const throttledQuery = useThrottle(queryString, 500);

  React.useEffect(() => {
    if (throttledQuery) {
      setLoading(true);
      setResults(null);

      lighthouse
        .search(throttledQuery)
        .then(results => {
          setResults(results.map(result => `lbry://${result.name}#${result.claimId}`));
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [throttledQuery]);

  return { results, loading };
}
