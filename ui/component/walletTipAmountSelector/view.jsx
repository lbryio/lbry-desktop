// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import Button from 'component/button';
import { FormField } from 'component/common/form';
import { MINIMUM_PUBLISH_BID } from 'constants/claim';
import CreditAmount from 'component/common/credit-amount';
import I18nMessage from 'component/i18nMessage';
import classnames from 'classnames';
import usePersistedState from 'effects/use-persisted-state';
import WalletSpendableBalanceHelp from 'component/walletSpendableBalanceHelp';
import { Lbryio } from 'lbryinc';
import { STRIPE_PUBLIC_KEY } from 'config';

let stripeEnvironment = 'test';
// if the key contains pk_live it's a live key
// update the environment for the calls to the backend to indicate which environment to hit
if (STRIPE_PUBLIC_KEY.indexOf('pk_live') > -1) {
  stripeEnvironment = 'live';
}

const DEFAULT_TIP_AMOUNTS = [1, 5, 25, 100];

const TAB_FIAT = 'TabFiat';
const TAB_LBC = 'TabLBC';

type Props = {
  balance: number,
  amount: number,
  onChange: (number) => void,
  isAuthenticated: boolean,
  claim: StreamClaim,
  uri: string,
  onTipErrorChange: (string) => void,
  activeTab: string,
  shouldDisableReviewButton: (boolean) => void
};

