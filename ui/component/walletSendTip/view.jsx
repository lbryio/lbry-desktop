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

const DEFAULT_TIP_AMOUNTS = [1, 5, 25, 100];

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
  } = props;
  const [presetTipAmount, setPresetTipAmount] = usePersistedState('comment-support:presetTip', DEFAULT_TIP_AMOUNTS[0]);
  const [customTipAmount, setCustomTipAmount] = usePersistedState('comment-support:customTip', 1.0);
  const [useCustomTip, setUseCustomTip] = usePersistedState('comment-support:useCustomTip', false);
  const [tipError, setTipError] = React.useState();
  const [sendAsTip, setSendAsTip] = usePersistedState('comment-support:sendAsTip', true);
  const [isConfirming, setIsConfirming] = React.useState(false);
  const { claim_id: claimId } = claim;
  console.log('claim');
  console.log(claim);
  const { channelName } = parseURI(uri);
  console.log('channel name');
  console.log(channelName);

  const [canReceiveFiatTip, setCanReceiveFiatTip] = React.useState();
  const [hasSavedCard, setHasSavedCard] = usePersistedState('comment-support:hasSavedCard', false);

  const channelClaimId = claim.signing_channel.claim_id;
  const tipChannelName = claim.signing_channel.name;
  const sourceClaimId = claim.claim_id;

