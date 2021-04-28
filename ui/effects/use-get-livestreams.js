// @flow
import React from 'react';
import { BITWAVE_LIVE_API } from 'constants/livestream';

/**
 * Gets latest livestream info list. Returns null (instead of a blank object)
 * when there are no active livestreams.
 *
 * @param refreshMs
 * @returns {{livestreamMap: null, loading: boolean}}
 */
export default function useGetLivestreams(refreshMs: number) {
  const [loading, setLoading] = React.useState(true);
  const [livestreamMap, setLivestreamMap] = React.useState(null);

  React.useEffect(() => {
    function checkCurrentLivestreams() {
      fetch(BITWAVE_LIVE_API)
        .then((res) => res.json())
        .then((res) => {
          setLoading(false);
          if (!res.data) {
            setLivestreamMap(null);
            return;
          }

          const livestreamMap = res.data.reduce((acc, curr) => {
            acc[curr.claimId] = curr;
            return acc;
          }, {});

          setLivestreamMap(livestreamMap);
        })
        .catch((err) => {
          setLoading(false);
        });
    }

    checkCurrentLivestreams();

    if (refreshMs > 0) {
      let fetchInterval = setInterval(checkCurrentLivestreams, refreshMs);
      return () => {
        if (fetchInterval) {
          clearInterval(fetchInterval);
        }
      };
    }
  }, []);

  return { livestreamMap, loading };
}
