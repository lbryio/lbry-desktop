// @flow
import React from 'react';
import Button from 'component/button';
import { parseURI } from 'lbry-redux';
import { FormField, Form } from 'component/common/form';
import { MINIMUM_PUBLISH_BID } from 'constants/claim';
import useIsMobile from 'effects/use-is-mobile';
import CreditAmount from 'component/common/credit-amount';
import I18nMessage from 'component/i18nMessage';

type Props = {
  uri: string,
  claimIsMine: boolean,
  title: string,
  claim: StreamClaim,
  isPending: boolean,
  sendSupport: (number, string, boolean) => void,
  onCancel: () => void,
  sendTipCallback?: () => void,
  balance: number,
  isSupport: boolean,
};

function WalletSendTip(props: Props) {
  const {
    uri,
    title,
    isPending,
    onCancel,
    claimIsMine,
    isSupport,
    balance,
    claim,
    sendTipCallback,
    sendSupport,
  } = props;
  const [tipAmount, setTipAmount] = React.useState(0);
  const [tipError, setTipError] = React.useState();
  const { claim_id: claimId } = claim;
  const isMobile = useIsMobile();
  const { channelName } = parseURI(uri);

  function handleSendButtonClicked() {
    sendSupport(tipAmount, claimId, isSupport);

    // ex: close modal
    if (sendTipCallback) {
      sendTipCallback();
    }
  }

  function handleSupportPriceChange(event: SyntheticInputEvent<*>) {
    const regexp = RegExp(/^(\d*([.]\d{0,8})?)$/);
    const validTipInput = regexp.test(event.target.value);
    const tipAmount = parseFloat(event.target.value);
    let tipError;

    if (!tipAmount) {
      tipError = __('Amount must be a number');
    } else if (tipAmount <= 0) {
      tipError = __('Amount must be a positive number');
    } else if (tipAmount < MINIMUM_PUBLISH_BID) {
      tipError = __('Amount must be higher');
    } else if (!validTipInput) {
      tipError = __('Amount must have no more than 8 decimal places');
    } else if (tipAmount === balance) {
      tipError = __('Please decrease the amount to account for transaction fees');
    } else if (tipAmount > balance) {
      tipError = __('Not enough credits');
    }

    setTipAmount(tipAmount);
    setTipError(tipError);
  }

  const label =
    tipAmount && tipAmount !== 0
      ? __(isSupport ? 'Support %amount% LBC' : 'Tip %amount% LBC', {
          amount: tipAmount.toFixed(8).replace(/\.?0+$/, ''),
        })
      : __('Amount');

  return (
    <React.Fragment>
      <Form onSubmit={handleSendButtonClicked}>
        <FormField
          autoFocus
          name="tip-input"
          label={
            <React.Fragment>
              {label}{' '}
              {isMobile && (
                <I18nMessage tokens={{ lbc_balance: <CreditAmount badge={false} amount={balance} /> }}>
                  (%lbc_balance% available)
                </I18nMessage>
              )}
            </React.Fragment>
          }
          className="form-field--price-amount"
          error={tipError}
          min="0"
          step="any"
          type="number"
          placeholder="1.23"
          onChange={event => handleSupportPriceChange(event)}
          inputButton={
            <Button button="primary" type="submit" label={__('Send')} disabled={isPending || tipError || !tipAmount} />
          }
          helper={
            <React.Fragment>
              {claimIsMine || isSupport
                ? __(
                    'This will increase the overall bid amount for %title%, which will boost its ability to be discovered while active.',
                    {
                      title: title || '@' + channelName,
                    }
                  )
                : __(
                    'This will appear as a tip for %title%, which will boost its ability to be discovered while active.',
                    {
                      title: title || '@' + channelName,
                    }
                  )}{' '}
              <Button label={__('Learn more')} button="link" href="https://lbry.com/faq/tipping" />.
            </React.Fragment>
          }
        />
      </Form>
      <div className="card__actions">
        <Button button="link" label={__('Cancel')} onClick={onCancel} />
      </div>
    </React.Fragment>
  );
}

export default WalletSendTip;