// TODO: come up with a better way to do this
  setTimeout(function() {
    Lbryio.call('customer', 'status', {}, 'post').then(customerStatusResponse => {
      const defaultPaymentMethodId = customerStatusResponse.Customer &&
        customerStatusResponse.Customer.invoice_settings &&
        customerStatusResponse.Customer.invoice_settings.default_payment_method &&
        customerStatusResponse.Customer.invoice_settings.default_payment_method.id

      setHasSavedCard(Boolean(defaultPaymentMethodId));
    });
  }, 100);

  Lbryio.call('account', 'check', {
    channel_claim_id: channelClaimId,
    channel_name: tipChannelName,
  }, 'post').then(accountCheckResponse => {
    if (accountCheckResponse === true && canReceiveFiatTip !== true) {
      setCanReceiveFiatTip(true);
    }
  }).catch(function(error) {
    console.log(error);
  });

  const noBalance = balance === 0;
  const tipAmount = useCustomTip ? customTipAmount : presetTipAmount;

  const [activeTab, setActiveTab] = usePersistedState('comment-support:activeTab', 'TipLBC');

  // TODO: get this as a call from the backend
  const hasCardSaved = hasSavedCard;

  let iconToUse, explainerText;
  if (activeTab === 'Boost') {
    iconToUse = ICONS.LBC;
    explainerText = 'This will increase the overall bid amount for this content, which will boost its ability to be discovered. You can cancel your Boost later and receive back your LBC. ';
  } else if (activeTab === 'TipFiat') {
    iconToUse = ICONS.FINANCE;
    explainerText = 'This tip will be made through your card and sent to the creator at which point they will be able to withdraw the funds.  ';
    if (!hasCardSaved) {
      explainerText += 'You must add a card to use this functionality. ';
    }
  } else if (activeTab === 'TipLBC') {
    iconToUse = ICONS.LBC;
    explainerText = 'Show this channel your appreciation by sending a donation. This is a one time donation which is not refundable. ';
  }

  const isSupport = claimIsMine || !sendAsTip;

  React.useEffect(() => {

    // TODO: what is this regexp testing against? number from 0-8?
    const regexp = RegExp(/^(\d*([.]\d{0,8})?)$/);
    const validTipInput = regexp.test(String(tipAmount));
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
      tipError = __('Not enough Credits');
    }

    setTipError(tipError);
  }, [tipAmount, balance, setTipError]);

  //
  function sendSupportOrConfirm(instantTipMaxAmount = null) {
    // send a tip
    if (
      !isConfirming &&
      (!instantTipMaxAmount || !instantTipEnabled || tipAmount > instantTipMaxAmount)
    ) {
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
      if (instantTipEnabled) {
        if (instantTipMax.currency === 'LBC') {
          sendSupportOrConfirm(instantTipMax.amount);
        } else {
          // Need to convert currency of instant purchase maximum before trying to send support
          Lbryio.getExchangeRates().then(({ LBC_USD }) => {
            sendSupportOrConfirm(instantTipMax.amount / LBC_USD);
          });
        }
      } else if (activeTab === 'TipFiat') {
        if (!isConfirming) {
          setIsConfirming(true);
        } else if (isConfirming) {

          console.log(tipChannelName, channelClaimId, sourceClaimId);

          Lbryio.call('customer', 'tip', {
            amount: 100 * tipAmount, // convert from dollars to cents
            channel_name: tipChannelName,
            channel_claim_id: channelClaimId,
            currency: 'USD',
            anonymous: false,
            source_claim_id: sourceClaimId,
          }, 'post').then(customerTipResponse => {
            doToast({
              message: __('You sent $%amount% as a tip to %tipChannelName%, I\'m sure they appreciate it!', { amount: tipAmount, tipChannelName  }),
            });
            console.log(customerTipResponse);
          }).catch(function(error) {
            console.log(error);
            // TODO: be smarter about showing the error here
            doToast({ message: error.message, isError: true })
          })

          ;

          closeModal();
        } else {
          alert ('Problem!');
        }

      } else {
        sendSupportOrConfirm();
      }
    }
  }

  function handleCustomPriceChange(event: SyntheticInputEvent<*>) {
    const tipAmount = parseFloat(event.target.value);
    setCustomTipAmount(tipAmount);
  }

  function buildButtonText() {
    if (activeTab === 'Boost') {
      return 'Boost This Content';
    } else if (activeTab === 'TipFiat') {
      return 'Send a $' + tipAmount + ' Tip';
    } else if (activeTab === 'TipLBC') {
      return 'Send a ' + tipAmount + ' LBC Tip';
    }
  }

  function shouldDisableAmountSelector(amount) {
    return (amount > balance && activeTab !== 'TipFiat') || (activeTab === 'TipFiat' && (!hasCardSaved || !canReceiveFiatTip));
  }

  function setConfirmLabel() {
    if (activeTab === 'TipLBC') {
      return 'Tipping LBC';
    } else if (activeTab === 'TipFiat') {
      return 'Tipping Fiat (USD)';
    } else if (activeTab === 'Boost') {
      return 'Boosting';
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      {/* if there is no LBC balance, show user frontend to get credits */}
      {noBalance ? (
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
          title={<LbcSymbol postfix={claimIsMine ? __('Boost your content') : __('Support this content')} size={22} />}
          subtitle={
            <React.Fragment>
              {!claimIsMine && (
                <div className="section">
                  {/* tip LBC tab button */}
                  <Button
                    key="tip"
                    icon={ICONS.LBC}
                    label={__('Tip LBC')}
                    button="alt"
                    onClick={() => {
                      if (!isConfirming) {
                        setActiveTab('TipLBC');
                      }
                    }}
                    className={classnames('button-toggle', { 'button-toggle--active': activeTab === 'TipLBC' })}
                  />
                  {/* tip fiat tab button */}
                  <Button
                    key="tip-fiat"
                    icon={ICONS.FINANCE}
                    label={__('Tip Fiat')}
                    button="alt"
                    onClick={() => {
                      if (!isConfirming) {
                        setActiveTab('TipFiat');
                      }
                    }}
                    className={classnames('button-toggle', { 'button-toggle--active': activeTab === 'TipFiat' })}
                  />
                  {/* tip LBC tab button */}
                  <Button
                    key="boost"
                    icon={ICONS.TRENDING}
                    label={__('Boost')}
                    button="alt"
                    onClick={() => {
                      if (!isConfirming) {
                        setActiveTab('Boost');
                      }
                    }}
                    className={classnames('button-toggle', { 'button-toggle--active': activeTab === 'Boost' })}
                  />
                </div>
              )}

              {/* short explainer under the button */}
              <div className="section__subtitle">
                {explainerText}
                {activeTab === 'TipFiat' && !hasCardSaved && <Button navigate={`/$/${PAGES.SETTINGS_STRIPE_CARD}`} label={__('Add A Card')} button="link" />}
                {activeTab !== 'TipFiat' && <Button label={__('Learn more')} button="link" href="https://lbry.com/faq/tipping" />}
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
                      {activeTab === 'TipFiat' ? <p>$ {tipAmount}</p> : <LbcSymbol postfix={tipAmount} size={22} />}
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
            ) : (
              <>
                <div className="section">
                  <ChannelSelector />
                </div>

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
                    disabled={activeTab === 'TipFiat' && (!hasCardSaved || !canReceiveFiatTip)}
                  />
                  {DEFAULT_TIP_AMOUNTS.some((val) => val > balance) && activeTab !== 'TipFiat' && (
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
                          { activeTab !== 'TipFiat' ? <I18nMessage
                            tokens={{ lbc_balance: <CreditAmount precision={4} amount={balance} showLBC={false} /> }}
                          >
                            (%lbc_balance% Credits available)
                          </I18nMessage> : 'in USD' }
                        </React.Fragment>
                      }
                      className="form-field--price-amount"
                      error={tipError && activeTab !== 'TipFiat'}
                      min="0"
                      step="any"
                      type="number"
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
                    disabled={fetchingChannels || isPending ||
                    (tipError && activeTab !== 'TipFiat') || !tipAmount ||
                    (activeTab === 'TipFiat' && (!hasCardSaved || !canReceiveFiatTip))}
                    label={buildButtonText()}
                  />
                  {fetchingChannels && <span className="help">{__('Loading your channels...')}</span>}
                </div>
                {activeTab !== 'TipFiat' ? <WalletSpendableBalanceHelp /> :
                  !canReceiveFiatTip ? <div className="help">Only select creators can receive tips at this time</div> :
                  <div className="help">The payment will be made from your saved card</div>}
              </>
            )
          }
        />
      )}
    </Form>
  );
}

export default WalletSendTip;
