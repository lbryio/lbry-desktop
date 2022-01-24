// @flow
import { Form } from 'component/common/form';
import { Lbryio } from 'lbryinc';
import { parseURI } from 'util/lbryURI';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import Button from 'component/button';
import Card from 'component/common/card';
import ChannelSelector from 'component/channelSelector';
import classnames from 'classnames';
import I18nMessage from 'component/i18nMessage';
import LbcSymbol from 'component/common/lbc-symbol';
import React from 'react';
import usePersistedState from 'effects/use-persisted-state';
import WalletTipAmountSelector from 'component/walletTipAmountSelector';

const TAB_BOOST = 'TabBoost';
const TAB_LBC = 'TabLBC';
const TAB_FIAT = 'TabFiat';

type SupportParams = { amount: number, claim_id: string, channel_id?: string };
// REMOVE (fiat only)
// type TipParams = { tipAmount: number, tipChannelName: string, channelClaimId: string };
// type UserParams = { activeChannelName: ?string, activeChannelId: ?string };

type Props = {
  activeChannelClaim: ?ChannelClaim,
  balance: number,
  claim: StreamClaim,
  claimIsMine: boolean,
  fetchingChannels: boolean,
  incognito: boolean,
  instantTipEnabled: boolean,
  instantTipMax: { amount: number, currency: string },
  isPending: boolean,
  isSupport: boolean,
  title: string,
  uri: string,
  doHideModal: () => void,
  doSendTip: (SupportParams, boolean) => void,
};

