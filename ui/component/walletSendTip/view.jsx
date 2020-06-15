// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import Button from 'component/button';
import { FormField, Form } from 'component/common/form';
import { MINIMUM_PUBLISH_BID, CHANNEL_ANONYMOUS } from 'constants/claim';
import useIsMobile from 'effects/use-is-mobile';
import CreditAmount from 'component/common/credit-amount';
import I18nMessage from 'component/i18nMessage';
import { Lbryio } from 'lbryinc';
import Card from 'component/common/card';
import classnames from 'classnames';
import SelectChannel from 'component/selectChannel';
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
  const [tipAmount, setTipAmount] = React.useState(DEFAULT_TIP_AMOUNTS[0]);
  const [tipError, setTipError] = React.useState();
  const [isSupport, setIsSupport] = React.useState(claimIsMine);
  const [showMore, setShowMore] = React.useState(false);
  const [isConfirming, setIsConfirming] = React.useState(false);
  const isMobile = useIsMobile();
  const [selectedChannel, setSelectedChannel] = usePersistedState('comment-support:channel');
  const { claim_id: claimId } = claim;
  const { channelName } = parseURI(uri);

  const channelStrings = channels && channels.map(channel => channel.permanent_url).join(',');
  React.useEffect(() => {
    if (!selectedChannel && channelStrings) {
      const channels = channelStrings.split(',');
      const newChannelUrl = channels[0];
      const { claimName } = parseURI(newChannelUrl);
      setSelectedChannel(claimName);
    }
  }, [channelStrings]);

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
      tipError = __('Not enough credits');
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
    const tipAmount = parseFloat(event.target.value);
    setTipAmount(tipAmount);
  }

  return (
    <Form onSubmit={handleSubmit}>
      {balance === 0 ? (
        <Card
          title={__('Supporting Content Requires LBC')}
          subtitle={__(
            'With LBC, you can send tips to your favorite creators, or help boost their content for more people to see.'
          )}
          actions={
            <div className="section__actions">
              <Button icon={ICONS.BUY} button="primary" label={__('Buy LBC')} navigate={`/$/${PAGES.BUY}`} />
              <Button button="link" label={__('Nevermind')} onClick={closeModal} />
            </div>
          }
        />
      ) : (
        <Card
          title={claimIsMine ? __('Boost Your Content') : __('Support This Content')}
          subtitle={
            <React.Fragment>
              {__(
                'This will increase the overall bid amount for this content, which will boost its ability to be discovered while active.'
              )}{' '}
              <Button label={__('Learn more')} button="link" href="https://lbry.com/faq/tipping" />.
            </React.Fragment>
          }
          actions={
            isConfirming ? (
              <>
                <div className="section section--padded card--inline confirm__wrapper">
                  <div className="section">
                    <div className="confirm__label">{__('To')}</div>
                    <div className="confirm__value">{channelName || title}</div>
                    <div className="confirm__label">{__('From')}</div>
                    <div className="confirm__value">{selectedChannel}</div>
                    <div className="confirm__label">{__(isSupport ? 'Supporting' : 'Tipping')}</div>
                    <div className="confirm__value">{tipAmount} LBC</div>
                  </div>
                </div>
                <div className="section__actions">
                  <Button autoFocus button="primary" disabled={isPending} label={__('Confirm')} />
                  <Button button="link" label={__('Cancel')} onClick={() => setIsConfirming(false)} />
                </div>
              </>
            ) : (
              <>
                <div className="section">
                  <SelectChannel
                    label="Channel to show support as"
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
                      className={classnames('button-toggle', {
                        'button-toggle--active': tipAmount === amount,
                        'button-toggle--disabled': amount > balance,
                      })}
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
                    disabled={fetchingChannels || isPending || tipError || !tipAmount}
                    label={
                      isSupport
                        ? __('Send Revokable Support')
                        : __('Send a %amount% Tip', { amount: tipAmount ? `${tipAmount} LBC` : '' })
                    }
                  />
                  {fetchingChannels && <span className="help">{__('Loading your channels...')}</span>}
                  {!claimIsMine && !fetchingChannels && (
                    <FormField
                      name="toggle-is-support"
                      type="checkbox"
                      label={__('Make this support permanent')}
                      checked={!isSupport}
                      onChange={() => setIsSupport(!isSupport)}
                    />
                  )}
                </div>
                {DEFAULT_TIP_AMOUNTS.some(val => val > balance) && (
                  <div className="section">
                    <Button button="link" label={__('Buy More LBC')} />
                  </div>
                )}
              </>
            )
          }
        />
      )}
    </Form>
  );
}

export default WalletSendTip;
