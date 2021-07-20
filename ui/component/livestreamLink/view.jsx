// @flow
import { BITWAVE_LIVE_API } from 'constants/livestream';
import * as CS from 'constants/claim_search';
import React from 'react';
import Card from 'component/common/card';
import ClaimPreview from 'component/claimPreview';
import { Lbry } from 'lbry-redux';
import { useHistory } from 'react-router';
import { formatLbryUrlForWeb } from 'util/url';

type Props = {
  channelClaim: ChannelClaim,
};

export default function LivestreamLink(props: Props) {
  const { channelClaim } = props;
  const { push } = useHistory();
  const [livestreamClaim, setLivestreamClaim] = React.useState(false);
  const [isLivestreaming, setIsLivestreaming] = React.useState(false);
  const livestreamChannelId = (channelClaim && channelClaim.claim_id) || ''; // TODO: fail in a safer way, probably

  React.useEffect(() => {
    if (livestreamChannelId) {
      Lbry.claim_search({
        channel_ids: [livestreamChannelId],
        has_no_source: true,
        claim_type: ['stream'],
        order_by: CS.ORDER_BY_NEW_VALUE,
      })
        .then((res) => {
          if (res && res.items && res.items.length > 0) {
            const claim = res.items[0];
            setLivestreamClaim(claim);
          }
        })
        .catch(() => {});
    }
  }, [livestreamChannelId]);

  React.useEffect(() => {
    function fetchIsStreaming() {
      // $FlowFixMe Bitwave's API can handle garbage
      fetch(`${BITWAVE_LIVE_API}/${livestreamChannelId}`)
        .then((res) => res.json())
        .then((res) => {
          if (res && res.success && res.data && res.data.live) {
            setIsLivestreaming(true);
          } else {
            setIsLivestreaming(false);
          }
        })
        .catch((e) => {});
    }

    let interval;
    if (livestreamChannelId) {
      if (!interval) fetchIsStreaming();
      interval = setInterval(fetchIsStreaming, 10 * 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [livestreamChannelId]);

  if (!livestreamClaim || !isLivestreaming) {
    return null;
  }

  // gonna pass the wrapper in so I don't have to rewrite the dmca/blocking logic in claimPreview.
  const element = (props: { children: any }) => (
    <Card
      className="livestream__channel-link"
      title={__('Live stream in progress')}
      onClick={() => {
        push(formatLbryUrlForWeb(livestreamClaim.canonical_url));
      }}
    >
      {props.children}
    </Card>
  );

  return <ClaimPreview uri={livestreamClaim.canonical_url} wrapperElement={element} type="inline" />;
}
