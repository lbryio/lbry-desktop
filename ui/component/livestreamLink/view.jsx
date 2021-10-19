// @flow
import { LIVESTREAM_LIVE_API } from 'constants/livestream';
import * as CS from 'constants/claim_search';
import React from 'react';
import Card from 'component/common/card';
import ClaimPreview from 'component/claimPreview';
import Lbry from 'lbry';
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
  // TODO: pput this back when hubs claims_in_channel are fixed
  const isChannelEmpty = !channelClaim || !channelClaim.meta;
  // ||
  // !channelClaim.meta.claims_in_channel;

  React.useEffect(() => {
    // Don't search empty channels
    if (livestreamChannelId && !isChannelEmpty) {
      Lbry.claim_search({
        channel_ids: [livestreamChannelId],
        page: 1,
        page_size: 1,
        no_totals: true,
        has_no_source: true,
        claim_type: ['stream'],
        order_by: CS.ORDER_BY_NEW_VALUE,
      })
        .then((res) => {
          if (res && res.items && res.items.length > 0) {
            const claim = res.items[0];
            // $FlowFixMe Too many Claim GenericClaim etc types.
            setLivestreamClaim(claim);
          }
        })
        .catch(() => {});
    }
  }, [livestreamChannelId, isChannelEmpty]);

  React.useEffect(() => {
    function fetchIsStreaming() {
      // $FlowFixMe livestream API can handle garbage
      fetch(`${LIVESTREAM_LIVE_API}/${livestreamChannelId}`)
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
    // Only call livestream api if channel has livestream claims
    if (livestreamChannelId && livestreamClaim) {
      if (!interval) fetchIsStreaming();
      interval = setInterval(fetchIsStreaming, 10 * 1000);
    }
    // Prevent any more api calls on update
    if (!livestreamChannelId || !livestreamClaim) {
      if (interval) {
        clearInterval(interval);
      }
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [livestreamChannelId, livestreamClaim]);

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
