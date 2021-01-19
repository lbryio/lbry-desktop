// @flow
import { LIVE_STREAM_CHANNEL_CLAIM_ID, BITWAVE_API, BITWAVE_USERNAME, BITWAVE_EMBED_URL } from 'constants/livestream';
import * as PAGES from 'constants/pages';
import React from 'react';
import Card from 'component/common/card';
import ClaimPreview from 'component/claimPreview';
import FileThumbnail from 'component/fileThumbnail';
import { Lbry } from 'lbry-redux';
import { useHistory } from 'react-router';

type Props = {};

export default function LivestreamLink(props: Props) {
  const [livestreamClaim, setLivestreamClaim] = React.useState(false);
  const [isLivestreaming, setIsLivestreaming] = React.useState(false);
  const { push } = useHistory();
  const livestreamClaimUrl = livestreamClaim && livestreamClaim.canonical_url;

  React.useEffect(() => {
    Lbry.claim_search({
      channel_ids: [LIVE_STREAM_CHANNEL_CLAIM_ID],
      any_tags: ['odysee-livestream'],
      claim_type: ['stream'],
    })
      .then(res => {
        if (res && res.items && res.items.length > 0) {
          const claim = res.items[0];
          console.log('claim', claim);
          setLivestreamClaim(claim);
        }
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    let interval;
    if (livestreamClaimUrl) {
      function fetchIsStreaming() {
        fetch(`${BITWAVE_API}/${BITWAVE_USERNAME}`)
          .then(res => res.json())
          .then(res => {
            if (res && res.data && res.data.live) {
              setIsLivestreaming(true);
            } else {
              setIsLivestreaming(false);
            }
          })
          .catch(e => {
            console.log('e', e);
          });
      }

      interval = setInterval(fetchIsStreaming, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [livestreamClaimUrl]);

  if (!livestreamClaimUrl || !isLivestreaming) {
    return null;
  }

  return (
    <>
      <Card
        onClick={() => push(`/$/${PAGES.LIVESTREAM}`)}
        className="livestream__channel-link"
        title="Live stream in progress"
        actions={<ClaimPreview uri={livestreamClaimUrl} livestream type="inline" />}
      />
    </>
  );
}
