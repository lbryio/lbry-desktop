// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import Button from 'component/button';
import { FormField, Form } from 'component/common/form';
import { MINIMUM_PUBLISH_BID } from 'constants/claim';
import CreditAmount from 'component/common/credit-amount';
import I18nMessage from 'component/i18nMessage';
import { Lbryio } from 'lbryinc';
import Card from 'component/common/card';
import classnames from 'classnames';
import ChannelSelector from 'component/channelSelector';
import LbcSymbol from 'component/common/lbc-symbol';
import { parseURI } from 'lbry-redux';
import usePersistedState from 'effects/use-persisted-state';
import WalletSpendableBalanceHelp from 'component/walletSpendableBalanceHelp';
import { STRIPE_PUBLIC_KEY } from 'config';

let stripeEnvironment = 'test';
// if the key contains pk_live it's a live key
// update the environment for the calls to the backend to indicate which environment to hit
if (STRIPE_PUBLIC_KEY.indexOf('pk_live') > -1) {
  stripeEnvironment = 'live';
}

const DEFAULT_TIP_AMOUNTS = [1, 5, 25, 100];
const MINIMUM_FIAT_TIP = 1;
const MAXIMUM_FIAT_TIP = 1000;

const TAB_BOOST = 'TabBoost';
const TAB_FIAT = 'TabFiat';
const TAB_LBC = 'TabLBC';
type SupportParams = { amount: number, claim_id: string, channel_id?: string };

type Props = {
  uri: string,
  claimIsMine: boolean,
  title: string,
  claim: StreamClaim,
  isPending: boolean,
  isSupport: boolean,
  sendSupport: (SupportParams, boolean) => void, // function that comes from lbry-redux
  closeModal: () => void,
  balance: number,
  fetchingChannels: boolean,
  instantTipEnabled: boolean,
  instantTipMax: { amount: number, currency: string },
  activeChannelClaim: ?ChannelClaim,
  incognito: boolean,
  doToast: ({ message: string }) => void,
  isAuthenticated: boolean,
};

