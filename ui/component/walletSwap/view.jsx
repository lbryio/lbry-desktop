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
import QRCode from 'component/common/qr-code';
import usePersistedState from 'effects/use-persisted-state';
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import * as PAGES from 'constants/pages';
import { clipboard } from 'electron';
import I18nMessage from 'component/i18nMessage';
import { Redirect, useHistory } from 'react-router';

const BTC_SATOSHIS = 100000000;
const BTC_MAX = 21000000;
const BTC_MIN = 1 / BTC_SATOSHIS;

const STATUS_FETCH_INTERVAL_MS = 60000;

const IS_DEV = process.env.NODE_ENV !== 'production';
const DEBOUNCE_BTC_CHANGE_MS = 400;

const INTERNAL_APIS_DOWN = 'internal_apis_down';
const BTC_API_STATUS_PENDING = 'Pending';
const BTC_API_STATUS_PROCESSING = 'Processing';
const BTC_API_STATUS_CONFIRMING = 'Confirming';
const BTC_API_STATUS_SUCCESS = 'Success';
const BTC_API_STATUS_ERROR = 'Error';

const ACTION_MAIN = 'action_main';
const ACTION_STATUS_PENDING = 'action_pending';
const ACTION_STATUS_CONFIRMING = 'action_confirming';
const ACTION_STATUS_PROCESSING = 'action_processing';
const ACTION_STATUS_SUCCESS = 'action_success';
const ACTION_PAST_SWAPS = 'action_past_swaps';

const NAG_API_STATUS_PENDING = 'Waiting to receive your bitcoin.';
const NAG_API_STATUS_CONFIRMING = 'Confirming BTC transaction.';
const NAG_API_STATUS_PROCESSING = 'Bitcoin received. Sending your LBC.';
const NAG_API_STATUS_SUCCESS = 'LBC sent. You should see it in your wallet.';
const NAG_API_STATUS_ERROR = 'An error occurred on the previous swap.';
const NAG_SWAP_CALL_FAILED = 'Failed to initiate swap.';
// const NAG_STATUS_CALL_FAILED = 'Failed to query swap status.';
const NAG_SERVER_DOWN = 'The system is currently down. Come back later.';
const NAG_RATE_CALL_FAILED = 'Unable to obtain exchange rate. Try again later.';

type Props = {
  receiveAddress: string,
  coinSwaps: Array<CoinSwapInfo>,
  isAuthenticated: boolean,
  doToast: ({ message: string }) => void,
  addCoinSwap: (CoinSwapInfo) => void,
  getNewAddress: () => void,
  checkAddressIsMine: (string) => void,
  openModal: (string, {}) => void,
};

