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
};

export default function LivestreamPage(props: Props) {
  const { uri, claim, doSetPlayingUri, isAuthenticated, doUserSetReferrer } = props;
  const [activeViewers, setActiveViewers] = React.useState(0);
  const [isLive, setIsLive] = React.useState(false);

  React.useEffect(() => {
    function checkIsLive() {
      fetch(`${BITWAVE_API}/MarkPugner`)
        .then((res) => res.json())
        .then((res) => {
          if (!res || !res.data) {
            setIsLive(false);
            return;
          }

          setActiveViewers(res.data.viewCount);

          if (res.data.live) {
            setIsLive(true);
          }
        });
    }

    let interval;
    checkIsLive();
    if (uri) {
      interval = setInterval(checkIsLive, 10000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [uri]);

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
