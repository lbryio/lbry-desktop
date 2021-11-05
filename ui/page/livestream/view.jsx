// @flow
import React from 'react';
import Page from 'component/page';
import LivestreamLayout from 'component/livestreamLayout';
import LivestreamComments from 'component/livestreamComments';
import analytics from 'analytics';
import Lbry from 'lbry';
import watchLivestreamStatus from '$web/src/livestreaming/long-polling';

type Props = {
  uri: string,
  claim: StreamClaim,
  doSetPlayingUri: ({ uri: ?string }) => void,
  isAuthenticated: boolean,
  doUserSetReferrer: (string) => void,
  channelClaim: ChannelClaim,
  chatDisabled: boolean,
};

export default function LivestreamPage(props: Props) {
  const { uri, claim, doSetPlayingUri, isAuthenticated, doUserSetReferrer, channelClaim, chatDisabled } = props;
  const [isLive, setIsLive] = React.useState(false);
  const livestreamChannelId = channelClaim && channelClaim.signing_channel && channelClaim.signing_channel.claim_id;
  const [hasLivestreamClaim, setHasLivestreamClaim] = React.useState(false);

  const LIVESTREAM_CLAIM_POLL_IN_MS = 60000;

  React.useEffect(() => {
    let checkClaimsInterval;
    function checkHasLivestreamClaim() {
      Lbry.claim_search({
        channel_ids: [livestreamChannelId],
        has_no_source: true,
        claim_type: ['stream'],
      })
        .then((res) => {
          if (res && res.items && res.items.length > 0) {
            setHasLivestreamClaim(true);
          }
        })
        .catch(() => {});
    }
    if (livestreamChannelId && !isLive) {
      if (!checkClaimsInterval) checkHasLivestreamClaim();
      checkClaimsInterval = setInterval(checkHasLivestreamClaim, LIVESTREAM_CLAIM_POLL_IN_MS);

      return () => {
        if (checkClaimsInterval) {
          clearInterval(checkClaimsInterval);
        }
      };
    }
  }, [livestreamChannelId, isLive]);

  React.useEffect(() => {
    if (!hasLivestreamClaim || !livestreamChannelId) return;
    return watchLivestreamStatus(livestreamChannelId, (state) => setIsLive(state));
  }, [livestreamChannelId, setIsLive, hasLivestreamClaim]);

  const stringifiedClaim = JSON.stringify(claim);
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
        if (uri) {
          doUserSetReferrer(uri.replace('lbry://', ''));
        }
      }
    }
  }, [uri, stringifiedClaim, isAuthenticated]);

  React.useEffect(() => {
    // Set playing uri to null so the popout player doesnt start playing the dummy claim if a user navigates back
    // This can be removed when we start using the app video player, not a LIVESTREAM iframe
    doSetPlayingUri({ uri: null });
  }, [doSetPlayingUri]);

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
