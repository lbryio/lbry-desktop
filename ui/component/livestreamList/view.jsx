// @flow
import React from 'react';
import ClaimList from 'component/claimList';
import Spinner from 'component/spinner';
import { FETCH_ACTIVE_LIVESTREAMS_MIN_INTERVAL_MS } from 'constants/livestream';
import { getLivestreamUris } from 'util/livestream';

type Props = {
  activeLivestreams: ?LivestreamInfo,
  fetchingActiveLivestreams: boolean,
  doFetchActiveLivestreams: () => void,
};

export default function LivestreamList(props: Props) {
  const { activeLivestreams, fetchingActiveLivestreams, doFetchActiveLivestreams } = props;
  const livestreamUris = getLivestreamUris(activeLivestreams, null);

  React.useEffect(() => {
    doFetchActiveLivestreams();

    // doFetchActiveLivestreams is currently limited to 5 minutes per fetch as
    // a global default. If we want more frequent updates (say, to update the
    // view count), we can either change that limit, or add a 'force' parameter
    // to doFetchActiveLivestreams to override selectively.
    const fetchInterval = setInterval(doFetchActiveLivestreams, FETCH_ACTIVE_LIVESTREAMS_MIN_INTERVAL_MS + 50);
    return () => {
      clearInterval(fetchInterval);
    };
  }, []);

  return (
    <>
      {fetchingActiveLivestreams && (
        <div className="main--empty">
          <Spinner delayed />
        </div>
      )}
      {!fetchingActiveLivestreams && <ClaimList uris={livestreamUris} showNoSourceClaims tileLayout />}
    </>
  );
}