function WalletSendTip(props: Props) {
  const {
    activeChannelClaim,
    balance,
    claim = {},
    claimIsMine,
    fetchingChannels,
    incognito,
    instantTipEnabled,
    instantTipMax,
    isPending,
    title,
    uri,
    doHideModal,
    doSendTip,
  } = props;

  /** STATE **/

  const [tipAmount, setTipAmount] = usePersistedState('comment-support:customTip', 1.0);
  const [isOnConfirmationPage, setConfirmationPage] = React.useState(false);
  const [tipError, setTipError] = React.useState();
  const [activeTab, setActiveTab] = usePersistedState(TAB_BOOST);
  const [disableSubmitButton, setDisableSubmitButton] = React.useState();

  /** CONSTS **/

  const claimTypeText = getClaimTypeText();
  const isSupport = claimIsMine || activeTab === TAB_BOOST;
  const titleText = claimIsMine
    ? __('Boost Your %claimTypeText%', { claimTypeText })
    : __('Boost This %claimTypeText%', { claimTypeText });
  const { claim_id: claimId } = claim;
  let channelName;
  try {
    ({ channelName } = parseURI(uri));
  } catch (e) {}
  // don't need this - fiat only, for reference REMOVE
  // const activeChannelName = activeChannelClaim && activeChannelClaim.name;
  // const activeChannelId = activeChannelClaim && activeChannelClaim.claim_id;
  //
  // // setup variables for backend tip API
  // const channelClaimId = claim.signing_channel ? claim.signing_channel.claim_id : claim.claim_id;
  // const tipChannelName = claim.signing_channel ? claim.signing_channel.name : claim.name;

  // icon to use or explainer text to show per tab
  let explainerText = '',
    confirmLabel = '';
  switch (activeTab) {
    case TAB_BOOST:
      explainerText = __(
        'This refundable boost will improve the discoverability of this %claimTypeText% while active. ',
        { claimTypeText }
      );
      confirmLabel = __('Boosting');
      break;
    case TAB_FIAT:
      explainerText = __('Show this channel your appreciation by sending a donation in USD. ');
      confirmLabel = __('Tipping Fiat (USD)');
      break;
    case TAB_LBC:
      explainerText = __('Show this channel your appreciation by sending a donation of Credits. ');
      confirmLabel = __('Tipping Credit');
      break;
  }

  /** FUNCTIONS **/

  function getClaimTypeText() {
    switch (claim.value_type) {
      case 'stream':
        return __('Content');
      case 'channel':
        return __('Channel');
      case 'repost':
        return __('Repost');
      case 'collection':
        return __('List');
      default:
        return __('Claim');
    }
  }

  // make call to the backend to send lbc or fiat
  function sendSupportOrConfirm(instantTipMaxAmount = null) {
    if (!isOnConfirmationPage && (!instantTipMaxAmount || !instantTipEnabled || tipAmount > instantTipMaxAmount)) {
      setConfirmationPage(true);
    } else {
      const supportParams: SupportParams = {
        amount: tipAmount,
        claim_id: claimId,
        channel_id: activeChannelClaim && !incognito ? activeChannelClaim.claim_id : undefined,
      };

      // send tip/boost
      doSendTip(supportParams, isSupport);
      doHideModal();
    }
  }

  // when the form button is clicked
  function handleSubmit() {
    if (!tipAmount || !claimId) return;

    // send an instant tip (no need to go to an exchange first)
    if (instantTipEnabled && activeTab !== TAB_FIAT) {
      if (instantTipMax.currency === 'LBC') {
        sendSupportOrConfirm(instantTipMax.amount);
      } else {
        // Need to convert currency of instant purchase maximum before trying to send support
        Lbryio.getExchangeRates().then(({ LBC_USD }) => sendSupportOrConfirm(instantTipMax.amount / LBC_USD));
      }
    } else {
      sendSupportOrConfirm();
    }
  }

  function buildButtonText() {
    // test if frontend will show up as isNan
    function isNan(tipAmount) {
      // testing for NaN ES5 style https://stackoverflow.com/a/35912757/3973137
      // also sometimes it's returned as a string
      // eslint-disable-next-line
      return tipAmount !== tipAmount || tipAmount === 'NaN';
    }

    function convertToTwoDecimals(number) {
      return (Math.round(number * 100) / 100).toFixed(2);
    }

    const amountToShow = activeTab === TAB_FIAT ? convertToTwoDecimals(tipAmount) : tipAmount;

    // if it's a valid number display it, otherwise do an empty string
    const displayAmount = !isNan(tipAmount) ? amountToShow : '';

    // build button text based on tab
    switch (activeTab) {
      case TAB_BOOST:
        return titleText;
      // case TAB_FIAT:
      //   return __('Send a $%displayAmount% Tip', { displayAmount });
      case TAB_LBC:
        return __('Send a %displayAmount% Credit Tip', { displayAmount });
    }
  }

  /** RENDER **/

  const getTabButton = (tabIcon: string, tabLabel: string, tabName: string) => (
    <Button
      key={tabName}
      icon={tabIcon}
      label={tabLabel}
      button="alt"
      onClick={() => {
        const tipInputElement = document.getElementById('tip-input');
        if (tipInputElement) tipInputElement.focus();
        if (!isOnConfirmationPage) setActiveTab(tabName);
      }}
      className={classnames('button-toggle', { 'button-toggle--active': activeTab === tabName })}
    />
  );

  return (
    <Form onSubmit={handleSubmit}>
      {/* if there is no LBC balance, show user frontend to get credits */}
      {/* if there is lbc, the main tip/boost gui with the 3 tabs at the top */}
      <Card
        title={<LbcSymbol postfix={titleText} size={22} />}
        subtitle={
          <>
            {!claimIsMine && (
              <div className="section">
                {/* tip LBC tab button */}
                {getTabButton(ICONS.LBC, __('Tip'), TAB_LBC)}

                {/* support LBC tab button */}
                {getTabButton(ICONS.TRENDING, __('Boost'), TAB_BOOST)}
              </div>
            )}

            {/* short explainer under the button */}
            <div className="section__subtitle">
              {explainerText}
              {/* {activeTab === TAB_FIAT && !hasCardSaved && <Button navigate={`/$/${PAGES.SETTINGS_STRIPE_CARD}`} label={__('Add A Card')} button="link" />} */}
              {<Button label={__('Learn more')} button="link" href="https://lbry.com/faq/tipping" />}
            </div>
          </>
        }
        actions={
          // confirmation modal, allow  user to confirm or cancel transaction
          isOnConfirmationPage ? (
            <>
              <div className="section section--padded card--inline confirm__wrapper">
                <div className="section">
                  <div className="confirm__label">{__('To --[the tip recipient]--')}</div>
                  <div className="confirm__value">{channelName || title}</div>
                  <div className="confirm__label">{__('From --[the tip sender]--')}</div>
                  <div className="confirm__value">
                    {activeChannelClaim && !incognito ? activeChannelClaim.name : __('Anonymous')}
                  </div>
                  <div className="confirm__label">{confirmLabel}</div>
                  <div className="confirm__value">
                    <LbcSymbol postfix={tipAmount} size={22} />
                  </div>
                </div>
              </div>
              <div className="section__actions">
                <Button autoFocus onClick={handleSubmit} button="primary" disabled={isPending} label={__('Confirm')} />
                <Button button="link" label={__('Cancel')} onClick={() => setConfirmationPage(false)} />
              </div>
            </>
          ) : !((activeTab === TAB_LBC || activeTab === TAB_BOOST) && balance === 0) ? (
            <>
              <ChannelSelector />

              {/* section to pick tip/boost amount */}
              <WalletTipAmountSelector
                setTipError={setTipError}
                tipError={tipError}
                claim={claim}
                activeTab={TAB_LBC} // active tab
                amount={tipAmount}
                onChange={(amount) => setTipAmount(amount)}
                setDisableSubmitButton={setDisableSubmitButton}
              />

              {/* send tip/boost button */}
              <div className="section__actions">
                <Button
                  autoFocus
                  icon={isSupport ? ICONS.TRENDING : ICONS.SUPPORT}
                  button="primary"
                  type="submit"
                  disabled={fetchingChannels || isPending || tipError || !tipAmount || disableSubmitButton}
                  label={buildButtonText()}
                />
                {fetchingChannels && <span className="help">{__('Loading your channels...')}</span>}
              </div>
            </>
          ) : (
            // if it's LBC and there is no balance, you can prompt to purchase LBC
            <Card
              title={
                <I18nMessage tokens={{ lbc: <LbcSymbol size={22} /> }}>
                  {__('Supporting content requires %lbc%')}
                </I18nMessage>
              }
              subtitle={
                <I18nMessage tokens={{ lbc: <LbcSymbol /> }}>
                  {__(
                    'With %lbc%, you can send tips to your favorite creators, or help boost their content for more people to see.'
                  )}
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
                  <Button button="link" label={__('Nevermind')} onClick={doHideModal} />
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
