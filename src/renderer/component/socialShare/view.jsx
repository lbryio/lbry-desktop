// @flow
import React from 'react';
import type { Claim } from 'types/claim';
import Button from 'component/button';
import * as icons from 'constants/icons';
import Tooltip from 'component/common/tooltip';
import Address from 'component/address';

type Props = {
  claim: Claim,
  onDone: () => void,
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
    const channelClaimId =
      value && value.publisherSignature && value.publisherSignature.certificateId;
    const { onDone } = this.props;
    const speechPrefix = 'http://spee.ch/';
    const speechURL =
      channelName && channelClaimId
        ? `${speechPrefix}${channelName}:${channelClaimId}/${claimName}`
        : `${speechPrefix}${claimName}#${claimId}`;

    return (
      <section className="card__content">
        <Address address={speechURL} noSnackbar />
        <div className="card__actions card__actions--center">
          <Tooltip onComponent body={__('Facebook')}>
            <Button
              iconColor="blue"
              icon={icons.FACEBOOK}
              button="alt"
              label={__('')}
              href={`https://facebook.com/sharer/sharer.php?u=${speechURL}`}
            />
          </Tooltip>
          <Tooltip onComponent body={__('Twitter')}>
            <Button
              iconColor="blue"
              icon={icons.TWITTER}
              button="alt"
              label={__('')}
              href={`https://twitter.com/home?status=${speechURL}`}
            />
          </Tooltip>
          <Tooltip onComponent body={__('View on Spee.ch')}>
            <Button
              icon={icons.GLOBE}
              iconColor="blue"
              button="alt"
              label={__('')}
              href={`${speechURL}`}
            />
          </Tooltip>
        </div>
        <div className="card__actions">
          <Button button="link" label={__('Done')} onClick={onDone} />
        </div>
      </section>
    );
  }
}

export default SocialShare;
