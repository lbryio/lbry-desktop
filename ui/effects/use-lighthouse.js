// @flow
import React from 'react';
import { lighthouse } from 'redux/actions/search';
import { getSearchQueryString } from 'util/query-params';
import { isURIValid } from 'lbry-redux';
import useThrottle from './use-throttle';

export default function useLighthouse(
  query: string,
  showMature?: boolean,
  size?: number = 5,
  additionalOptions: any = {}
) {
  const [results, setResults] = React.useState();
  const [loading, setLoading] = React.useState();
  const queryString = query ? getSearchQueryString(query, { nsfw: showMature, size, ...additionalOptions }) : '';
  const throttledQuery = useThrottle(queryString, 500);

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
