// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import CopyableText from 'component/copyableText';
import Tooltip from 'component/common/tooltip';

type Props = {
  claim: StreamClaim,
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
    const { claim_id: claimId, name: claimName, channel_name: channelName } = claim;

    const { speechShareable, onDone } = this.props;
    const channelClaimId = claim.signing_channel && claim.signing_channel.claim_id;

    const getSpeechUri = (): string => {
      if (isChannel) {
        // For channel claims, the channel name (@something) is in `claim.name`
        return `${claimName}:${claimId}`;
      } else {
        // If it's for a regular claim, check if it has an associated channel
        return channelName && channelClaimId
          ? `${channelName}:${channelClaimId}/${claimName}`
          : `${claimId}/${claimName}`;
      }
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

    const speechPrefix = 'https://spee.ch/';
    const lbryPrefix = 'https://open.lbry.com/';
    const lbryUri = getLbryUri();
    const speechUri = getSpeechUri();
    const encodedLbryURL: string = `${lbryPrefix}${encodeURIComponent(lbryUri)}`;
    const lbryURL: string = `${lbryPrefix}${getLbryUri()}`;

    const encodedSpeechURL = `${speechPrefix}${encodeURIComponent(speechUri)}`;
    const speechURL = `${speechPrefix}${speechUri}`;

    return (
      <React.Fragment>
        {speechShareable && (
          <div className="card__content">
            <label className="help">{__('Web link')}</label>
            <CopyableText copyable={speechURL} />
            <div className="card__actions card__actions--center">
              <Tooltip label={__('Facebook')}>
                <Button
                  iconColor="blue"
                  icon={ICONS.FACEBOOK}
                  button="alt"
                  label={__('')}
                  href={`https://facebook.com/sharer/sharer.php?u=${encodedSpeechURL}`}
                />
              </Tooltip>
              <Tooltip label={__('Twitter')}>
                <Button
                  iconColor="blue"
                  icon={ICONS.TWITTER}
                  button="alt"
                  label={__('')}
                  href={`https://twitter.com/home?status=${encodedSpeechURL}`}
                />
              </Tooltip>
              <Tooltip label={__('View on Spee.ch')}>
                <Button icon={ICONS.WEB} iconColor="blue" button="alt" label={__('')} href={`${speechURL}`} />
              </Tooltip>
            </div>
          </div>
        )}
        <div className="card__content">
          <label className="help">{__('LBRY App link')}</label>
          <CopyableText copyable={lbryURL} noSnackbar />
          <div className="card__actions card__actions--center">
            <Tooltip label={__('Facebook')}>
              <Button
                iconColor="blue"
                icon={ICONS.FACEBOOK}
                button="alt"
                label={__('')}
                href={`https://facebook.com/sharer/sharer.php?u=${encodedLbryURL}`}
              />
            </Tooltip>
            <Tooltip label={__('Twitter')}>
              <Button
                iconColor="blue"
                icon={ICONS.TWITTER}
                button="alt"
                label={__('')}
                href={`https://twitter.com/home?status=${encodedLbryURL}`}
              />
            </Tooltip>
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
