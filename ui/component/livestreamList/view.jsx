// @flow
import * as ICONS from 'constants/icons';
import { BITWAVE_LIVE_API } from 'constants/livestream';
import React from 'react';
import Icon from 'component/common/icon';
import Spinner from 'component/spinner';
import ClaimTilesDiscover from 'component/claimTilesDiscover';

const LIVESTREAM_POLL_IN_MS = 10 * 1000;

export default function LivestreamList() {
  const [loading, setLoading] = React.useState(true);
  const [livestreamMap, setLivestreamMap] = React.useState();

  React.useEffect(() => {
    function checkCurrentLivestreams() {
      fetch(BITWAVE_LIVE_API)
        .then((res) => res.json())
        .then((res) => {
          setLoading(false);
          if (!res.data) {
            setLivestreamMap({});
            return;
          }

          const livestreamMap = res.data.reduce((acc, curr) => {
            return {
              ...acc,
              [curr.claimId]: curr,
            };
          }, {});

          setLivestreamMap(livestreamMap);
        })
        .catch((err) => {
          setLoading(false);
        });
    }

    checkCurrentLivestreams();
    let fetchInterval = setInterval(checkCurrentLivestreams, LIVESTREAM_POLL_IN_MS);
    return () => {
      if (fetchInterval) {
        clearInterval(fetchInterval);
      }
    };
  }, []);

  return (
    <>
      {loading && (
        <div className="main--empty">
          <Spinner delayed />
        </div>
      )}

      {livestreamMap && Object.keys(livestreamMap).length > 0 && (
        <ClaimTilesDiscover
          hasNoSource
          streamTypes={null}
          channelIds={Object.keys(livestreamMap)}
          limitClaimsPerChannel={1}
          renderProperties={(claim) => {
            const livestream = livestreamMap[claim.signing_channel.claim_id];

            return (
              <span className="livestream__viewer-count">
                {livestream.viewCount} <Icon icon={ICONS.EYE} />
              </span>
            );
          }}
        />
      )}
    </>
  );
}
