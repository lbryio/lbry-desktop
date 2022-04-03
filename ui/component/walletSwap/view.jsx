// @flow
import React from 'react';
import Button from 'component/button';
import { FormField, Form } from 'component/common/form';
import { Lbryio } from 'lbryinc';
import Card from 'component/common/card';
import LbcSymbol from 'component/common/lbc-symbol';
import Spinner from 'component/spinner';
import Nag from 'component/common/nag';
import CopyableText from 'component/copyableText';
import Icon from 'component/common/icon';
import QRCode from 'component/common/qr-code';
import usePersistedState from 'effects/use-persisted-state';
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import * as PAGES from 'constants/pages';
import { clipboard } from 'electron';
import I18nMessage from 'component/i18nMessage';
import { Redirect, useHistory } from 'react-router';

const ENABLE_ALTERNATIVE_COINS = true;

const BTC_SATOSHIS = 100000000;
const LBC_MAX = 21000000;
const LBC_MIN = 1;

const IS_DEV = process.env.NODE_ENV !== 'production';
const DEBOUNCE_BTC_CHANGE_MS = 400;

const INTERNAL_APIS_DOWN = 'internal_apis_down';
const BTC_API_STATUS_PENDING = 'NEW'; // Started swap, waiting for coin.
const BTC_API_STATUS_CONFIRMING = 'PENDING'; // Coin receiving, waiting confirmation.
const BTC_API_STATUS_PROCESSING = 'COMPLETED'; // Coin confirmed. Sending LBC.
const BTC_API_STATUS_UNRESOLVED = 'UNRESOLVED'; // Underpaid, overpaid, etc.
const BTC_API_STATUS_EXPIRED = 'EXPIRED'; // Charge expired (60 minutes).
const BTC_API_STATUS_ERROR = 'Error';

const ACTION_MAIN = 'action_main';
const ACTION_STATUS_PENDING = 'action_pending';
const ACTION_STATUS_CONFIRMING = 'action_confirming';
const ACTION_STATUS_PROCESSING = 'action_processing';
const ACTION_STATUS_SUCCESS = 'action_success';
const ACTION_PAST_SWAPS = 'action_past_swaps';

const NAG_API_STATUS_PENDING = 'Waiting to receive your crypto.';
const NAG_API_STATUS_CONFIRMING = 'Confirming transaction.';
const NAG_API_STATUS_PROCESSING = 'Crypto received. Sending your Credits.';
const NAG_API_STATUS_SUCCESS = 'Credits sent. You should see it in your wallet.';
const NAG_API_STATUS_ERROR = 'An error occurred on the previous swap.';
const NAG_SWAP_CALL_FAILED = 'Failed to initiate swap.';
// const NAG_STATUS_CALL_FAILED = 'Failed to query swap status.';
const NAG_SERVER_DOWN = 'The system is currently down. Come back later.';
const NAG_RATE_CALL_FAILED = 'Unable to obtain exchange rate. Try again later.';
const NAG_EXPIRED = 'Swap expired.';

type Props = {
  receiveAddress: string,
  coinSwaps: Array<CoinSwapInfo>,
  isAuthenticated: boolean,
  doToast: ({ message: string }) => void,
  addCoinSwap: (CoinSwapInfo) => void,
  removeCoinSwap: (string) => void,
  getNewAddress: () => void,
  checkAddressIsMine: (string) => void,
  openModal: (string, {}) => void,
  queryCoinSwapStatus: (string) => void,
};