function WalletSwap(props: Props) {
  const {
    receiveAddress,
    doToast,
    coinSwaps,
    isAuthenticated,
    addCoinSwap,
    getNewAddress,
    checkAddressIsMine,
    openModal,
  } = props;

  const [btc, setBtc] = usePersistedState('swap-btc-amount', 0.001);
  const [btcError, setBtcError] = React.useState();
  const [btcAddress, setBtcAddress] = React.useState();
  const [lbc, setLbc] = React.useState(0);
  const [action, setAction] = React.useState(ACTION_MAIN);
  const [nag, setNag] = React.useState(null);
  const [showQr, setShowQr] = React.useState(false);
  const [isFetchingRate, setIsFetchingRate] = React.useState(false);
  const [isSwapping, setIsSwapping] = React.useState(false);
  const [statusMap, setStatusMap] = React.useState({});
  const [isRefreshingStatus, setIsRefreshingStatus] = React.useState(false);
  const { location } = useHistory();

  const status = btcAddress ? statusMap[btcAddress] : null;
  const btcTxId = status && status.receipt_txid ? status.receipt_txid : null;
  const lbcTxId = status && status.lbc_txid ? status.lbc_txid : null;

  function formatLbcString(lbc) {
    return lbc === 0 ? '---' : lbc.toLocaleString(undefined, { minimumFractionDigits: 8 });
  }

  function returnToMainAction() {
    setIsSwapping(false);
    setAction(ACTION_MAIN);
    setBtcAddress(null);
  }

  function removeCoinSwap(sendAddress) {
    openModal(MODALS.CONFIRM_REMOVE_BTC_SWAP_ADDRESS, {
      sendAddress: sendAddress,
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

  // Get 'btc::rate'
  React.useEffect(() => {
    if (isNaN(btc) || btc === 0) {
      setLbc(0);
      return;
    }

    setIsFetchingRate(true);

    const timer = setTimeout(() => {
      Lbryio.call('btc', 'rate', { satoshi: BTC_SATOSHIS })
        .then((result) => {
          setIsFetchingRate(false);
          setLbc(btc / result);
        })
        .catch((e) => {
          setIsFetchingRate(false);
          setLbc(0);
          setNag({ msg: NAG_RATE_CALL_FAILED, type: 'error' });
        });
    }, DEBOUNCE_BTC_CHANGE_MS);

    return () => clearTimeout(timer);
  }, [btc]);

  function queryStatus(btcAddress, successCb, failureCb) {
    Lbryio.call('btc', 'status', { pay_to_address: btcAddress })
      .then((result) => {
        setStatusMap((statusMap) => {
          const tmpMap = { ...statusMap };
          if (btcAddress) {
            tmpMap[btcAddress] = result;
          }
          return tmpMap;
        });
        if (successCb) successCb(result);
      })
      .catch((err) => {
        if (failureCb) failureCb(err);
      });
  }

  // Poll 'btc::status'
  React.useEffect(() => {
    function fetchBtcStatus() {
      queryStatus(
        btcAddress,
        (result) => {
          switch (result.Status) {
            case BTC_API_STATUS_PENDING:
              setAction(ACTION_STATUS_PENDING);
              setNag({ msg: NAG_API_STATUS_PENDING, type: 'helpful' });
              break;
            case BTC_API_STATUS_CONFIRMING:
              setAction(ACTION_STATUS_CONFIRMING);
              setNag({ msg: NAG_API_STATUS_CONFIRMING, type: 'helpful' });
              break;
            case BTC_API_STATUS_PROCESSING:
              setAction(ACTION_STATUS_PROCESSING);
              setNag({ msg: NAG_API_STATUS_PROCESSING, type: 'helpful' });
              break;
            case BTC_API_STATUS_SUCCESS:
              setAction(ACTION_STATUS_SUCCESS);
              setNag({ msg: NAG_API_STATUS_SUCCESS, type: 'helpful' });
              setIsSwapping(false);
              break;
            case BTC_API_STATUS_ERROR:
              setNag({ msg: NAG_API_STATUS_ERROR, type: 'error' });
              returnToMainAction();
              break;
            default:
              if (IS_DEV) throw new Error('Unhandled status: "' + result.Status + '"');
              break;
          }
        },
        (err) => {
          returnToMainAction();
          setNag({
            msg: err === INTERNAL_APIS_DOWN ? NAG_SERVER_DOWN : err.message /* NAG_STATUS_CALL_FAILED */,
            type: 'error',
          });
        }
      );
    }

    let fetchInterval;
    if (btcAddress && isSwapping) {
      fetchBtcStatus();
      fetchInterval = setInterval(fetchBtcStatus, STATUS_FETCH_INTERVAL_MS);
    }

    return () => {
      if (fetchInterval) {
        clearInterval(fetchInterval);
      }
    };
  }, [btcAddress, isSwapping]);

  // Validate entered BTC
  React.useEffect(() => {
    let msg;
    if (btc < BTC_MIN) {
      msg = __('The BTC amount needs to be higher');
    } else if (btc > BTC_MAX) {
      msg = __('The BTC amount is too high');
    }
    setBtcError(msg);
  }, [btc]);

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

  function handleStartSwap() {
    setIsSwapping(true);
    setBtcAddress(null);
    setNag(null);

    Lbryio.call('btc', 'swap', {
      lbc_satoshi_requested: parseInt(lbc * BTC_SATOSHIS),
      btc_satoshi_provided: parseInt(btc * BTC_SATOSHIS),
      pay_to_wallet_address: receiveAddress,
    })
      .then((result) => {
        setBtcAddress(result);
        addCoinSwap({
          coin: 'btc',
          sendAddress: result,
          sendAmount: btc,
          lbcAmount: lbc,
        });
      })
      .catch((err) => {
        setNag({ msg: err === INTERNAL_APIS_DOWN ? NAG_SWAP_CALL_FAILED : err.message, type: 'error' });
        returnToMainAction();
      });
  }

  function handleCancelPending() {
    returnToMainAction();
    setNag(null);
  }

  function handleBtcChange(event: SyntheticInputEvent<*>) {
    const btc = parseFloat(event.target.value);
    setBtc(btc);
  }

  function handleViewPastSwaps() {
    setAction(ACTION_PAST_SWAPS);
    setNag(null);
    setIsRefreshingStatus(true);

    coinSwaps.forEach((x) => {
      queryStatus(x.sendAddress, null, null);
    });
  }

  function getShortStatusStr(coinSwap: CoinSwapInfo) {
    const status = statusMap[coinSwap.sendAddress];
    if (!status) {
      return '---';
    }

    let msg;
    switch (status.Status) {
      case BTC_API_STATUS_PENDING:
        msg = __('Waiting %sendAmount% BTC', { sendAmount: coinSwap.sendAmount });
        break;
      case BTC_API_STATUS_CONFIRMING:
        msg = __('Confirming %sendAmount% BTC', { sendAmount: coinSwap.sendAmount });
        break;
      case BTC_API_STATUS_PROCESSING:
        msg = __('Sending LBC');
        break;
      case BTC_API_STATUS_SUCCESS:
        msg = __('Completed');
        break;
      case BTC_API_STATUS_ERROR:
        msg = __('Failed');
        break;
      default:
        msg = '?';
        // if (IS_DEV) throw new Error('Unhandled "status": ' + status.Status);
        break;
    }
    return msg;
  }

  function getViewTransactionElement(isSend) {
    if (isSend) {
      return btcTxId ? (
        <Button button="link" href={`https://www.blockchain.com/btc/tx/${btcTxId}`} label={__('View transaction')} />
      ) : null;
    } else {
      return lbcTxId ? (
        <Button button="link" href={`https://explorer.lbry.com/tx/${lbcTxId}`} label={__('View transaction')} />
      ) : null;
    }
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
            label={__('Bitcoin')}
            type="number"
            name="btc"
            className="form-field--price-amount--auto"
            affixClass="form-field--fix-no-height"
            max={BTC_MAX}
            min={BTC_MIN}
            step={1 / BTC_SATOSHIS}
            placeholder="12.34"
            value={btc}
            error={btcError}
            disabled={isSwapping}
            onChange={(event) => handleBtcChange(event)}
          />
          <div className="confirm__value" />
          <div className="confirm__label">{__('Credits')}</div>
          <div className="confirm__value">
            <LbcSymbol postfix={formatLbcString(lbc)} size={22} />
            {isFetchingRate && <Spinner type="small" />}
          </div>
        </div>
      </div>
      <div className="section__actions">
        <Button
          autoFocus
          onClick={handleStartSwap}
          button="primary"
          disabled={isSwapping || isNaN(btc) || btc === 0 || lbc === 0 || btcError}
          label={isSwapping ? __('Processing...') : __('Start Swap')}
        />
        {coinSwaps.length !== 0 && <Button button="link" label={__('View Past Swaps')} onClick={handleViewPastSwaps} />}
      </div>
    </>
  );

  const actionPending = (
    <>
      <div className="section section--padded card--inline confirm__wrapper">
        <div className="section">
          <div className="confirm__label">{__('Send')}</div>
          <div className="confirm__value">{btc} BTC</div>
          <div className="confirm__label">{__('To')}</div>
          <CopyableText primaryButton copyable={btcAddress} snackMessage={__('Address copied.')} />
          <div className="card__actions--inline">
            <Button
              button="link"
              label={showQr ? __('Hide QR code') : __('Show QR code')}
              onClick={() => setShowQr(!showQr)}
            />
            {showQr && btcAddress && <QRCode value={btcAddress} />}
          </div>
          <div className="confirm__value" />
          <div className="confirm__label">{__('Receive')}</div>
          <div className="confirm__value">{<LbcSymbol postfix={formatLbcString(lbc)} size={22} />}</div>
        </div>
      </div>
      <div className="section__actions">
        <Button autoFocus onClick={handleCancelPending} button="primary" label={__('Go Back')} />
      </div>
    </>
  );

  const actionConfirmingSend = (
    <>
      <div className="section section--padded card--inline confirm__wrapper">
        <div className="section">
          <div className="confirm__label">{__('Confirming')}</div>
          <div className="confirm__value">{btc} BTC</div>
          {getViewTransactionElement(true)}
        </div>
      </div>
      <div className="section__actions">
        <Button autoFocus onClick={handleCancelPending} button="primary" label={__('Go Back')} />
      </div>
    </>
  );

  const actionProcessingAndSuccess = (
    <>
      <div className="section section--padded card--inline confirm__wrapper">
        <div className="section">
          <div className="confirm__label">{__('Sent')}</div>
          <div className="confirm__value">{btc} BTC</div>
          {getViewTransactionElement(true)}
          <div className="confirm__value" />
          <div className="confirm__label">{action === ACTION_STATUS_SUCCESS ? __('Received') : __('Receiving')}</div>
          <div className="confirm__value">{<LbcSymbol postfix={formatLbcString(lbc)} size={22} />}</div>
          {action === ACTION_STATUS_SUCCESS && getViewTransactionElement(false)}
        </div>
      </div>
      <div className="section__actions">
        <Button autoFocus onClick={handleCancelPending} button="primary" label={__('Go Back')} />
      </div>
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
                  <th>{__('Address')}</th>
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
                      <tr key={x.sendAddress}>
                        <td>
                          <Button
                            button="link"
                            className="button--hash-id"
                            title={x.sendAddress}
                            label={x.sendAddress.substring(0, 7)}
                            onClick={() => {
                              clipboard.writeText(x.sendAddress);
                              doToast({
                                message: __('Address copied.'),
                              });
                            }}
                          />
                        </td>
                        <td>{isRefreshingStatus ? '...' : getShortStatusStr(x)}</td>
                        <td>
                          <Button
                            button="link"
                            icon={ICONS.REMOVE}
                            title={__('Remove address')}
                            onClick={() => removeCoinSwap(x.sendAddress)}
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
        <Button autoFocus onClick={handleCancelPending} button="primary" label={__('Go Back')} />
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
        title={<I18nMessage tokens={{ lbc: <LbcSymbol size={22} /> }}>Swap Bitcoin for %lbc%</I18nMessage>}
        subtitle={__('Send bitcoin to the address provided and you will be sent an equivalent amount of Credits.')}
        actions={getActionElement()}
        nag={nag ? <Nag relative type={nag.type} message={__(nag.msg)} /> : null}
      />
    </Form>
  );
}

export default WalletSwap;
