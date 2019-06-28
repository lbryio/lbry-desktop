// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import CopyableText from 'component/copyableText';

type Props = {
  claim: Claim,
  onDone: () => void,
  speechShareable: boolean,
  isChannel: boolean,
};

class SocialShare extends React.PureComponent<Props> {
  static defaultProps = {
    isChannel: false,
  };

  constructor(props: Props) {
    super(props);

    this.input = undefined;
  }

  input: ?HTMLInputElement;

  render() {
    const { claim, isChannel } = this.props;
    const { claim_id: claimId, name: claimName } = claim;

    const { speechShareable, onDone } = this.props;
    const signingChannel = claim.signing_channel;
    const channelClaimId = signingChannel && signingChannel.claim_id;
    const channelName = signingChannel && signingChannel.name;

    const getLbryTvUri = (): string => {
      return `${claimName}/${claimId}`;
    };

    const getLbryUri = (): string => {
      if (isChannel) {
        // For channel claims, the channel name (@something) is in `claim.name`
        return `${claimName}#${claimId}`;
      } else {
        // If it's for a regular claim, check if it has an associated channel
        return channelName && channelClaimId
          ? `${channelName}#${channelClaimId}/${claimName}`
          : `${claimName}#${claimId}`;
      }
    };

    const lbryTvPrefix = 'https://beta.lbry.tv/';
    const lbryPrefix = 'https://open.lbry.com/';
    const lbryUri = getLbryUri();
    const lbryTvUri = getLbryTvUri();
    const encodedLbryURL: string = `${lbryPrefix}${encodeURIComponent(lbryUri)}`;
    const lbryURL: string = `${lbryPrefix}${getLbryUri()}`;
    const encodedLbryTvUrl = `${lbryTvPrefix}${encodeURIComponent(lbryTvUri)}`;
    const lbryTvUrl = `${lbryTvPrefix}${lbryTvUri}`;

    const shareOnFb = __('Share on Facebook');
    const shareOnTwitter = __('Share On Twitter');

    return (
      <React.Fragment>
        {speechShareable && (
          <div className="card__content">
            <label className="card__subtitle">{__('Web link')}</label>
            <CopyableText copyable={lbryTvUrl} />
            <div className="card__actions card__actions--center">
              <Button
                icon={ICONS.FACEBOOK}
                button="link"
                description={shareOnFb}
                href={`https://facebook.com/sharer/sharer.php?u=${encodedLbryTvUrl}`}
              />
              <Button
                icon={ICONS.TWITTER}
                button="link"
                description={shareOnTwitter}
                href={`https://twitter.com/home?status=${encodedLbryTvUrl}`}
              />
              <Button icon={ICONS.WEB} button="link" description={__('View on lbry.tv')} href={`${lbryTvUrl}`} />
            </div>
          </div>
        )}
        <div className="card__content">
          <label className="card__subtitle">{__('LBRY App link')}</label>
          <CopyableText copyable={lbryURL} noSnackbar />
          <div className="card__actions card__actions--center">
            <Button
              icon={ICONS.FACEBOOK}
              button="link"
              description={shareOnFb}
              href={`https://facebook.com/sharer/sharer.php?u=${encodedLbryURL}`}
            />
            <Button
              icon={ICONS.TWITTER}
              button="link"
              description={shareOnTwitter}
              href={`https://twitter.com/home?status=${encodedLbryURL}`}
            />
          </div>
        </div>
        <div className="card__actions">
          <Button button="link" label={__('Done')} onClick={onDone} />
        </div>
      </React.Fragment>
    );
  }
}

export default SocialShare;
