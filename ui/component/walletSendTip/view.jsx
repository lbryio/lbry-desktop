// @flow
import { SIMPLE_SITE } from 'config';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import Button from 'component/button';
import { FormField, Form } from 'component/common/form';
import { MINIMUM_PUBLISH_BID, CHANNEL_ANONYMOUS, CHANNEL_NEW } from 'constants/claim';
import CreditAmount from 'component/common/credit-amount';
import I18nMessage from 'component/i18nMessage';
import { Lbryio } from 'lbryinc';
import Card from 'component/common/card';
import classnames from 'classnames';
import SelectChannel from 'component/selectChannel';
import LbcSymbol from 'component/common/lbc-symbol';
import { parseURI } from 'lbry-redux';
import usePersistedState from 'effects/use-persisted-state';

const DEFAULT_TIP_AMOUNTS = [5, 25, 100, 1000];

type SupportParams = { amount: number, claim_id: string, channel_id?: string };

type Props = {
  uri: string,
  claimIsMine: boolean,
  title: string,
  claim: StreamClaim,
  isPending: boolean,
  sendSupport: (SupportParams, boolean) => void,
  closeModal: () => void,
  balance: number,
  isSupport: boolean,
  fetchingChannels: boolean,
  instantTipEnabled: boolean,
  instantTipMax: { amount: number, currency: string },
  channels: ?Array<ChannelClaim>,
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
    channels,
    fetchingChannels,
  } = props;
  const [presetTipAmount, setPresetTipAmount] = usePersistedState('comment-support:presetTip', DEFAULT_TIP_AMOUNTS[0]);
  const [customTipAmount, setCustomTipAmount] = usePersistedState('comment-support:customTip', 1.0);
  const [useCustomTip, setUseCustomTip] = usePersistedState('comment-support:useCustomTip', false);
  const [tipError, setTipError] = React.useState();
  const [sendAsTip, setSendAsTip] = usePersistedState('comment-support:sendAsTip', true);
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [selectedChannel, setSelectedChannel] = usePersistedState('comment-support:channel');
  const { claim_id: claimId } = claim;
  const { channelName } = parseURI(uri);
  const noBalance = balance === 0;

  const channelStrings = channels && channels.map(channel => channel.permanent_url).join(',');
  React.useEffect(() => {
    if (!selectedChannel && channelStrings) {
      const channels = channelStrings.split(',');
      const newChannelUrl = channels[0];
      const { claimName } = parseURI(newChannelUrl);
      setSelectedChannel(claimName);
    }
  }, [channelStrings, selectedChannel, setSelectedChannel]);

  const tipAmount = useCustomTip ? customTipAmount : presetTipAmount;
  const isSupport = claimIsMine ? true : SIMPLE_SITE ? false : !sendAsTip;

  React.useEffect(() => {
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

  function sendSupportOrConfirm(instantTipMaxAmount = null) {
    let selectedChannelId;
    if (selectedChannel !== CHANNEL_ANONYMOUS) {
      const selectedChannelClaim = channels && channels.find(channelClaim => channelClaim.name === selectedChannel);

      if (selectedChannelClaim) {
        selectedChannelId = selectedChannelClaim.claim_id;
      }
    }

    if (
      !isSupport &&
      !isConfirming &&
      (!instantTipMaxAmount || !instantTipEnabled || tipAmount > instantTipMaxAmount)
    ) {
      setIsConfirming(true);
    } else {
      const supportParams: SupportParams = { amount: tipAmount, claim_id: claimId };
      if (selectedChannelId) {
        supportParams.channel_id = selectedChannelId;
      }
      sendSupport(supportParams, isSupport);
      closeModal();
    }
  }

  function handleSubmit() {
    if (selectedChannel === CHANNEL_NEW) {
      // This is the submission to create a new channel, and would
      // be handled by <ChannelSelection>, so do nothing here.
      return;
    }

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

  function handleCustomPriceChange(event: SyntheticInputEvent<*>) {
    const tipAmount = parseFloat(event.target.value);
    setCustomTipAmount(tipAmount);
  }

  return (
    <Form onSubmit={handleSubmit}>
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
              <Button icon={ICONS.BUY} button="secondary" label={__('Buy Credits')} navigate={`/$/${PAGES.BUY}`} />
              <Button button="link" label={__('Nevermind')} onClick={closeModal} />
            </div>
          }
        />
      ) : (
        <Card
          title={
            claimIsMine
              ? __('Boost your content')
              : isSupport
              ? __('Support this content')
              : __('Support --[button to support a claim]--')
          }
          subtitle={
            <React.Fragment>
              {isSupport
                ? __(
                    'This will increase the overall bid amount for this content, which will boost its ability to be discovered while active.'
                  )
                : __('Show this channel your appreciation by sending a donation.')}{' '}
              <Button label={__('Learn more')} button="link" href="https://lbry.com/faq/tipping" />.
            </React.Fragment>
          }
          actions={
            isConfirming ? (
              <>
                <div className="section section--padded card--inline confirm__wrapper">
                  <div className="section">
                    <div className="confirm__label">{__('To --[the tip recipient]--')}</div>
                    <div className="confirm__value">{channelName || title}</div>
                    <div className="confirm__label">{__('From --[the tip sender]--')}</div>
                    <div className="confirm__value">{selectedChannel}</div>
                    <div className="confirm__label">{__(isSupport ? 'Supporting' : 'Tipping')}</div>
                    <div className="confirm__value">
                      <LbcSymbol postfix={tipAmount} size={22} />
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
                  <SelectChannel
                    label={__('Channel to show support as')}
                    channel={selectedChannel}
                    onChannelChange={newChannel => setSelectedChannel(newChannel)}
                  />
                </div>

                <div className="section">
                  {DEFAULT_TIP_AMOUNTS.map(amount => (
                    <Button
                      key={amount}
                      disabled={amount > balance}
                      button="alt"
                      className={classnames('button-toggle button-toggle--expandformobile', {
                        'button-toggle--active': tipAmount === amount,
                        'button-toggle--disabled': amount > balance,
                      })}
                      label={amount}
                      icon={ICONS.LBC}
                      onClick={() => {
                        setPresetTipAmount(amount);
                        setUseCustomTip(false);
                      }}
                    />
                  ))}
                  <Button
                    button="alt"
                    className={classnames('button-toggle button-toggle--expandformobile', {
                      'button-toggle--active': !DEFAULT_TIP_AMOUNTS.includes(tipAmount),
                    })}
                    icon={ICONS.LBC}
                    label={__('Custom')}
                    onClick={() => setUseCustomTip(true)}
                  />
                  {DEFAULT_TIP_AMOUNTS.some(val => val > balance) && (
                    <Button
                      button="secondary"
                      className="button-toggle-group-action"
                      icon={ICONS.BUY}
                      title={__('Buy more LBRY Credits')}
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
                      className="form-field--price-amount"
                      error={tipError}
                      min="0"
                      step="any"
                      type="number"
                      placeholder="1.23"
                      value={customTipAmount}
                      onChange={event => handleCustomPriceChange(event)}
                    />
                  </div>
                )}

                <div className="section__actions">
                  <Button
                    autoFocus
                    // icon={isSupport ? undefined : ICONS.SUPPORT}
                    button="primary"
                    type="submit"
                    disabled={fetchingChannels || isPending || tipError || !tipAmount}
                    label={
                      isSupport
                        ? claimIsMine
                          ? __('Boost This Video')
                          : __('Send Revocable Support')
                        : __('Send a %amount% Tip', { amount: tipAmount ? `${tipAmount} Credit` : '' })
                    }
                  />
                  {fetchingChannels && <span className="help">{__('Loading your channels...')}</span>}
                  {!claimIsMine && !fetchingChannels && !SIMPLE_SITE && (
                    <FormField
                      name="toggle-is-support"
                      type="checkbox"
                      label={__('Make this a tip')}
                      checked={sendAsTip}
                      onChange={() => setSendAsTip(!sendAsTip)}
                    />
                  )}
                </div>
              </>
            )
          }
        />
      )}
    </Form>
  );
}

export default WalletSendTip;
