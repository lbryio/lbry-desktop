// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import I18nMessage from 'component/i18nMessage';
import UriIndicator from 'component/uriIndicator';
import Icon from 'component/common/icon';

type Props = {
  uri: string,
  claim: ?Claim,
};

function ClaimRepostAuthor(props: Props) {
  const { claim } = props;
  const repostChannelUrl = claim && claim.repost_channel_url;

  if (!repostChannelUrl) {
    return null;
  }

  return (
    <div className="claim-preview__repost-author">
      <Icon icon={ICONS.REPOST} size={10} />
      <I18nMessage tokens={{ repost_channel_link: <UriIndicator link uri={repostChannelUrl} /> }}>
        %repost_channel_link% reposted
      </I18nMessage>
    </div>
  );
}

export default ClaimRepostAuthor;
