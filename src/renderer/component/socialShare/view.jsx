// @flow
import React from 'react';
import type { Claim } from 'types/claim';
import Button from 'component/button';
import { clipboard } from 'electron';
import { FormRow } from 'component/common/form';
import * as icons from 'constants/icons';
import Tooltip from 'component/common/tooltip';

// import Button from 'component/button';
// import { FormField } from 'component/common/form';

type Props = {
  claim: Claim,
  onDone: () => void,
};

// the only reason I can think of for <..,State> is to count times shared
class SocialShare extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    this.input = undefined;
  }

  input: ?HTMLInputElement;

  render() {
    const { claim_id: claimId, name: claimName, channel_name: channelName } = this.props.claim;
    const { onDone } = this.props;
    const speechPrefix = 'http://spee.ch/';
    const speechURL = channelName
      ? `${speechPrefix}${channelName}/${claimName}`
      : `${speechPrefix}${claimName}#${claimId}`;

    return (
      <div>
        <div className="card__title">
          <h3>{__('Share')}</h3>
          <div className="card__content">
            <FormRow verticallyCentered padded stretch>
              <input
                className="input-copyable form-field__input"
                readOnly
                value={speechURL || ''}
                ref={input => {
                  this.input = input;
                }}
                onFocus={() => {
                  if (this.input) {
                    this.input.select();
                  }
                }}
              />
              <Button
                noPadding
                button="secondary"
                icon={icons.CLIPBOARD}
                onClick={() => {
                  clipboard.writeText(speechURL);
                }}
              />
            </FormRow>
          </div>
          <div className="card__content">
            <Tooltip onComponent body={__('Post on Facebook')}>
              <Button
                className="btn"
                icon={icons.FACEBOOK}
                button="alt"
                label={__('')}
                href={`https://facebook.com/sharer/sharer.php?u=${speechURL}`}
              />
            </Tooltip>
            <Tooltip onComponent body={__('Tweet on Twitter')}>
              <Button
                icon={icons.TWITTER}
                button="alt"
                label={__('')}
                href={`https://twitter.com/home?status=${speechURL}`}
              />
            </Tooltip>
            <Tooltip onComponent body={__('Post on Google Plus')}>
              <Button
                icon={icons.GOOGLE_PLUS}
                button="alt"
                label={__('')}
                href={`https://plus.google.com/share?url=${speechURL}`}
              />
            </Tooltip>
            <Tooltip onComponent body={__('View on Spee.ch')}>
              <Button icon={icons.GLOBE} button="alt" label={__('')} href={`${speechURL}`} />
            </Tooltip>
          </div>
          <div className="card__actions">
            {/* button that shares to facebook */}
            <Button button="primary" label={__('Done')} onClick={onDone} />
          </div>
        </div>
      </div>
    );
  }
}

export default SocialShare;