function WalletTipAmountSelector(props: Props) {
  const { balance, amount, onChange, activeTab, claim, onTipErrorChange, shouldDisableReviewButton } = props;
  const [useCustomTip, setUseCustomTip] = usePersistedState('comment-support:useCustomTip', false);
  const [tipError, setTipError] = React.useState();

  const [canReceiveFiatTip, setCanReceiveFiatTip] = React.useState(); // dont persist because it needs to be calc'd per creator
  const [hasCardSaved, setHasSavedCard] = usePersistedState('comment-support:hasCardSaved', false);

  // if it's fiat but there's no card saved OR the creator can't receive fiat tips
  const shouldDisableFiatSelectors = (activeTab === TAB_FIAT && (!hasCardSaved || !canReceiveFiatTip));

  /**
   * whether tip amount selection/review functionality should be disabled
   * @param [amount] LBC amount (optional)
   * @returns {boolean}
   */
  function shouldDisableAmountSelector(amount) {
    // if it's LBC but the balance isn't enough, or fiat conditions met
    // $FlowFixMe
    return (amount > balance && activeTab !== TAB_FIAT) || shouldDisableFiatSelectors;
  }

  shouldDisableReviewButton(shouldDisableFiatSelectors);

  // setup variables for tip API
  let channelClaimId, tipChannelName;
  // if there is a signing channel it's on a file
  if (claim.signing_channel) {
    channelClaimId = claim.signing_channel.claim_id;
    tipChannelName = claim.signing_channel.name;

    // otherwise it's on the channel page
  } else {
    channelClaimId = claim.claim_id;
    tipChannelName = claim.name;
  }

  // check if creator has a payment method saved
  React.useEffect(() => {
    Lbryio.call(
      'customer',
      'status',
      {
        environment: stripeEnvironment,
      },
      'post'
    ).then((customerStatusResponse) => {
      const defaultPaymentMethodId =
        customerStatusResponse.Customer &&
        customerStatusResponse.Customer.invoice_settings &&
        customerStatusResponse.Customer.invoice_settings.default_payment_method &&
        customerStatusResponse.Customer.invoice_settings.default_payment_method.id;

      setHasSavedCard(Boolean(defaultPaymentMethodId));
    });
  }, []);

  //
  React.useEffect(() => {
    Lbryio.call(
      'account',
      'check',
      {
        channel_claim_id: channelClaimId,
        channel_name: tipChannelName,
        environment: stripeEnvironment,
      },
      'post'
    )
      .then((accountCheckResponse) => {
        if (accountCheckResponse === true && canReceiveFiatTip !== true) {
          setCanReceiveFiatTip(true);
        }
      })
      .catch(function (error) {
        // console.log(error);
      });
  }, []);

  React.useEffect(() => {
    // setHasSavedCard(false);
    // setCanReceiveFiatTip(true);

    let regexp, tipError;

    if (amount === 0) {
      tipError = __('Amount must be a positive number');
    } else if (!amount || typeof amount !== 'number') {
      tipError = __('Amount must be a number');
    }

    // if it's not fiat, aka it's boost or lbc tip
    else if (activeTab !== TAB_FIAT) {
      regexp = RegExp(/^(\d*([.]\d{0,8})?)$/);
      const validTipInput = regexp.test(String(amount));

      if (!validTipInput) {
        tipError = __('Amount must have no more than 8 decimal places');
      } else if (amount === balance) {
        tipError = __('Please decrease the amount to account for transaction fees');
      } else if (amount > balance) {
        tipError = __('Not enough Credits');
      } else if (amount < MINIMUM_PUBLISH_BID) {
        tipError = __('Amount must be higher');
      }
      //  if tip fiat tab
    } else {
      regexp = RegExp(/^(\d*([.]\d{0,2})?)$/);
      const validTipInput = regexp.test(String(amount));

      if (!validTipInput) {
        tipError = __('Amount must have no more than 2 decimal places');
      } else if (amount < 1) {
        tipError = __('Amount must be at least one dollar');
      } else if (amount > 1000) {
        tipError = __('Amount cannot be over 1000 dollars');
      }
    }

    setTipError(tipError);
    onTipErrorChange(tipError);
  }, [amount, balance, setTipError, activeTab]);

  // parse number as float and sets it in the parent component
  function handleCustomPriceChange(amount: number) {
    const tipAmount = parseFloat(amount);

    onChange(tipAmount);
  }

  return (
    <>
      <div className="section">
        {DEFAULT_TIP_AMOUNTS.map((defaultAmount) => (
          <Button
            key={defaultAmount}
            disabled={shouldDisableAmountSelector(defaultAmount)}
            button="alt"
            className={classnames('button-toggle button-toggle--expandformobile', {
              'button-toggle--active': defaultAmount === amount && !useCustomTip,
              'button-toggle--disabled': amount > balance,
            })}
            label={defaultAmount}
            icon={activeTab === TAB_LBC ? ICONS.LBC : ICONS.FINANCE}
            onClick={() => {
              handleCustomPriceChange(defaultAmount);
              setUseCustomTip(false);
            }}
          />
        ))}
        <Button
          button="alt"
          disabled={activeTab === TAB_FIAT && (!hasCardSaved || !canReceiveFiatTip)}
          className={classnames('button-toggle button-toggle--expandformobile', {
            'button-toggle--active': useCustomTip,
          })}
          icon={activeTab === TAB_LBC ? ICONS.LBC : ICONS.FINANCE}
          label={__('Custom')}
          onClick={() => setUseCustomTip(true)}
        />
        {activeTab === TAB_LBC && DEFAULT_TIP_AMOUNTS.some((val) => val > balance) && (
          <Button
            button="secondary"
            className="button-toggle-group-action"
            icon={ICONS.BUY}
            title={__('Buy or swap more LBRY Credits')}
            navigate={`/$/${PAGES.BUY}`}
          />
        )}
      </div>

      {useCustomTip && activeTab === TAB_FIAT && !hasCardSaved && (
        <>
          <div className="help">
            <span className="help--spendable">
              <Button navigate={`/$/${PAGES.SETTINGS_STRIPE_CARD}`} label={__('Add a Card ')} button="link" /> To{' '}
              {__(' Tip Creators')}
            </span>
          </div>
        </>
      )}

      {/* has card saved but cant creator cant receive tips */}
      {useCustomTip && activeTab === TAB_FIAT && hasCardSaved && !canReceiveFiatTip && (
        <>
          <div className="help">
            <span className="help--spendable">Only select creators can receive tips at this time</span>
          </div>
        </>
      )}

      {/* has card saved but cant creator cant receive tips */}
      {useCustomTip && activeTab === TAB_FIAT && hasCardSaved && canReceiveFiatTip && (
        <>
          <div className="help">
            <span className="help--spendable">Send a tip directly from your attached card</span>
          </div>
        </>
      )}

      {/* custom number input form */}
      {useCustomTip && (
        <div className="comment__tip-input">
          <FormField
            autoFocus
            name="tip-input"
            disabled={shouldDisableAmountSelector()}
            label={
              activeTab === TAB_LBC ? (
                <React.Fragment>
                  {__('Custom support amount')}{' '}
                  <I18nMessage tokens={{ lbc_balance: <CreditAmount precision={4} amount={balance} /> }}>
                    (%lbc_balance% available)
                  </I18nMessage>
                </React.Fragment>
              ) : (
                <></>
              )

              // <>
              //   <div className="">
              //     <span className="help--spendable">Send a tip directly from your attached card</span>
              //   </div>
              // </>
            }
            className="form-field--price-amount"
            error={tipError}
            min="0"
            step="any"
            type="number"
            placeholder="1.23"
            value={amount}
            onChange={(event) => handleCustomPriceChange(event.target.value)}
          />
        </div>
      )}

      {/* lbc tab */}
      {activeTab === TAB_LBC && <WalletSpendableBalanceHelp />}
      {/* fiat button but no card saved */}
      {!useCustomTip && activeTab === TAB_FIAT && !hasCardSaved && (
        <>
          <div className="help">
            <span className="help--spendable">
              <Button navigate={`/$/${PAGES.SETTINGS_STRIPE_CARD}`} label={__('Add a Card ')} button="link" /> To{' '}
              {__(' Tip Creators')}
            </span>
          </div>
        </>
      )}

      {/* has card saved but cant creator cant receive tips */}
      {!useCustomTip && activeTab === TAB_FIAT && hasCardSaved && !canReceiveFiatTip && (
        <>
          <div className="help">
            <span className="help--spendable">Only select creators can receive tips at this time</span>
          </div>
        </>
      )}

      {/* has card saved but cant creator cant receive tips */}
      {!useCustomTip && activeTab === TAB_FIAT && hasCardSaved && canReceiveFiatTip && (
        <>
          <div className="help">
            <span className="help--spendable">Send a tip directly from your attached card</span>
          </div>
        </>
      )}
    </>
  );
}

export default WalletTipAmountSelector;
