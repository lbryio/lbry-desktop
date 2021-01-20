// @flow
import { LIVE_STREAM_CHANNEL_CLAIM_ID, LIVE_STREAM_TAG } from 'constants/livestream';
import React from 'react';
import UriIndicator from 'component/uriIndicator';
import DateTime from 'component/dateTime';
import Button from 'component/button';
import { parseURI } from 'lbry-redux';

type Props = {
  uri: string,
  claim: ?Claim,
  pending?: boolean,
  type: string,
  beginPublish: string => void,
  livestream?: boolean,
};

function ClaimPreviewSubtitle(props: Props) {
  const { pending, uri, claim, type, beginPublish } = props;
  const claimsInChannel = (claim && claim.meta.claims_in_channel) || 0;
  const isLivestream =
    claim &&
    claim.signing_channel &&
    claim.signing_channel.claim_id === LIVE_STREAM_CHANNEL_CLAIM_ID &&
    claim.value.tags &&
    claim.value.tags.includes(LIVE_STREAM_TAG);

  let isChannel;
  let name;
  try {
    ({ streamName: name, isChannel } = parseURI(uri));
  } catch (e) {}

  return (
    <div className="media__subtitle">
      {claim ? (
        <React.Fragment>
          <UriIndicator uri={uri} link />{' '}
          {!pending &&
            claim &&
            (isChannel ? (
              type !== 'inline' && `${claimsInChannel} ${claimsInChannel === 1 ? __('upload') : __('uploads')}`
            ) : isLivestream ? (
              <span>Livestream</span>
            ) : (
              <DateTime timeAgo uri={uri} />
            ))}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div>{__('Upload something and claim this spot!')}</div>
          <div className="card__actions">
            <Button onClick={() => beginPublish(name)} button="primary" label={__('Publish to %uri%', { uri })} />
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default ClaimPreviewSubtitle;
