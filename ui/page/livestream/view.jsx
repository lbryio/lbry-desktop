// @flow
import { LIVE_STREAM_CHANNEL_CLAIM_ID, BITWAVE_API, BITWAVE_USERNAME } from 'constants/livestream';
import React from 'react';
import { Lbry } from 'lbry-redux';
import Page from 'component/page';
import LivestreamFeed from 'component/livestreamFeed';
import Spinner from 'component/spinner';
import Yrbl from 'component/yrbl';
import Button from 'component/button';
import analytics from 'analytics';

export default function LivestreamPage() {
  const [isFetching, setIsFetching] = React.useState(true);
  const [isReady, setIsReady] = React.useState(false);
  const [livestreamClaim, setLivestreamClaim] = React.useState(false);
  const uriFromLivestreamClaim = livestreamClaim && livestreamClaim.canonical_url;

  React.useEffect(() => {
    Lbry.claim_search({
      channel_ids: [LIVE_STREAM_CHANNEL_CLAIM_ID],
      any_tags: ['odysee-livestream'],
      claim_type: ['stream'],
    })
      .then(res => {
        if (res && res.items && res.items.length > 0) {
          const claim = res.items[0];
          setLivestreamClaim(claim);

          // Has livestream claim, check if they are live on bitwave
          fetch(`${BITWAVE_API}/${BITWAVE_USERNAME}`)
            .then(res => res.json())
            .then(res => {
              if (res && res.data && res.data.live) {
                setIsReady(true);
              } else {
                setIsReady(false);
              }

              setIsFetching(false);
            });
        } else {
          setIsFetching(false);
        }
      })
      .catch(() => {
        setIsFetching(false);
      });
  }, []);

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

  return (
    <Page className="file-page" filePage>
      {isFetching && (
        <div className="main--empty">
          <Spinner />
        </div>
      )}

      {!isFetching &&
        (isReady ? (
          <LivestreamFeed uri={uriFromLivestreamClaim} />
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
