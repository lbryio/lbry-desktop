// @flow
import React from 'react';
import Button from 'component/button';
import { FormField } from 'component/common/form';
import UriIndicator from 'component/uriIndicator';
import type { Claim } from 'types/claim';

type Props = {
  uri: string,
  title: string,
  claim: Claim,
  isPending: boolean,
  sendSupport: (number, string, string) => void,
  onCancel: () => void,
  sendTipCallback?: () => void,
  balance: number,
};

type State = {
  tipAmount: number,
  newTipError: string,
};

class WalletSendTip extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      tipAmount: 0,
      newTipError: '',
    };

    (this: any).handleSendButtonClicked = this.handleSendButtonClicked.bind(this);
  }

  handleSendButtonClicked() {
    const { claim, uri, sendSupport, sendTipCallback } = this.props;
    const { claim_id: claimId } = claim;
    const { tipAmount } = this.state;

    sendSupport(tipAmount, claimId, uri);

    // ex: close modal
    if (sendTipCallback) {
      sendTipCallback();
    }
  }

  handleSupportPriceChange(event: SyntheticInputEvent<*>) {
    const { balance } = this.props;
    const tipAmount = parseFloat(event.target.value);
    let newTipError;
    if (!String(tipAmount).match(/^(\d*([.]\d{0,8})?)$/)) {
      newTipError = __('Tip must be a valid number with no more than 8 decimal places');
    }
    if (tipAmount === balance) {
      newTipError = __('Please decrease your tip to account for transaction fees');
    } else if (tipAmount > balance) {
      newTipError = __('Not enough credits');
    }

    this.setState({
      tipAmount,
      newTipError,
    });
  }

  render() {
    const { title, isPending, uri, onCancel, balance } = this.props;
    const { tipAmount, newTipError } = this.state;

    return (
      <div>
        <div className="card__title">
          <h1>
            {__('Send a tip to')} <UriIndicator uri={uri} />
          </h1>
        </div>
        <div className="card__content">
          <FormField
            label={__('Amount')}
            postfix={__('LBC')}
            className="input--price-amount"
            error={newTipError}
            min="0"
            step="any"
            type="number"
            placeholder="1.23"
            onChange={event => this.handleSupportPriceChange(event)}
            helper={
              <span>
                {__(`This will appear as a tip for ${title} located at ${uri}.`)}{' '}
                <Button label={__('Learn more')} button="link" href="https://lbry.io/faq/tipping" />
              </span>
            }
          />
          <div className="card__actions">
            <Button
              button="primary"
              label={__('Send')}
              disabled={isPending || tipAmount <= 0 || tipAmount > balance || tipAmount === balance}
              onClick={this.handleSendButtonClicked}
            />
            <Button
              button="link"
              label={__('Cancel')}
              onClick={onCancel}
              navigateParams={{ uri }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default WalletSendTip;
