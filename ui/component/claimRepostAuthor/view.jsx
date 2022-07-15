// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import UriIndicator from 'component/uriIndicator';
import Icon from 'component/common/icon';

type Props = {
  uri: string,
  claim: ?Claim,
  short: boolean,
};

function ClaimRepostAuthor(props: Props) {
  const { claim, short } = props;
  const repostChannelUrl = claim && claim.repost_channel_url;
  const repostUrl = claim && claim.repost_url;

  if (short && repostUrl) {
    return (
      <span className="claim-preview__repost-author">
        <div className="claim-preview__repost-ribbon">
          <Icon icon={ICONS.REPOST} size={12} />
          <br />
          <span>{repostUrl}</span>
        </div>
      </span>
    );
  }

  if (repostUrl && !repostChannelUrl) {
    return (
      <div className="claim-preview__repost-author">
        <div className="claim-preview__repost-ribbon">
          <Icon icon={ICONS.REPOST} size={10} className="claim-preview__repost-icon" />
          <br />
          {__('Anonymous')}
        </div>
      </div>
    );
  }
  if (!repostUrl) {
    return null;
  }

  return (
    <div className="claim-preview__repost-author">
      <div className="claim-preview__repost-ribbon">
        <Icon icon={ICONS.REPOST} size={10} className="claim-preview__repost-icon" />
        <br />
        <UriIndicator link uri={repostChannelUrl} showAtSign />
      </div>
    </div>
  );
}

export default ClaimRepostAuthor;
