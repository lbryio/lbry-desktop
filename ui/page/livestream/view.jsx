// @flow
import { LIVESTREAM_LIVE_API } from 'constants/livestream';
import analytics from 'analytics';
import LivestreamComments from 'component/livestreamComments';
import LivestreamLayout from 'component/livestreamLayout';
import Page from 'component/page';
import React from 'react';

const STREAMING_POLL_INTERVAL_IN_MS = 10000;
const LIVESTREAM_CLAIM_POLL_IN_MS = 60000;

type Props = {
  channelClaim: ChannelClaim,
  chatDisabled: boolean,
  claim: StreamClaim,
  isAuthenticated: boolean,
  uri: string,
  clearPlayingUri: () => void,
  doClaimSearch: (any, (ClaimSearchResponse) => void) => void,
  setReferrer: (string) => void,
};

export default function LivestreamPage(props: Props) {
  const {
    channelClaim,
    chatDisabled,
    claim,
    isAuthenticated,
    uri,
    clearPlayingUri,
    doClaimSearch,
    setReferrer,
  } = props;

  const [isLive, setIsLive] = React.useState(false);
  const [hasLivestreamClaim, setHasLivestreamClaim] = React.useState(false);

  const livestreamChannelId = channelClaim && channelClaim.signing_channel && channelClaim.signing_channel.claim_id;
  const stringifiedClaim = JSON.stringify(claim);

  React.useEffect(() => {
    let checkClaimsInterval;

    function checkHasLivestreamClaim() {
      doClaimSearch({ channel_ids: [livestreamChannelId], has_no_source: true, claim_type: ['stream'] }, (data) =>
        data && data.items && data.items.length > 0 ? setHasLivestreamClaim(true) : undefined
      );
    }

    if (livestreamChannelId && !isLive) {
      if (!checkClaimsInterval) checkHasLivestreamClaim();
      checkClaimsInterval = setInterval(checkHasLivestreamClaim, LIVESTREAM_CLAIM_POLL_IN_MS);

      return () => (checkClaimsInterval ? clearInterval(checkClaimsInterval) : undefined);
    }
  }, [livestreamChannelId, isLive, doClaimSearch]);

  React.useEffect(() => {
    let interval;

    function checkIsLive() {
      // TODO: duplicate code below
      // $FlowFixMe livestream API can handle garbage
      fetch(`${LIVESTREAM_LIVE_API}/${livestreamChannelId}`)
        .then((res) => res.json())
        .then((res) =>
          !res || !res.data ? setIsLive(false) : res.data.hasOwnProperty('live') && setIsLive(res.data.live)
        );
    }

    if (livestreamChannelId && hasLivestreamClaim) {
      if (!interval) checkIsLive();
      interval = setInterval(checkIsLive, STREAMING_POLL_INTERVAL_IN_MS);

      return () => (interval ? clearInterval(interval) : undefined);
    }
  }, [livestreamChannelId, hasLivestreamClaim]);

  React.useEffect(() => {
    if (uri && stringifiedClaim) {
      const jsonClaim = JSON.parse(stringifiedClaim);

      if (jsonClaim) {
        const { txid, nout, claim_id: claimId } = jsonClaim;
        const outpoint = `${txid}:${nout}`;

        analytics.apiLogView(uri, outpoint, claimId);
      }

      if (!isAuthenticated) {
        const uri = jsonClaim.signing_channel && jsonClaim.signing_channel.permanent_url;
        if (uri) setReferrer(uri.replace('lbry://', ''));
      }
    }
  }, [uri, stringifiedClaim, isAuthenticated, setReferrer]);

  React.useEffect(() => {
    // Set playing uri to null so the popout player doesnt start playing the dummy claim if a user navigates back
    // This can be removed when we start using the app video player, not a LIVESTREAM iframe
    clearPlayingUri();
  }, [clearPlayingUri]);

  return (
    <Page
      className="file-page"
      noFooter
      livestream
      chatDisabled={chatDisabled}
      rightSide={!chatDisabled && <LivestreamComments uri={uri} />}
    >
      <LivestreamLayout uri={uri} isLive={isLive} />
    </Page>
  );
}
