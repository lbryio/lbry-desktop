// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import I18nMessage from 'component/i18nMessage';
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
        <div className="claim-preview__repost-ribbon claim-preview__repost-ribbon--anon">
          <Icon icon={ICONS.REPOST} size={10} />
          <span>
            <I18nMessage
              tokens={{
                anonymous: <strong>{__('Anon --[used in <%anonymous% Reposted>]--')}</strong>,
              }}
            >
              %anonymous%
            </I18nMessage>
          </span>
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
        <I18nMessage tokens={{ repost_channel_link: <UriIndicator link uri={repostChannelUrl} /> }}>
          %repost_channel_link%
        </I18nMessage>
      </div>
    </div>
  );
}

export default ClaimRepostAuthor;
