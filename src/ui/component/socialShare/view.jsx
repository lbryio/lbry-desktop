// @flow
import type { Claim } from 'types/claim';
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import CopyableText from 'component/copyableText';
import ToolTip from 'component/common/tooltip';

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
    const { claim_id: claimId, name: claimName, channel_name: channelName, value } = claim;

    const { speechShareable, onDone } = this.props;
    const channelClaimId =
      value && value.publisherSignature && value.publisherSignature.certificateId;
    const speechPrefix = 'https://spee.ch/';
    const lbryPrefix = 'https://open.lbry.com/';

    let speechURL;
    let lbryURL;
    if (isChannel) {
      // For channel claims, the channel name (@something) is in `claim.name`
      speechURL = `${claimName}:${claimId}`;
      lbryURL = `${claimName}#${claimId}`;
    } else {
      // If it's for a regular claim, check if it has an associated channel
      speechURL =
        channelName && channelClaimId
          ? `${channelName}:${channelClaimId}/${claimName}`
          : `${claimId}/${claimName}`;

      lbryURL =
        channelName && channelClaimId
          ? `${channelName}#${channelClaimId}/${claimName}`
          : `${claimName}#${claimId}`;
    }

    if (lbryURL) {
      lbryURL = `${lbryPrefix}${encodeURIComponent(lbryURL)}`;
    }

    if (speechURL) {
      speechURL = `${speechPrefix}${encodeURIComponent(speechURL)}`;
    }

    return (
      <React.Fragment>
        {speechShareable && (
          <div className="card__content">
            <label className="card__subtitle">{__('Web link')}</label>
            <CopyableText copyable={speechURL} />
            <div className="card__actions card__actions--center">
              <ToolTip onComponent body={__('Facebook')}>
                <Button
                  iconColor="blue"
                  icon={ICONS.FACEBOOK}
                  button="alt"
                  label={__('')}
                  href={`https://facebook.com/sharer/sharer.php?u=${speechURL}`}
                />
              </ToolTip>
              <ToolTip onComponent body={__('Twitter')}>
                <Button
                  iconColor="blue"
                  icon={ICONS.TWITTER}
                  button="alt"
                  label={__('')}
                  href={`https://twitter.com/home?status=${speechURL}`}
                />
              </ToolTip>
              <ToolTip onComponent body={__('View on Spee.ch')}>
                <Button
                  icon={ICONS.WEB}
                  iconColor="blue"
                  button="alt"
                  label={__('')}
                  href={`${speechURL}`}
                />
              </ToolTip>
            </div>
          </div>
        )}
        <div className="card__content">
          <label className="card__subtitle">{__('LBRY App link')}</label>
          <CopyableText copyable={lbryURL} noSnackbar />
          <div className="card__actions card__actions--center">
            <ToolTip onComponent body={__('Facebook')}>
              <Button
                iconColor="blue"
                icon={ICONS.FACEBOOK}
                button="alt"
                label={__('')}
                href={`https://facebook.com/sharer/sharer.php?u=${lbryURL}`}
              />
            </ToolTip>
            <ToolTip onComponent body={__('Twitter')}>
              <Button
                iconColor="blue"
                icon={ICONS.TWITTER}
                button="alt"
                label={__('')}
                href={`https://twitter.com/home?status=${lbryURL}`}
              />
            </ToolTip>
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
