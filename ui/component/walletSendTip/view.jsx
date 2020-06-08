// @flow
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import { FormField, Form } from 'component/common/form';
import { MINIMUM_PUBLISH_BID } from 'constants/claim';
import useIsMobile from 'effects/use-is-mobile';
import CreditAmount from 'component/common/credit-amount';
import I18nMessage from 'component/i18nMessage';
import { Lbryio } from 'lbryinc';
import Card from 'component/common/card';
import classnames from 'classnames';

const DEFAULT_TIP_AMOUNTS = [5, 10, 50];

type Props = {
  uri: string,
  // claimIsMine: boolean,
  title: string,
  claim: StreamClaim,
  isPending: boolean,
  sendSupport: (number, string, boolean) => void,
  closeModal: () => void,
  balance: number,
  isSupport: boolean,
  openModal: (id: string, { tipAmount: number, claimId: string, isSupport: boolean }) => void,
  instantTipEnabled: boolean,
  instantTipMax: { amount: number, currency: string },
};

function WalletSendTip(props: Props) {
  const {
    uri,
    title,
    isPending,
    // claimIsMine,
    balance,
    claim = {},
    instantTipEnabled,
    instantTipMax,
    openModal,
    sendSupport,
    closeModal,
  } = props;
  const [tipAmount, setTipAmount] = React.useState(DEFAULT_TIP_AMOUNTS[0]);
  const [tipError, setTipError] = React.useState();
  const [isSupport, setIsSupport] = React.useState(false);
  const [showMore, setShowMore] = React.useState(false);
  const { claim_id: claimId } = claim;
  const isMobile = useIsMobile();

  function sendSupportOrConfirm(instantTipMaxAmount = null) {
    if (!isSupport && (!instantTipMaxAmount || !instantTipEnabled || tipAmount > instantTipMaxAmount)) {
      const modalProps = { uri, tipAmount, claimId, title, isSupport };
      openModal(MODALS.CONFIRM_SEND_TIP, modalProps);
    } else {
      sendSupport(tipAmount, claimId, isSupport);
      closeModal();
    }
  }

  function handleSubmit() {
    if (tipAmount && claimId) {
      if (instantTipEnabled) {
        if (instantTipMax.currency === 'LBC') {
          sendSupportOrConfirm(instantTipMax.amount);
        } else {
          // Need to convert currency of instant purchase maximum before trying to send support
          Lbryio.getExchangeRates().then(({ LBC_USD }) => {
            sendSupportOrConfirm(instantTipMax.amount / LBC_USD);
          });
        }
      } else {
        sendSupportOrConfirm();
      }
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

  // const label =
  //   tipAmount && tipAmount !== 0
  //     ? __(isSupport ? 'Support %amount% LBC' : 'Tip %amount% LBC', {
  //         amount: tipAmount.toFixed(8).replace(/\.?0+$/, ''),
  //       })
  //     : __('Amount');

  return (
    <Form onSubmit={handleSubmit}>
      <Card
        title={__('Support This Content')}
        subtitle={
          <React.Fragment>
            {__(
              'This will increase the overall bid amount for this content, which will boost its ability to be discovered while active.'
            )}{' '}
            <Button label={__('Learn more')} button="link" href="https://lbry.com/faq/tipping" />.
          </React.Fragment>
        }
        actions={
          <>
            <div className="section">
              {DEFAULT_TIP_AMOUNTS.map(amount => (
                <Button
                  key={amount}
                  button="alt"
                  className={classnames('button-toggle', { 'button-toggle--active': tipAmount === amount })}
                  label={`${amount} LBC`}
                  onClick={() => setTipAmount(amount)}
                />
              ))}
              <Button
                button="alt"
                className={classnames('button-toggle', {
                  'button-toggle--active': !DEFAULT_TIP_AMOUNTS.includes(tipAmount),
                })}
                label={__('Custom')}
                onClick={() => setShowMore(true)}
              />
            </div>

            {showMore && (
              <div className="section">
                <FormField
                  autoFocus
                  name="tip-input"
                  label={
                    <React.Fragment>
                      {'Custom support amount'}{' '}
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
                />
              </div>
            )}

            <div className="section__actions">
              <Button
                autoFocus
                icon={isSupport ? undefined : ICONS.SUPPORT}
                button="primary"
                type="submit"
                label={
                  isSupport
                    ? __('Send Revokable Support')
                    : __('Send a %amount% Tip', { amount: tipAmount ? `${tipAmount} LBC` : '' })
                }
                disabled={isPending || tipError || !tipAmount}
              />
              <FormField
                name="toggle-is-support"
                type="checkbox"
                label={__('Make this support permanent')}
                checked={!isSupport}
                onChange={() => setIsSupport(!isSupport)}
              />
            </div>
          </>
        }
      />
    </Form>
  );
}

export default WalletSendTip;

// <Button
//   button="primary"
//   type="submit"
//   label={__('Confirm')}
//   disabled={isPending || tipError || !tipAmount}
// />;

// <div className="section__actions">
//   <FormField
//     autoFocus
//     name="tip-input"
//     label={
//       <React.Fragment>
//         {label}{' '}
//         {isMobile && (
//           <I18nMessage tokens={{ lbc_balance: <CreditAmount badge={false} amount={balance} /> }}>
//             (%lbc_balance% available)
//           </I18nMessage>
//         )}
//       </React.Fragment>
//     }
//     className="form-field--price-amount"
//     error={tipError}
//     min="0"
//     step="any"
//     type="number"
//     placeholder="1.23"
//     onChange={event => handleSupportPriceChange(event)}
//   />
//   <FormField
//     name="toggle-is-support"
//     type="checkbox"
//     label={__('Send this as a tip instead')}
//     checked={!isSupport}
//     onChange={() => setIsSupport(!isSupport)}
//   />
// </div>;
