// @flow
import 'scss/component/_wallet-tip-selector.scss';
import { FormField } from 'component/common/form';
import { Lbryio } from 'lbryinc';
import { MINIMUM_PUBLISH_BID } from 'constants/claim';
import { useIsMobile } from 'effects/use-screensize';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import Button from 'component/button';
import classnames from 'classnames';
import React from 'react';
import usePersistedState from 'effects/use-persisted-state';
import WalletSpendableBalanceHelp from 'component/walletSpendableBalanceHelp';

import { getStripeEnvironment } from 'util/stripe';
const stripeEnvironment = getStripeEnvironment();

const DEFAULT_TIP_AMOUNTS = [1, 5, 25, 100];
const TAB_FIAT = 'TabFiat';
const TAB_LBC = 'TabLBC';

type Props = {
  activeTab: string,
  amount: number,
  balance: number,
  claim: StreamClaim,
  convertedAmount?: number,
  customTipAmount?: number,
  fiatConversion?: boolean,
  tipError: boolean,
  tipError: string,
  uri: string,
  onChange: (number) => void,
  setConvertedAmount?: (number) => void,
  setDisableSubmitButton: (boolean) => void,
  setTipError: (any) => void,
};

function WalletTipAmountSelector(props: Props) {
  const {
    activeTab,
    amount,
    balance,
    claim,
    convertedAmount,
    customTipAmount,
    fiatConversion,
    tipError,
    onChange,
    setConvertedAmount,
    setDisableSubmitButton,
    setTipError,
  } = props;

  const isMobile = useIsMobile();
  const [useCustomTip, setUseCustomTip] = usePersistedState('comment-support:useCustomTip', true);
  const [hasCardSaved, setHasSavedCard] = usePersistedState('comment-support:hasCardSaved', false);
  const [canReceiveFiatTip, setCanReceiveFiatTip] = React.useState(); // dont persist because it needs to be calc'd per creator
  const [exchangeRate, setExchangeRate] = React.useState();

  const tipAmountsToDisplay =
    customTipAmount && fiatConversion && activeTab === TAB_FIAT ? [customTipAmount] : DEFAULT_TIP_AMOUNTS;

  // if it's fiat but there's no card saved OR the creator can't receive fiat tips
  const shouldDisableFiatSelectors = activeTab === TAB_FIAT && (!hasCardSaved || !canReceiveFiatTip);
  if (setDisableSubmitButton) setDisableSubmitButton(shouldDisableFiatSelectors);

  // setup variables for tip API
  const channelClaimId = claim.signing_channel ? claim.signing_channel.claim_id : claim.claim_id;
  const tipChannelName = claim.signing_channel ? claim.signing_channel.name : claim.name;

  /**
   * whether tip amount selection/review functionality should be disabled
   * @param [amount] LBC amount (optional)
   * @returns {boolean}
   */
  function shouldDisableAmountSelector(amount: number) {
    // if it's LBC but the balance isn't enough, or fiat conditions met
    // $FlowFixMe
    return (
      ((amount > balance || balance === 0) && activeTab !== TAB_FIAT) ||
      shouldDisableFiatSelectors ||
      (customTipAmount && fiatConversion && activeTab !== TAB_FIAT && exchangeRate
        ? amount * exchangeRate < customTipAmount
        : customTipAmount && amount < customTipAmount)
    );
  }

  // parse number as float and sets it in the parent component
  function handleCustomPriceChange(amount: number) {
    const tipAmountValue = parseFloat(amount);
    onChange(tipAmountValue);
    if (fiatConversion && exchangeRate && setConvertedAmount && convertedAmount !== tipAmountValue * exchangeRate) {
      setConvertedAmount(tipAmountValue * exchangeRate);
    }
  }

  function convertToTwoDecimals(number: number) {
    return (Math.round(number * 100) / 100).toFixed(2);
  }

  React.useEffect(() => {
    if (!exchangeRate) {
      Lbryio.getExchangeRates().then(({ LBC_USD }) => setExchangeRate(LBC_USD));
    } else if ((!convertedAmount || convertedAmount !== amount * exchangeRate) && setConvertedAmount) {
      setConvertedAmount(amount * exchangeRate);
    }
  }, [amount, convertedAmount, exchangeRate, setConvertedAmount]);

  // check if creator has a payment method saved
  // REMOVE
  React.useEffect(() => {
    if (!stripeEnvironment) return;

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
  }, [setHasSavedCard]);

  // REMOVE
  React.useEffect(() => {
    if (!stripeEnvironment) return;

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
      .catch(() => {});
  }, [canReceiveFiatTip, channelClaimId, tipChannelName]);

  React.useEffect(() => {
    let regexp;

    if (amount === 0) {
      setTipError(__('Amount cannot be zero.'));
    } else if (!amount || typeof amount !== 'number') {
      setTipError(__('Amount must be a number.'));
    } else {
      // if it's not fiat, aka it's boost or lbc tip
      if (activeTab !== TAB_FIAT) {
        regexp = RegExp(/^(\d*([.]\d{0,8})?)$/);
        const validTipInput = regexp.test(String(amount));

        if (!validTipInput) {
          setTipError(__('Amount must have no more than 8 decimal places'));
        } else if (amount === balance) {
          setTipError(__('Please decrease the amount to account for transaction fees'));
        } else if (amount > balance || balance === 0) {
          setTipError(__('Not enough Credits'));
        } else if (amount < MINIMUM_PUBLISH_BID) {
          setTipError(__('Amount must be higher'));
        } else {
          setTipError(false);
        }
        //  if tip fiat tab REMOVE
      } else {
        regexp = RegExp(/^(\d*([.]\d{0,2})?)$/);
        const validTipInput = regexp.test(String(amount));

        if (!validTipInput) {
          setTipError(__('Amount must have no more than 2 decimal places'));
        } else if (amount < 1) {
          setTipError(__('Amount must be at least one dollar'));
        } else if (amount > 1000) {
          setTipError(__('Amount cannot be over 1000 dollars'));
        } else {
          setTipError(false);
        }
      }
    }
  }, [activeTab, amount, balance, setTipError]);

  const getHelpMessage = (helpMessage: any) => <div className="help">{helpMessage}</div>;

  return (
    <>
      <div className="section">
        {tipAmountsToDisplay.map((defaultAmount) => (
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
          disabled={shouldDisableFiatSelectors}
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

      {customTipAmount &&
        fiatConversion &&
        activeTab !== TAB_FIAT &&
        getHelpMessage(
          __(
            `This support is priced in $USD. ${
              convertedAmount
                ? __(`The current exchange rate for the submitted amount is: $${convertToTwoDecimals(convertedAmount)}`)
                : ''
            }`
          )
        )}

      {/* custom number input form */}
      {useCustomTip && (
        <div className="walletTipSelector__input">
          <FormField
            autoFocus={!isMobile}
            name="tip-input"
            disabled={!customTipAmount && shouldDisableAmountSelector(0)}
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
      {activeTab === TAB_FIAT &&
        (!hasCardSaved
          ? getHelpMessage(
              <>
                <Button navigate={`/$/${PAGES.SETTINGS_STRIPE_CARD}`} label={__('Add a Card')} button="link" />
                {__(' To Tip Creators')}
              </>
            )
          : !canReceiveFiatTip
          ? getHelpMessage(__('Only creators that verify cash accounts can receive tips'))
          : getHelpMessage(__('Send a tip directly from your attached card')))}
    </>
  );
}

export default WalletTipAmountSelector;
