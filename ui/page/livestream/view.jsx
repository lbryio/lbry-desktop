// @flow
import { LIVE_STREAM_CHANNEL_CLAIM_ID, LIVE_STREAM_TAG, BITWAVE_API, BITWAVE_USERNAME } from 'constants/livestream';
import React from 'react';
import { Lbry } from 'lbry-redux';
import Page from 'component/page';
import LivestreamFeed from 'component/livestreamFeed';
import Spinner from 'component/spinner';
import Yrbl from 'component/yrbl';
import Button from 'component/button';
import analytics from 'analytics';

type Props = {
  doSetPlayingUri: ({ uri: ?string }) => void,
};

export default function LivestreamPage(props: Props) {
  const { doSetPlayingUri } = props;
  const [isFetching, setIsFetching] = React.useState(true);
  const [isLive, setIsLive] = React.useState(false);
  const [displayCountdown, setDisplayCountdown] = React.useState(false);
  const [livestreamClaim, setLivestreamClaim] = React.useState(false);
  const [activeViewers, setActiveViewers] = React.useState(0);
  const uriFromLivestreamClaim = livestreamClaim && livestreamClaim.canonical_url;

  React.useEffect(() => {
    Lbry.claim_search({
      channel_ids: [LIVE_STREAM_CHANNEL_CLAIM_ID],
      any_tags: [LIVE_STREAM_TAG],
      claim_type: ['stream'],
    })
      .then(res => {
        if (res && res.items && res.items.length > 0) {
          const claim = res.items[0];
          setLivestreamClaim(claim);
        } else {
          setIsFetching(false);
        }
      })
      .catch(() => {
        setIsFetching(false);
      });
  }, []);

  React.useEffect(() => {
    function checkBitwave() {
      fetch(`${BITWAVE_API}/${BITWAVE_USERNAME}`)
        .then(res => res.json())
        .then(res => {
          if (!res || !res.data) {
            setIsLive(false);
            return;
          }

          setActiveViewers(res.data.viewCount);

          if (res.data.live) {
            setDisplayCountdown(false);
            setIsLive(true);
            setIsFetching(false);
            return;
          }

          // Not live, but see if we can display the countdown;
          const scheduledTime = res.data.scheduled;

          if (scheduledTime) {
            const scheduledDate = new Date(scheduledTime);
            const lastLiveTimestamp = res.data.timestamp;

            let isLivestreamOver = false;
            if (lastLiveTimestamp) {
              const timestampDate = new Date(lastLiveTimestamp);
              isLivestreamOver = timestampDate.getTime() > scheduledDate.getTime();
            }

            if (isLivestreamOver) {
              setDisplayCountdown(false);
              setIsLive(false);
            } else {
              const datePlusTenMinuteBuffer = scheduledDate.setMinutes(10, 0, 0);
              const isInFuture = Date.now() < datePlusTenMinuteBuffer;

              if (isInFuture) {
                setDisplayCountdown(true);
                setIsLive(false);
              } else {
                setDisplayCountdown(false);
                setIsLive(false);
              }
            }

            setIsFetching(false);
          } else {
            // Offline and no countdown happening
            setIsLive(false);
            setDisplayCountdown(false);
            setActiveViewers(0);
            setIsFetching(false);
          }
        });
    }

    let interval;
    checkBitwave();
    if (uriFromLivestreamClaim) {
      interval = setInterval(checkBitwave, 10000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [uriFromLivestreamClaim]);

  const stringifiedClaim = JSON.stringify(livestreamClaim);
  React.useEffect(() => {
    if (uriFromLivestreamClaim && stringifiedClaim) {
      const jsonClaim = JSON.parse(stringifiedClaim);

      if (jsonClaim) {
        const { txid, nout, claim_id: claimId } = jsonClaim;
        const outpoint = `${txid}:${nout}`;

        analytics.apiLogView(uriFromLivestreamClaim, outpoint, claimId);
      }
    }
  }, [uriFromLivestreamClaim, stringifiedClaim]);

  React.useEffect(() => {
    // Set playing uri to null so the popout player doesnt start playing the dummy claim if a user navigates back
    doSetPlayingUri({ uri: null });
  }, [doSetPlayingUri]);

  return (
    <Page className="file-page" filePage livestream>
      {isFetching && (
        <div className="main--empty">
          <Spinner />
        </div>
      )}

      {!isFetching &&
        (isLive || displayCountdown ? (
          <>
            {/* Use two components to ensure the iframe is reset entirely when the real livestream starts */}
            {displayCountdown && <LivestreamFeed uri={uriFromLivestreamClaim} />}
            {isLive && <LivestreamFeed uri={uriFromLivestreamClaim} activeViewers={activeViewers} />}
          </>
        ) : (
          <section className="main--empty">
            <Yrbl
              title={__('Nothing going on here right now')}
              subtitle={__('Check back later for a surprise!')}
              actions={
                <div className="section__actions">
                  <Button button="primary" label={__('Go Home')} navigate={`/`} />
                </div>
              }
            />
          </section>
        ))}
    </Page>
  );
}
