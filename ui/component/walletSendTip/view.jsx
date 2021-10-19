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
import { parseURI } from 'util/lbryURI';
import usePersistedState from 'effects/use-persisted-state';
import WalletSpendableBalanceHelp from 'component/walletSpendableBalanceHelp';

const DEFAULT_TIP_AMOUNTS = [1, 5, 25, 100];

const TAB_BOOST = 'TabBoost';
const TAB_LBC = 'TabLBC';
type SupportParams = { amount: number, claim_id: string, channel_id?: string };

type Props = {
  uri: string,
  claimIsMine: boolean,
  title: string,
  claim: StreamClaim,
  isPending: boolean,
  isSupport: boolean,
  sendSupport: (SupportParams, boolean) => void,
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
  } = props;

  /** REACT STATE **/
  const [presetTipAmount, setPresetTipAmount] = usePersistedState('comment-support:presetTip', DEFAULT_TIP_AMOUNTS[0]);
  const [customTipAmount, setCustomTipAmount] = usePersistedState('comment-support:customTip', 1.0);
  const [useCustomTip, setUseCustomTip] = usePersistedState('comment-support:useCustomTip', false);
  const [isConfirming, setIsConfirming] = React.useState(false);

  // show the tip error on the frontend
  const [tipError, setTipError] = React.useState();

  // denote which tab to show on the frontend
  const [activeTab, setActiveTab] = usePersistedState(TAB_BOOST);

  // handle default active tab
  React.useEffect(() => {
    // force to boost tab if it's someone's own upload
    if (claimIsMine) {
      setActiveTab(TAB_BOOST);
    } else {
      // or set LBC tip as the default if none is set yet
      if (!activeTab || activeTab === 'undefined') {
        setActiveTab(TAB_LBC);
      }
    }
  }, []);

  // alphanumeric claim id
  const { claim_id: claimId } = claim;

  // channel name used in url
  const { channelName } = parseURI(uri);

  // focus tip element if it exists
  React.useEffect(() => {
    const tipInputElement = document.getElementById('tip-input');
    if (tipInputElement) {
      tipInputElement.focus();
    }
  }, []);

  // if user has no balance, used to show conditional frontend
  const noBalance = balance === 0;

  // the tip amount, based on if a preset or custom tip amount is being used
  const tipAmount = useCustomTip ? customTipAmount : presetTipAmount;

  // get type of claim (stream/channel/repost/collection) for display on frontend
  function getClaimTypeText() {
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
  const claimTypeText = getClaimTypeText();

  // icon to use or explainer text to show per tab
  let iconToUse;
  let explainerText = '';
  if (activeTab === TAB_BOOST) {
    iconToUse = ICONS.LBC;
    explainerText = __('This refundable boost will improve the discoverability of this %claimTypeText% while active.', {
      claimTypeText,
    });
  } else if (activeTab === TAB_LBC) {
    iconToUse = ICONS.LBC;
    explainerText = __('Show this channel your appreciation by sending a donation of Credits.');
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
    else {
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
    }

    setTipError(tipError);
  }, [tipAmount, balance, setTipError, activeTab]);

  // make call to the backend to send lbc or fiat
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
      if (instantTipEnabled) {
        if (instantTipMax.currency === 'LBC') {
          sendSupportOrConfirm(instantTipMax.amount);
        } else {
          // Need to convert currency of instant purchase maximum before trying to send support
          Lbryio.getExchangeRates().then(({ LBC_USD }) => {
            sendSupportOrConfirm(instantTipMax.amount / LBC_USD);
          });
        }
        // sending fiat tip
      } else {
        sendSupportOrConfirm();
      }
    }
  }

  function handleCustomPriceChange(event: SyntheticInputEvent<*>) {
    let tipAmountAsString = event.target.value;

    let tipAmount = parseFloat(tipAmountAsString);
    setCustomTipAmount(tipAmount);
  }

  function buildButtonText() {
    // test if frontend will show up as isNan
    function isNan(tipAmount) {
      // testing for NaN ES5 style https://stackoverflow.com/a/35912757/3973137
      // also sometimes it's returned as a string
      // eslint-disable-next-line
      return tipAmount !== tipAmount || tipAmount === 'NaN';
    }

    // if it's a valid number display it, otherwise do an empty string
    const displayAmount = !isNan(tipAmount) ? tipAmount : '';

    // build button text based on tab
    if (activeTab === TAB_BOOST) {
      return claimIsMine
        ? __('Boost Your %claimTypeText%', { claimTypeText })
        : __('Boost This %claimTypeText%', { claimTypeText });
    } else if (activeTab === TAB_LBC) {
      return __('Send a %displayAmount% Credit Tip', { displayAmount });
    }
  }

  // dont allow user to click send button
  function shouldDisableAmountSelector(amount) {
    return amount > balance;
  }

  // showed on confirm page above amount
  function setConfirmLabel() {
    if (activeTab === TAB_LBC) {
      return __('Tipping Credit');
    } else if (activeTab === TAB_BOOST) {
      return __('Boosting');
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      {/* if there is no LBC balance, show user frontend to get credits */}
      {/* if there is lbc, the main tip/boost gui with the 3 tabs at the top */}
      <Card
        title={
          <LbcSymbol
            postfix={
              claimIsMine
                ? __('Boost Your %claimTypeText%', { claimTypeText })
                : __('Support This %claimTypeText%', { claimTypeText })
            }
            size={22}
          />
        }
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
                    const tipInputElement = document.getElementById('tip-input');
                    if (tipInputElement) {
                      tipInputElement.focus();
                    }
                    if (!isConfirming) {
                      setActiveTab(TAB_LBC);
                    }
                  }}
                  className={classnames('button-toggle', { 'button-toggle--active': activeTab === TAB_LBC })}
                />
                {/* tip LBC tab button */}
                <Button
                  key="boost"
                  icon={ICONS.TRENDING}
                  label={__('Boost')}
                  button="alt"
                  onClick={() => {
                    const tipInputElement = document.getElementById('tip-input');
                    if (tipInputElement) {
                      tipInputElement.focus();
                    }
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
                    <LbcSymbol postfix={tipAmount} size={22} />
                  </div>
                </div>
              </div>
              <div className="section__actions">
                <Button autoFocus onClick={handleSubmit} button="primary" disabled={isPending} label={__('Confirm')} />
                <Button button="link" label={__('Cancel')} onClick={() => setIsConfirming(false)} />
              </div>
            </>
          ) : !((activeTab === TAB_LBC || activeTab === TAB_BOOST) && noBalance) ? (
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
                  // disabled if it's receive fiat and there is no card or creator can't receive tips
                />

                {DEFAULT_TIP_AMOUNTS.some((val) => val > balance) && (
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
                        <I18nMessage
                          tokens={{ lbc_balance: <CreditAmount precision={4} amount={balance} showLBC={false} /> }}
                        >
                          (%lbc_balance% Credits available)
                        </I18nMessage>
                      </React.Fragment>
                    }
                    error={tipError}
                    min="0"
                    step="any"
                    type="number"
                    style={{
                      width: '160px',
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
                  disabled={fetchingChannels || isPending || tipError || !tipAmount}
                  label={buildButtonText()}
                />
                {fetchingChannels && <span className="help">{__('Loading your channels...')}</span>}
              </div>
              <WalletSpendableBalanceHelp />
            </>
          ) : (
            // if it's LBC and there is no balance, you can prompt to purchase LBC
            <Card
              title={
                <I18nMessage tokens={{ lbc: <LbcSymbol size={22} /> }}>Supporting content requires %lbc%</I18nMessage>
              }
              subtitle={
                <I18nMessage tokens={{ lbc: <LbcSymbol /> }}>
                  With %lbc%, you can send tips to your favorite creators, or help boost their content for more people
                  to see.
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
                  <Button
                    icon={ICONS.BUY}
                    button="secondary"
                    label={__('Buy/Swap Credits')}
                    navigate={`/$/${PAGES.BUY}`}
                  />
                  <Button button="link" label={__('Nevermind')} onClick={closeModal} />
                </div>
              }
            />
          )
        }
      />
    </Form>
  );
}

export default WalletSendTip;
