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
  errorMessage: string,
  isPending: boolean,
  sendSupport: (number, string, string) => void,
  onCancel: () => void,
  sendTipCallback?: () => void,
  balance: number,
};

type State = {
  amount: number,
};

class WalletSendTip extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      amount: 0,
    };

    (this: any).handleSendButtonClicked = this.handleSendButtonClicked.bind(this);
  }

  handleSendButtonClicked() {
    const { claim, uri, sendSupport, sendTipCallback } = this.props;
    const { claim_id: claimId } = claim;
    const { amount } = this.state;

    sendSupport(amount, claimId, uri);

    // ex: close modal
    if (sendTipCallback) {
      sendTipCallback();
    }
  }

  handleSupportPriceChange(event: SyntheticInputEvent<*>) {
    this.setState({
      amount: Number(event.target.value),
    });
  }

  render() {
    const { title, errorMessage, isPending, uri, onCancel, balance } = this.props;
    const { amount } = this.state;

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
            error={errorMessage}
            min="0"
            step="any"
            type="number"
            placeholder="1.00"
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
              disabled={isPending || amount <= 0 || amount > balance}
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
