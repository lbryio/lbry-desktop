// @flow
import React from 'react';
import UriIndicator from 'component/uriIndicator';
import DateTime from 'component/dateTime';
import Button from 'component/button';
import ChannelThumbnail from 'component/channelThumbnail';
import { parseURI } from 'lbry-redux';

type Props = {
  uri: string,
  claim: ?Claim,
  pending?: boolean,
  type: string,
  beginPublish: (string) => void,
};

function ClaimPreviewSubtitle(props: Props) {
  const { pending, uri, claim, type, beginPublish } = props;
  const claimsInChannel = (claim && claim.meta.claims_in_channel) || 0;
  const channelUri = claim && claim.signing_channel && claim.signing_channel.permanent_url;

  let isChannel;
  let name;
  try {
    ({ streamName: name, isChannel } = parseURI(uri));
  } catch (e) {}

  return (
    <div className="media__subtitle">
      {claim ? (
        <React.Fragment>
          {!isChannel && channelUri && type !== 'small' && <ChannelThumbnail uri={channelUri} />}
          <UriIndicator uri={uri} link />{' '}
          {!pending &&
            claim &&
            (isChannel ? (
              type !== 'inline' && `${claimsInChannel} ${claimsInChannel === 1 ? __('upload') : __('uploads')}`
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