function WalletSendTip(props: Props) {
  const {
    uri,
    title,
    isPending,
    claimIsMine,
    balance,
    claim = {},
    instantTipEnabled,
    instantTipMax,
    sendSupport,
    closeModal,
    fetchingChannels,
    incognito,
    activeChannelClaim,
    doToast,
    isAuthenticated,
  } = props;
  const [presetTipAmount, setPresetTipAmount] = usePersistedState('comment-support:presetTip', DEFAULT_TIP_AMOUNTS[0]);
  const [customTipAmount, setCustomTipAmount] = usePersistedState('comment-support:customTip', 1.0);
  const [useCustomTip, setUseCustomTip] = usePersistedState('comment-support:useCustomTip', false);
  const [tipError, setTipError] = React.useState();
  const [isConfirming, setIsConfirming] = React.useState(false);
  const { claim_id: claimId } = claim;
  const { channelName } = parseURI(uri);
  const activeChannelName = activeChannelClaim && activeChannelClaim.name;
  const activeChannelId = activeChannelClaim && activeChannelClaim.claim_id;

  const [canReceiveFiatTip, setCanReceiveFiatTip] = React.useState(); // dont persist because it needs to be calc'd per creator
  const [hasCardSaved, setHasSavedCard] = usePersistedState('comment-support:hasCardSaved', false);

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

  const sourceClaimId = claim.claim_id;

  // check if creator has a payment method saved
  React.useEffect(() => {
    if (channelClaimId && isAuthenticated) {
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
    }
  }, [channelClaimId, isAuthenticated]);

  // check if creator has an account saved
  React.useEffect(() => {
    var tipInputElement = document.getElementById('tip-input');
    if (tipInputElement) { tipInputElement.focus() }
  }, []);

  React.useEffect(() => {
    if (channelClaimId) {
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
    }
  }, [channelClaimId]);

  const noBalance = balance === 0;
  const tipAmount = useCustomTip ? customTipAmount : presetTipAmount;

  const [activeTab, setActiveTab] = React.useState(claimIsMine ? TAB_BOOST : TAB_LBC);

  function setClaimTypeText() {
    if (claim.value_type === 'stream') {
      return __('Content');
    } else if (claim.value_type === 'channel') {
      return __('Channel');
    } else if (claim.value_type === 'repost') {
      return __('Repost');
    } else if (claim.value_type === 'collection') {
      return __('List');
    } else {
      return __('Claim');
    }
  }
  const claimTypeText = setClaimTypeText();

  let iconToUse, explainerText;
  if (activeTab === TAB_BOOST) {
    iconToUse = ICONS.LBC;
    explainerText = __('This refundable boost will improve the discoverability of this %claimTypeText% while active.', {claimTypeText});
  } else if (activeTab === TAB_FIAT) {
    iconToUse = ICONS.FINANCE;
    explainerText = __('Show this channel your appreciation by sending a donation in USD. ');
    // if (!hasCardSaved) {
    //   explainerText += __('You must add a card to use this functionality.');
    // }
  } else if (activeTab === TAB_LBC) {
    iconToUse = ICONS.LBC;
    explainerText = __('Show this channel your appreciation by sending a donation of Credits. ');
  }

  const isSupport = claimIsMine || activeTab === TAB_BOOST;

  React.useEffect(() => {
    // Regex for number up to 8 decimal places
    let regexp;
    let tipError;

    if (tipAmount === 0) {
      tipError = __('Amount must be a positive number');
    } else if (!tipAmount || typeof tipAmount !== 'number') {
      tipError = __('Amount must be a number');
    }

    // if it's not fiat, aka it's boost or lbc tip
    else if (activeTab !== TAB_FIAT) {
      regexp = RegExp(/^(\d*([.]\d{0,8})?)$/);
      const validTipInput = regexp.test(String(tipAmount));

      if (!validTipInput) {
        tipError = __('Amount must have no more than 8 decimal places');
      } else if (!validTipInput) {
        tipError = __('Amount must have no more than 8 decimal places');
      } else if (tipAmount === balance) {
        tipError = __('Please decrease the amount to account for transaction fees');
      } else if (tipAmount > balance) {
        tipError = __('Not enough Credits');
      } else if (tipAmount < MINIMUM_PUBLISH_BID) {
        tipError = __('Amount must be higher');
      }
    //  if tip fiat tab
    } else {
      regexp = RegExp(/^(\d*([.]\d{0,2})?)$/);
      const validTipInput = regexp.test(String(tipAmount));

      if (!validTipInput) {
        tipError = __('Amount must have no more than 2 decimal places');
      } else if (tipAmount < MINIMUM_FIAT_TIP) {
        tipError = __('Amount must be at least one dollar');
      } else if (tipAmount > MAXIMUM_FIAT_TIP) {
        tipError = __('Amount cannot be over 1000 dollars');
      }
    }

    setTipError(tipError);
  }, [tipAmount, balance, setTipError, activeTab]);

  //
  function sendSupportOrConfirm(instantTipMaxAmount = null) {
    // send a tip
    if (!isConfirming && (!instantTipMaxAmount || !instantTipEnabled || tipAmount > instantTipMaxAmount)) {
      setIsConfirming(true);
    } else {
      // send a boost
      const supportParams: SupportParams = { amount: tipAmount, claim_id: claimId };

      // include channel name if donation not anonymous
      if (activeChannelClaim && !incognito) {
        supportParams.channel_id = activeChannelClaim.claim_id;
      }

      // send tip/boost
      sendSupport(supportParams, isSupport);
      closeModal();
    }
  }

  // when the form button is clicked
  function handleSubmit() {
    if (tipAmount && claimId) {
      // send an instant tip (no need to go to an exchange first)
      if (instantTipEnabled && activeTab !== TAB_FIAT) {
        if (instantTipMax.currency === 'LBC') {
          sendSupportOrConfirm(instantTipMax.amount);
        } else {
          // Need to convert currency of instant purchase maximum before trying to send support
          Lbryio.getExchangeRates().then(({ LBC_USD }) => {
            sendSupportOrConfirm(instantTipMax.amount / LBC_USD);
          });
        }
        // sending fiat tip
      } else if (activeTab === TAB_FIAT) {
        if (!isConfirming) {
          setIsConfirming(true);
        } else if (isConfirming) {
          let sendAnonymously = !activeChannelClaim || incognito;

          Lbryio.call(
            'customer',
            'tip',
            { // round to fix issues with floating point numbers
              amount: Math.round(100 * tipAmount), // convert from dollars to cents
              creator_channel_name: tipChannelName, // creator_channel_name
              creator_channel_claim_id: channelClaimId,
              tipper_channel_name: sendAnonymously ? '' : activeChannelName,
              tipper_channel_claim_id: sendAnonymously ? '' : activeChannelId,
              currency: 'USD',
              anonymous: sendAnonymously,
              source_claim_id: sourceClaimId,
              environment: stripeEnvironment,
            },
            'post'
          )
            .then((customerTipResponse) => {
              doToast({
                message: __("You sent $%amount% as a tip to %tipChannelName%, I'm sure they appreciate it!", {
                  amount: tipAmount,
                  tipChannelName,
                }),
              });
            })
            .catch(function(error) {
              var displayError = 'Sorry, there was an error in processing your payment!';

              if (error.message !== 'payment intent failed to confirm') {
                displayError = error.message;
              }

              doToast({ message: displayError, isError: true });
            });

          closeModal();
        }
        // if it's a boost (?)
      } else {
        sendSupportOrConfirm();
      }
    }
  }

  var countDecimals = function(value) {
    var text = value.toString();
    var index = text.indexOf('.');
    return (text.length - index - 1);
  };

  function handleCustomPriceChange(event: SyntheticInputEvent<*>) {
    let tipAmountAsString = event.target.value;

    let tipAmount = parseFloat(tipAmountAsString);

    const howManyDecimals = countDecimals(tipAmountAsString);

    // allow maximum two decimals
    if (activeTab === TAB_FIAT) {
      if (Number.isNaN(tipAmount)) {
        setCustomTipAmount('');
      }

      if (howManyDecimals > 2) {
        tipAmount = Math.floor(tipAmount * 100) / 100;
      }

      const howManyDigits = Math.trunc(tipAmount).toString().length;

      if (howManyDigits > 4 && tipAmount !== 1000) {
        setTipError('Amount cannot be over 1000 dollars');
      } else if (tipAmount > 1000) {
        setTipError('Amount cannot be over 1000 dollars');
        setCustomTipAmount(tipAmount);
      } else {
        setCustomTipAmount(tipAmount);
      }
    } else {
      if (howManyDecimals > 9) {
        tipAmount = Number(tipAmount.toString().match(/^-?\d+(?:\.\d{0,8})?/)[0]);

        setTipError('Please only use up to 8 decimals');
      }
      setCustomTipAmount(tipAmount);
    }
  }

  function buildButtonText() {
    // test if frontend will show up as isNan
    function isNan(tipAmount) {
      // testing for NaN ES5 style https://stackoverflow.com/a/35912757/3973137
      // also sometimes it's returned as a string
      // eslint-disable-next-line
      if (tipAmount !== tipAmount || tipAmount === 'NaN') {
        return true;
      }
      return false;
    }

    function convertToTwoDecimals(number) {
      return (Math.round(number * 100) / 100).toFixed(2);
    }

    const amountToShow = activeTab === TAB_FIAT ? convertToTwoDecimals(tipAmount) : tipAmount;

    // if it's a valid number display it, otherwise do an empty string
    const displayAmount = !isNan(tipAmount) ? amountToShow : '';

    if (activeTab === TAB_BOOST) {
      return (claimIsMine ?  __('Boost Your %claimTypeText%', {claimTypeText}) : __('Boost This %claimTypeText%', {claimTypeText}));
    } else if (activeTab === TAB_FIAT) {
      return __('Send a $%displayAmount% Tip', { displayAmount });
    } else if (activeTab === TAB_LBC) {
      return __('Send a %displayAmount% Credit Tip', { displayAmount });
    }
  }

  function shouldDisableAmountSelector(amount) {
    return (
      (amount > balance && activeTab !== TAB_FIAT) || (activeTab === TAB_FIAT && (!hasCardSaved || !canReceiveFiatTip))
    );
  }

  function setConfirmLabel() {
    if (activeTab === TAB_LBC) {
      return __('Tipping Credit');
    } else if (activeTab === TAB_FIAT) {
      return __('Tipping Fiat (USD)');
    } else if (activeTab === TAB_BOOST) {
      return __('Boosting');
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      {/* if there is no LBC balance, show user frontend to get credits */}
      {1 === 2 ? (
        <Card
          title={<I18nMessage tokens={{ lbc: <LbcSymbol size={22} /> }}>Supporting content requires %lbc%</I18nMessage>}
          subtitle={
            <I18nMessage tokens={{ lbc: <LbcSymbol /> }}>
              With %lbc%, you can send tips to your favorite creators, or help boost their content for more people to
              see.
            </I18nMessage>
          }
          actions={
            <div className="section__actions">
              <Button
                icon={ICONS.REWARDS}
                button="primary"
                label={__('Earn Rewards')}
                navigate={`/$/${PAGES.REWARDS}`}
              />
              <Button icon={ICONS.BUY} button="secondary" label={__('Buy/Swap Credits')} navigate={`/$/${PAGES.BUY}`} />
              <Button button="link" label={__('Nevermind')} onClick={closeModal} />
            </div>
          }
        />
      ) : (
        // if there is lbc, the main tip/boost gui with the 3 tabs at the top
        <Card
          title={<LbcSymbol postfix={claimIsMine ? __('Boost Your %claimTypeText%', {claimTypeText}) : __('Support This %claimTypeText%', {claimTypeText})} size={22} />}
          subtitle={
            <React.Fragment>
              {!claimIsMine && (
                <div className="section">
                  {/* tip LBC tab button */}
                  <Button
                    key="tip"
                    icon={ICONS.LBC}
                    label={__('Tip')}
                    button="alt"
                    onClick={() => {
                      var tipInputElement = document.getElementById('tip-input');
                      if (tipInputElement) { tipInputElement.focus() }
                      if (!isConfirming) {
                        setActiveTab(TAB_LBC);
                      }
                    }}
                    className={classnames('button-toggle', { 'button-toggle--active': activeTab === TAB_LBC })}
                  />
                  {/* tip fiat tab button */}
                  {/* @if TARGET='web' */}
                  <Button
                    key="tip-fiat"
                    icon={ICONS.FINANCE}
                    label={__('Tip')}
                    button="alt"
                    onClick={() => {
                      var tipInputElement = document.getElementById('tip-input');
                      if (tipInputElement) { tipInputElement.focus() }
                      if (!isConfirming) {
                        setActiveTab(TAB_FIAT);
                      }
                    }}
                    className={classnames('button-toggle', { 'button-toggle--active': activeTab === TAB_FIAT })}
                  />
                  {/* @endif */}
                  {/* tip LBC tab button */}
                  <Button
                    key="boost"
                    icon={ICONS.TRENDING}
                    label={__('Boost')}
                    button="alt"
                    onClick={() => {
                      var tipInputElement = document.getElementById('tip-input');
                      if (tipInputElement) { tipInputElement.focus() }
                      if (!isConfirming) {
                        setActiveTab(TAB_BOOST);
                      }
                    }}
                    className={classnames('button-toggle', { 'button-toggle--active': activeTab === TAB_BOOST })}
                  />
                </div>
              )}

              {/* short explainer under the button */}
              <div className="section__subtitle">
                {explainerText + ' '}
                {/* {activeTab === TAB_FIAT && !hasCardSaved && <Button navigate={`/$/${PAGES.SETTINGS_STRIPE_CARD}`} label={__('Add A Card')} button="link" />} */}
                {<Button label={__('Learn more')} button="link" href="https://lbry.com/faq/tipping" />}
              </div>
            </React.Fragment>
          }
          actions={
            // confirmation modal, allow  user to confirm or cancel transaction
            isConfirming ? (
              <>
                <div className="section section--padded card--inline confirm__wrapper">
                  <div className="section">
                    <div className="confirm__label">{__('To --[the tip recipient]--')}</div>
                    <div className="confirm__value">{channelName || title}</div>
                    <div className="confirm__label">{__('From --[the tip sender]--')}</div>
                    <div className="confirm__value">
                      {activeChannelClaim && !incognito ? activeChannelClaim.name : __('Anonymous')}
                    </div>
                    <div className="confirm__label">{setConfirmLabel()}</div>
                    <div className="confirm__value">
                      {activeTab === TAB_FIAT ? <p>$ {(Math.round(tipAmount * 100) / 100).toFixed(2)}</p> : <LbcSymbol postfix={tipAmount} size={22} />}
                    </div>
                  </div>
                </div>
                <div className="section__actions">
                  <Button
                    autoFocus
                    onClick={handleSubmit}
                    button="primary"
                    disabled={isPending}
                    label={__('Confirm')}
                  />
                  <Button button="link" label={__('Cancel')} onClick={() => setIsConfirming(false)} />
                </div>
              </>
              // only show the prompt to earn more if its lbc or boost tab and no balance
              // otherwise you can show the full prompt
            ) : (!((activeTab === TAB_LBC || activeTab === TAB_BOOST) && noBalance)
              ? <>
                <div className="section">
                  <ChannelSelector />
                </div>

                {activeTab === TAB_FIAT && !hasCardSaved && (
                  <h3 className="add-card-prompt">
                    <Button navigate={`/$/${PAGES.SETTINGS_STRIPE_CARD}`} label={__('Add a Card')} button="link" />
                    {' '}{__('To Tip Creators')}
                  </h3>
                )}

                {/* section to pick tip/boost amount */}
                <div className="section">
                  {DEFAULT_TIP_AMOUNTS.map((amount) => (
                    <Button
                      key={amount}
                      disabled={shouldDisableAmountSelector(amount)}
                      button="alt"
                      className={classnames('button-toggle button-toggle--expandformobile', {
                        'button-toggle--active': tipAmount === amount && !useCustomTip,
                        'button-toggle--disabled': amount > balance,
                      })}
                      label={amount}
                      icon={iconToUse}
                      onClick={() => {
                        setPresetTipAmount(amount);
                        setUseCustomTip(false);
                      }}
                    />
                  ))}

                  <Button
                    button="alt"
                    className={classnames('button-toggle button-toggle--expandformobile', {
                      'button-toggle--active': useCustomTip, // set as active
                    })}
                    icon={iconToUse}
                    label={__('Custom')}
                    onClick={() => setUseCustomTip(true)}
                    // disabled if it's receive fiat and there is no card or creator can't receive tips
                    disabled={activeTab === TAB_FIAT && (!hasCardSaved || !canReceiveFiatTip)}
                  />

                  {DEFAULT_TIP_AMOUNTS.some((val) => val > balance) && activeTab !== TAB_FIAT && (
                    <Button
                      button="secondary"
                      className="button-toggle-group-action"
                      icon={ICONS.BUY}
                      title={__('Buy or swap more LBRY Credits')}
                      navigate={`/$/${PAGES.BUY}`}
                    />
                  )}
                </div>

                {useCustomTip && (
                  <div className="section">
                    <FormField
                      autoFocus
                      name="tip-input"
                      label={
                        <React.Fragment>
                          {__('Custom support amount')}{' '}
                          {activeTab !== TAB_FIAT ? (
                            <I18nMessage
                              tokens={{ lbc_balance: <CreditAmount precision={4} amount={balance} showLBC={false} /> }}
                            >
                              (%lbc_balance% Credits available)
                            </I18nMessage>
                          ) : (
                            'in USD'
                          )}
                        </React.Fragment>
                      }
                      className="form-field--price-amount"
                      error={tipError}
                      min="0"
                      step="any"
                      type="number"
                      style={{
                        width: activeTab === TAB_FIAT ? '99px' : '160px',
                      }}
                      placeholder="1.23"
                      value={customTipAmount}
                      onChange={(event) => handleCustomPriceChange(event)}
                    />
                  </div>
                )}

                {/* send tip/boost button */}
                <div className="section__actions">
                  <Button
                    autoFocus
                    icon={isSupport ? ICONS.TRENDING : ICONS.SUPPORT}
                    button="primary"
                    type="submit"
                    disabled={
                      fetchingChannels ||
                      isPending ||
                      tipError ||
                      !tipAmount ||
                      (activeTab === TAB_FIAT && (!hasCardSaved || !canReceiveFiatTip))
                    }
                    label={buildButtonText()}
                  />
                  {fetchingChannels && <span className="help">{__('Loading your channels...')}</span>}
                </div>
                {activeTab !== TAB_FIAT ? (
                  <WalletSpendableBalanceHelp />
                ) : !canReceiveFiatTip ? (
                  <div className="help">{__('Only select creators can receive tips at this time')}</div>
                ) : (
                  <div className="help">{__('The payment will be made from your saved card')}</div>
                )}
              </> : <>
                  <Card
                    title={<I18nMessage tokens={{ lbc: <LbcSymbol size={22} /> }}>Supporting content requires %lbc%</I18nMessage>}
                    subtitle={
                      <I18nMessage tokens={{ lbc: <LbcSymbol /> }}>
                        With %lbc%, you can send tips to your favorite creators, or help boost their content for more people to
                        see.
                      </I18nMessage>
                    }
                    actions={
                      <div className="section__actions">
                        <Button
                          icon={ICONS.REWARDS}
                          button="primary"
                          label={__('Earn Rewards')}
                          navigate={`/$/${PAGES.REWARDS}`}
                        />
                        <Button icon={ICONS.BUY} button="secondary" label={__('Buy/Swap Credits')} navigate={`/$/${PAGES.BUY}`} />
                        <Button button="link" label={__('Nevermind')} onClick={closeModal} />
                      </div>
                    }
                /></>
            )
          }
        />
      )}
    </Form>
  );
}

export default WalletSendTip;
