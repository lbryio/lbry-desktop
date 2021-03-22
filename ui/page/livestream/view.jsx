// @flow
import { BITWAVE_API } from 'constants/livestream';
import React from 'react';
import Page from 'component/page';
import LivestreamLayout from 'component/livestreamLayout';
import analytics from 'analytics';

type Props = {
  uri: string,
  claim: StreamClaim,
  doSetPlayingUri: ({ uri: ?string }) => void,
  isAuthenticated: boolean,
  doUserSetReferrer: (string) => void,
  channelClaim: ChannelClaim,
};

export default function LivestreamPage(props: Props) {
  const { uri, claim, doSetPlayingUri, isAuthenticated, doUserSetReferrer, channelClaim } = props;
  const [activeViewers, setActiveViewers] = React.useState(0);
  const [isLive, setIsLive] = React.useState(false);
  const livestreamChannelId = channelClaim && channelClaim.signing_channel && channelClaim.signing_channel.claim_id;

  React.useEffect(() => {
    function checkIsLive() {
      // $FlowFixMe Bitwave's API can handle garbage
      fetch(`${BITWAVE_API}/${livestreamChannelId}`)
        .then((res) => res.json())
        .then((res) => {
          if (!res || !res.data) {
            setIsLive(false);
            return;
          }

          setActiveViewers(res.data.viewCount);

          if (res.data.hasOwnProperty('live')) {
            setIsLive(res.data.live);
          }
        });
    }

    let interval;
    if (livestreamChannelId) {
      if (!interval) checkIsLive();
      interval = setInterval(checkIsLive, 10 * 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [livestreamChannelId]);

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
    // This can be removed when we start using the app video player, not a bitwave iframe
    doSetPlayingUri({ uri: null });
  }, [doSetPlayingUri]);

  return (
    <Page className="file-page" filePage livestream>
      <LivestreamLayout uri={uri} activeViewers={activeViewers} isLive={isLive} />
    </Page>
  );
}