function WalletSwap(props: Props) {
  const {
    receiveAddress,
    doToast,
    coinSwaps,
    isAuthenticated,
    addCoinSwap,
    removeCoinSwap,
    getNewAddress,
    checkAddressIsMine,
    openModal,
    queryCoinSwapStatus,
  } = props;

  const [btc, setBtc] = React.useState(0);
  const [lbcError, setLbcError] = React.useState();
  const [lbc, setLbc] = usePersistedState('swap-desired-lbc', LBC_MIN);
  const [action, setAction] = React.useState(ACTION_MAIN);
  const [nag, setNag] = React.useState(null);
  const [showQr, setShowQr] = React.useState(false);
  const [isFetchingRate, setIsFetchingRate] = React.useState(false);
  const [isSwapping, setIsSwapping] = React.useState(false);
  const [isRefreshingStatus, setIsRefreshingStatus] = React.useState(false);
  const { location } = useHistory();
  const [swap, setSwap] = React.useState({});
  const [coin, setCoin] = React.useState('bitcoin');
  const [lastStatusQuery, setLastStatusQuery] = React.useState();
  const { goBack } = useHistory();

  function formatCoinAmountString(amount) {
    return amount === 0 ? '---' : amount.toLocaleString(undefined, { minimumFractionDigits: 8 });
  }

  function returnToMainAction() {
    setIsSwapping(false);
    setAction(ACTION_MAIN);
    setSwap(null);
  }

  function handleRemoveSwap(chargeCode) {
    openModal(MODALS.CONFIRM, {
      title: __('Remove Swap'),
      subtitle: <I18nMessage tokens={{ address: <em>{`${chargeCode}`}</em> }}>Remove %address%?</I18nMessage>,
      body: <p className="help--warning">{__('This process cannot be reversed.')}</p>,
      onConfirm: (closeModal) => {
        removeCoinSwap(chargeCode);
        closeModal();
      },
    });
  }

  // Ensure 'receiveAddress' is populated
  React.useEffect(() => {
    if (!receiveAddress) {
      getNewAddress();
    } else {
      checkAddressIsMine(receiveAddress);
    }
  }, [receiveAddress, getNewAddress, checkAddressIsMine]);

  // Get 'btc/rate' and calculate required BTC.
  React.useEffect(() => {
    if (isNaN(lbc) || lbc === 0) {
      setBtc(0);
      return;
    }

    setIsFetchingRate(true);

    const timer = setTimeout(() => {
      Lbryio.call('btc', 'rate', { satoshi: BTC_SATOSHIS })
        .then((rate) => {
          setIsFetchingRate(false);
          setBtc((lbc * Math.round(BTC_SATOSHIS * rate)) / BTC_SATOSHIS);
        })
        .catch(() => {
          setIsFetchingRate(false);
          setBtc(0);
          setNag({ msg: NAG_RATE_CALL_FAILED, type: 'error' });
        });
    }, DEBOUNCE_BTC_CHANGE_MS);

    return () => clearTimeout(timer);
  }, [lbc]);

  // Resolve 'swap' with the latest info from 'coinSwaps'
  React.useEffect(() => {
    const swapInfo = swap && coinSwaps.find((x) => x.chargeCode === swap.chargeCode);
    if (!swapInfo) {
      return;
    }

    const jsonSwap = JSON.stringify(swap);
    const jsonSwapInfo = JSON.stringify(swapInfo);
    if (jsonSwap !== jsonSwapInfo) {
      setSwap({ ...swapInfo });
    }

    if (!swapInfo.status) {
      return;
    }

    switch (swapInfo.status.status) {
      case BTC_API_STATUS_PENDING:
        setAction(ACTION_STATUS_PENDING);
        setNag({ msg: NAG_API_STATUS_PENDING, type: 'helpful' });
        break;
      case BTC_API_STATUS_CONFIRMING:
        setAction(ACTION_STATUS_CONFIRMING);
        setNag({ msg: NAG_API_STATUS_CONFIRMING, type: 'helpful' });
        break;
      case BTC_API_STATUS_PROCESSING:
        if (swapInfo.status.lbcTxid) {
          setAction(ACTION_STATUS_SUCCESS);
          setNag({ msg: NAG_API_STATUS_SUCCESS, type: 'helpful' });
          setIsSwapping(false);
        } else {
          setAction(ACTION_STATUS_PROCESSING);
          setNag({ msg: NAG_API_STATUS_PROCESSING, type: 'helpful' });
        }
        break;
      case BTC_API_STATUS_ERROR:
        setNag({ msg: NAG_API_STATUS_ERROR, type: 'error' });
        break;
      case INTERNAL_APIS_DOWN:
        setNag({ msg: NAG_SERVER_DOWN, type: 'error' });
        break;
      case BTC_API_STATUS_EXPIRED:
        setNag({ msg: NAG_EXPIRED, type: 'error' });
        if (action === ACTION_PAST_SWAPS) {
          setAction(ACTION_STATUS_PENDING);
        }
        break;
      case BTC_API_STATUS_UNRESOLVED:
        setNag({
          msg: __(
            'Received amount did not match order code %chargeCode%. Contact hello@lbry.com to resolve the payment.',
            { chargeCode: swapInfo.chargeCode }
          ),
          type: 'error',
        });
        if (action === ACTION_PAST_SWAPS) {
          setAction(ACTION_STATUS_PENDING);
        }
        break;
      default:
        setNag({ msg: swapInfo.status.status, type: 'error' });
        break;
    }
  }, [swap, coinSwaps]);

  // Validate entered LBC
  React.useEffect(() => {
    let msg;
    if (lbc < LBC_MIN) {
      msg = __('The amount needs to be higher');
    } else if (lbc > LBC_MAX) {
      msg = __('The amount is too high');
    }
    setLbcError(msg);
  }, [lbc]);

  // 'Refresh' button feedback
  React.useEffect(() => {
    let timer;
    if (isRefreshingStatus) {
      timer = setTimeout(() => {
        setIsRefreshingStatus(false);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [isRefreshingStatus]);

  function getCoinAddress(coin) {
    if (swap && swap.sendAddresses) {
      return swap.sendAddresses[coin];
    }
    return '';
  }

  function getCoinSendAmountStr(coin) {
    if (swap && swap.sendAmounts && swap.sendAmounts[coin]) {
      return `${swap.sendAmounts[coin].amount} ${swap.sendAmounts[coin].currency}`;
    }
    return '';
  }

  function currencyToCoin(currency) {
    const MAP = {
      DAI: 'dai',
      USDC: 'usdc',
      BTC: 'bitcoin',
      ETH: 'ethereum',
      LTC: 'litecoin',
      BCH: 'bitcoincash',
    };
    return MAP[currency] || 'bitcoin';
  }

  function getSentAmountStr(swapInfo) {
    if (swapInfo && swapInfo.status) {
      const currency = swapInfo.status.receiptCurrency;
      const coin = currencyToCoin(currency);
      return getCoinSendAmountStr(coin);
    }
    return '';
  }

  function getCoinLabel(coin) {
    const COIN_LABEL = {
      dai: 'Dai',
      usdc: 'USD Coin',
      bitcoin: 'Bitcoin',
      ethereum: 'Ethereum',
      litecoin: 'Litecoin',
      bitcoincash: 'Bitcoin Cash',
    };

    return COIN_LABEL[coin] || coin;
  }

  function getLbcAmountStrForSwap(swap) {
    if (swap && swap.lbcAmount) {
      return formatCoinAmountString(swap.lbcAmount);
    }
    return '---';
  }

  function handleStartSwap() {
    setIsSwapping(true);
    setSwap(null);
    setNag(null);

    Lbryio.call('btc', 'swap', {
      lbc_satoshi_requested: parseInt(lbc * BTC_SATOSHIS + 0.5),
      btc_satoshi_provided: parseInt(btc * BTC_SATOSHIS + 0.5),
      pay_to_wallet_address: receiveAddress,
    })
      .then((response) => {
        const btcAmount = response.Charge.data.pricing['bitcoin'].amount;
        const rate = response.Exchange.rate;

        const timeline = response.Charge.data.timeline;
        const lastTimeline = timeline[timeline.length - 1];

        const newSwap = {
          chargeCode: response.Exchange.charge_code,
          coins: Object.keys(response.Charge.data.addresses),
          sendAddresses: response.Charge.data.addresses,
          sendAmounts: response.Charge.data.pricing,
          lbcAmount: (btcAmount * BTC_SATOSHIS) / rate,
          status: {
            status: lastTimeline.status,
            receiptCurrency: lastTimeline.payment.value.currency,
            receiptTxid: lastTimeline.payment.transaction_id,
            lbcTxid: response.Exchange.lbc_txid || '',
          },
        };

        setSwap({ ...newSwap });
        addCoinSwap({ ...newSwap });
      })
      .catch((err) => {
        const translateError = (err) => {
          // TODO: https://github.com/lbryio/lbry.go/issues/87
          // Translate error codes instead of strings when it is available.
          if (err === 'users are currently limited to 4 transactions per month') {
            return __('Users are currently limited to 4 completed swaps per month or 5 pending swaps.');
          }
          return err;
        };
        setNag({ msg: err === INTERNAL_APIS_DOWN ? NAG_SWAP_CALL_FAILED : translateError(err.message), type: 'error' });
        returnToMainAction();
      });
  }

  function handleViewPastSwaps() {
    setAction(ACTION_PAST_SWAPS);
    setNag(null);
    setIsRefreshingStatus(true);

    const now = Date.now();
    if (!lastStatusQuery || now - lastStatusQuery > 30000) {
      // There is a '200/minute' limit in the commerce API. If the history is
      // long, or if the user goes trigger-happy, the limit could be reached
      // easily. Statuses don't change often, so just limit it to every 30s.
      setLastStatusQuery(now);
      coinSwaps.forEach((x) => {
        queryCoinSwapStatus(x.chargeCode);
      });
    }
  }

  function getShortStatusStr(coinSwap: CoinSwapInfo) {
    const swapInfo = coinSwaps.find((x) => x.chargeCode === coinSwap.chargeCode);
    if (!swapInfo || !swapInfo.status) {
      return '---';
    }

    let msg;
    switch (swapInfo.status.status) {
      case BTC_API_STATUS_PENDING:
        msg = __('Waiting');
        break;
      case BTC_API_STATUS_CONFIRMING:
        msg = __('Confirming');
        break;
      case BTC_API_STATUS_PROCESSING:
        if (swapInfo.status.lbcTxid) {
          msg = __('Credits sent');
        } else {
          msg = __('Sending Credits');
        }
        break;
      case BTC_API_STATUS_ERROR:
        msg = __('Failed');
        break;
      case BTC_API_STATUS_EXPIRED:
        msg = __('Expired');
        break;
      case BTC_API_STATUS_UNRESOLVED:
        msg = __('Unresolved');
        break;
      default:
        msg = swapInfo.status.status;
        // if (IS_DEV) throw new Error('Unhandled "status": ' + status.Status);
        break;
    }
    return msg;
  }

  function getViewTransactionElement(swap, isSend) {
    if (!swap || !swap.status) {
      return '';
    }

    const explorerUrl = (coin, txid) => {
      // It's unclear whether we can link to sites like blockchain.com.
      // Don't do it for now.
      return '';
    };

    if (isSend) {
      const sendTxId = swap.status.receiptTxid;
      const url = explorerUrl(swap.status.receiptCurrency, sendTxId);
      return sendTxId ? (
        <>
          {url && <Button button="link" href={url} label={__('View transaction')} />}
          {!url && (
            <Button
              button="link"
              label={__('Copy transaction ID')}
              title={sendTxId}
              onClick={() => {
                clipboard.writeText(sendTxId);
                doToast({
                  message: __('Transaction ID copied.'),
                });
              }}
            />
          )}
        </>
      ) : null;
    } else {
      const lbcTxId = swap.status.lbcTxid;
      return lbcTxId ? (
        <Button button="link" href={`https://explorer.lbry.com/tx/${lbcTxId}`} label={__('View transaction')} />
      ) : null;
    }
  }

  function getCloseButton() {
    return (
      <>
        <Button autoFocus button="primary" label={__('Close')} onClick={() => goBack()} />
        <Icon
          className="icon--help"
          icon={ICONS.HELP}
          tooltip
          size={16}
          customTooltipText={__(
            'This page can be closed while the transactions are in progress.\nYou can view the status later from:\n • Wallet » Swap » View Past Swaps'
          )}
        />
      </>
    );
  }

  function getGap() {
    return <div className="confirm__value" />; // better way?
  }

  function getActionElement() {
    switch (action) {
      case ACTION_MAIN:
        return actionMain;

      case ACTION_STATUS_PENDING:
        return actionPending;

      case ACTION_STATUS_CONFIRMING:
        return actionConfirmingSend;

      case ACTION_STATUS_PROCESSING: // fall-through
      case ACTION_STATUS_SUCCESS:
        return actionProcessingAndSuccess;

      case ACTION_PAST_SWAPS:
        return actionPastSwaps;

      default:
        if (IS_DEV) throw new Error('Unhandled action: ' + action);
        return actionMain;
    }
  }

  const actionMain = (
    <>
      <div className="section section--padded card--inline confirm__wrapper">
        <div className="section">
          <FormField
            autoFocus
            label={
              <I18nMessage
                tokens={{
                  lbc: <LbcSymbol size={22} />,
                }}
              >
                Enter desired %lbc%
              </I18nMessage>
            }
            type="number"
            name="lbc"
            className="form-field--price-amount--auto"
            affixClass="form-field--fix-no-height"
            max={LBC_MAX}
            min={LBC_MIN}
            step={1 / BTC_SATOSHIS}
            placeholder="12.34"
            value={lbc}
            error={lbcError}
            disabled={isSwapping}
            onChange={(event) => setLbc(parseFloat(event.target.value))}
          />
          {getGap()}
          <div className="confirm__label">{__('Estimated BTC price')}</div>
          <div className="confirm__value">
            {formatCoinAmountString(btc)} {btc === 0 ? '' : 'BTC'}
            {isFetchingRate && <Spinner type="small" />}
          </div>
        </div>
      </div>
      <div className="section__actions">
        <Button
          autoFocus
          onClick={handleStartSwap}
          button="primary"
          disabled={isSwapping || isNaN(btc) || btc === 0 || lbc === 0 || lbcError}
          label={isSwapping ? __('Processing...') : __('Start Swap')}
        />
        {!isSwapping && coinSwaps.length !== 0 && (
          <Button button="link" label={__('View Past Swaps')} onClick={handleViewPastSwaps} />
        )}
        {isSwapping && <Spinner type="small" />}
      </div>
    </>
  );

  const actionPending = (
    <>
      <div className="section section--padded card--inline confirm__wrapper">
        <div className="section">
          {swap && swap.coins && ENABLE_ALTERNATIVE_COINS && (
            <>
              <FormField
                type="select"
                name="select_coin"
                value={coin}
                label={__('Alternative coins')}
                onChange={(e) => setCoin(e.target.value)}
              >
                {swap.coins.map((x) => (
                  <option key={x} value={x}>
                    {getCoinLabel(x)}
                  </option>
                ))}
              </FormField>
              {getGap()}
            </>
          )}
          <div className="confirm__label">{__('Send')}</div>
          <CopyableText
            primaryButton
            copyable={getCoinSendAmountStr(coin)}
            snackMessage={__('Amount copied.')}
            onCopy={(inputElem) => {
              const inputStr = inputElem.value;
              const selectEndIndex = inputStr.lastIndexOf(' ');
              if (selectEndIndex > -1 && inputStr.substring(0, selectEndIndex).match(/[\d.]/)) {
                inputElem.setSelectionRange(0, selectEndIndex, 'forward');
              }
            }}
          />
          <div className="help">{__('Use the copy button to ensure the EXACT amount is sent!')}</div>
          {getGap()}
          <div className="confirm__label">{__('To --[the tip recipient]--')}</div>
          <CopyableText primaryButton copyable={getCoinAddress(coin)} snackMessage={__('Address copied.')} />
          <div className="confirm__value--subitem">
            <Button
              button="link"
              label={showQr ? __('Hide QR code') : __('Show QR code')}
              onClick={() => setShowQr(!showQr)}
            />
            {showQr && getCoinAddress(coin) && <QRCode value={getCoinAddress(coin)} />}
          </div>
          {getGap()}
          <div className="confirm__label">{__('Receive')}</div>
          <div className="confirm__value">{<LbcSymbol postfix={getLbcAmountStrForSwap(swap)} size={22} />}</div>
        </div>
      </div>
      <div className="section__actions">{getCloseButton()}</div>
    </>
  );

  const actionConfirmingSend = (
    <>
      <div className="section section--padded card--inline confirm__wrapper">
        <div className="section">
          <div className="confirm__label">{__('Confirming')}</div>
          <div className="confirm__value confirm__value--no-gap">{getSentAmountStr(swap)}</div>
          <div className="confirm__value--subitem">{getViewTransactionElement(swap, true)}</div>
        </div>
      </div>
      <div className="section__actions">{getCloseButton()}</div>
    </>
  );

  const actionProcessingAndSuccess = (
    <>
      <div className="section section--padded card--inline confirm__wrapper">
        <div className="section">
          <div className="confirm__label">{__('Sent')}</div>
          <div className="confirm__value confirm__value--no-gap">{getSentAmountStr(swap)}</div>
          <div className="confirm__value--subitem">{getViewTransactionElement(swap, true)}</div>
          {getGap()}
          <div className="confirm__label">{action === ACTION_STATUS_SUCCESS ? __('Received') : __('Receiving')}</div>
          <div className="confirm__value confirm__value--no-gap">
            {<LbcSymbol postfix={getLbcAmountStrForSwap(swap)} size={22} />}
          </div>
          {action === ACTION_STATUS_SUCCESS && (
            <div className="confirm__value--subitem">{getViewTransactionElement(swap, false)}</div>
          )}
        </div>
      </div>
      <div className="section__actions">{getCloseButton()}</div>
    </>
  );

  const actionPastSwaps = (
    <>
      <div className="section section--padded card--inline confirm__wrapper">
        <div className="section">
          <div className="table__wrapper">
            <table className="table table--btc-swap">
              <thead>
                <tr>
                  <th>{__('Code')}</th>
                  <th>{__('Status')}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {coinSwaps.length === 0 && (
                  <tr>
                    <td>{'---'}</td>
                  </tr>
                )}
                {coinSwaps.length !== 0 &&
                  coinSwaps.map((x) => {
                    return (
                      <tr key={x.chargeCode}>
                        <td>
                          <Button
                            button="link"
                            className="button--hash-id"
                            title={x.chargeCode}
                            label={x.chargeCode}
                            onClick={() => {
                              setSwap({ ...x });
                            }}
                          />
                        </td>
                        <td>{isRefreshingStatus ? '...' : getShortStatusStr(x)}</td>
                        <td>
                          <Button
                            button="link"
                            icon={ICONS.REMOVE}
                            title={__('Remove swap')}
                            onClick={() => handleRemoveSwap(x.chargeCode)}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="section__actions">
        <Button
          autoFocus
          button="primary"
          label={__('Go Back')}
          onClick={() => {
            returnToMainAction();
            setNag(null);
          }}
        />
        {coinSwaps.length !== 0 && !isRefreshingStatus && (
          <Button button="link" label={__('Refresh')} onClick={handleViewPastSwaps} />
        )}
        {isRefreshingStatus && <Spinner type="small" />}
      </div>
    </>
  );

  if (!isAuthenticated) {
    return <Redirect to={`/$/${PAGES.AUTH_SIGNIN}?redirect=${location.pathname}`} />;
  }

  return (
    <Form onSubmit={handleStartSwap}>
      <Card
        title={<I18nMessage tokens={{ lbc: <LbcSymbol size={22} /> }}>Swap Crypto for %lbc%</I18nMessage>}
        subtitle={__(
          'Send crypto to the address provided and you will be sent an equivalent amount of Credits. You can pay with BCH, LTC, ETH, USDC or DAI after starting the swap.'
        )}
        actions={getActionElement()}
        nag={nag ? <Nag relative type={nag.type} message={__(nag.msg)} /> : null}
      />
    </Form>
  );
}

export default WalletSwap;
