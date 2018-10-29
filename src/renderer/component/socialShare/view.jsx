// @flow
import React from 'react';
import type { Claim } from 'types/claim';
import Button from 'component/button';
import * as icons from 'constants/icons';
import CopyableText from 'component/copyableText';
import ToolTip from 'component/common/tooltip';

type Props = {
  claim: Claim,
  onDone: () => void,
  speechShareable: boolean,
};

class SocialShare extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    this.input = undefined;
  }

  input: ?HTMLInputElement;

  render() {
    const {
      claim_id: claimId,
      name: claimName,
      channel_name: channelName,
      value,
    } = this.props.claim;
    const { speechShareable, onDone } = this.props;
    const channelClaimId =
      value && value.publisherSignature && value.publisherSignature.certificateId;
    const speechPrefix = 'https://spee.ch/';
    const lbryPrefix = 'https://open.lbry.io/';

    const speechURL =
      channelName && channelClaimId
        ? `${speechPrefix}${channelName}:${channelClaimId}/${claimName}`
        : `${speechPrefix}${claimName}#${claimId}`;

    const lbryURL = `${lbryPrefix}${claimName}#${claimId}`;

    return (
      <section className="card__content">
        {speechShareable && (
          <div className="card__content">
            <label className="card__subtitle">{__('Web link')}</label>
            <CopyableText copyable={speechURL} />
            <div className="card__actions card__actions--center">
              <ToolTip onComponent body={__('Facebook')}>
                <Button
                  iconColor="blue"
                  icon={icons.FACEBOOK}
                  button="alt"
                  label={__('')}
                  href={`https://facebook.com/sharer/sharer.php?u=${speechURL}`}
                />
              </ToolTip>
              <ToolTip onComponent body={__('Twitter')}>
                <Button
                  iconColor="blue"
                  icon={icons.TWITTER}
                  button="alt"
                  label={__('')}
                  href={`https://twitter.com/home?status=${speechURL}`}
                />
              </ToolTip>
              <ToolTip onComponent body={__('View on Spee.ch')}>
                <Button
                  icon={icons.GLOBE}
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
                icon={icons.FACEBOOK}
                button="alt"
                label={__('')}
                href={`https://facebook.com/sharer/sharer.php?u=${lbryURL}`}
              />
            </ToolTip>
            <ToolTip onComponent body={__('Twitter')}>
              <Button
                iconColor="blue"
                icon={icons.TWITTER}
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
      </section>
    );
  }
}

export default SocialShare;
