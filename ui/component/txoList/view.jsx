// @flow
import * as ICONS from 'constants/icons';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import * as TXO from 'constants/txo_list';
import TransactionListTable from 'component/transactionListTable';
import Paginate from 'component/common/paginate';
import { FormField } from 'component/common/form-components/form-field';
import Button from 'component/button';
import Card from 'component/common/card';
import { toCapitalCase } from 'util/string';
import classnames from 'classnames';
import HelpLink from 'component/common/help-link';
import FileExporter from 'component/common/file-exporter';
import WalletFiatPaymentHistory from 'component/walletFiatPaymentHistory';
import WalletFiatAccountHistory from 'component/walletFiatAccountHistory';
import { Lbryio } from 'lbryinc';
import { getStripeEnvironment } from 'util/stripe';
let stripeEnvironment = getStripeEnvironment();

// constants to be used in query params
const QUERY_NAME_CURRENCY = 'currency';
const QUERY_NAME_TAB = 'tab';
const QUERY_NAME_FIAT_TYPE = 'fiatType';
// TODO: this tab will be renamed
const DEFAULT_CURRENCY_PARAM = 'credits';
const DEFAULT_TAB_PARAM = 'fiat-payment-history';
const DEFAULT_FIAT_TYPE_PARAM = 'incoming';

type Props = {
  search: string,
  history: { action: string, push: (string) => void, replace: (string) => void },
  txoPage: Array<Transaction>,
  txoPageNumber: string,
  txoItemCount: number,
  fetchTxoPage: () => void,
  fetchTransactions: () => void,
  isFetchingTransactions: boolean,
  transactionsFile: string,
  updateTxoPageParams: (any) => void,
  toast: (string, boolean) => void,
};

type Delta = {
  changedParameterKey: string,
  value: string,
};

function TxoList(props: Props) {
  const {
    search,
    txoPage,
    txoItemCount,
    fetchTxoPage,
    fetchTransactions,
    updateTxoPageParams,
    history,
    isFetchingTransactions,
    transactionsFile,
  } = props;

  const [accountTransactionResponse, setAccountTransactionResponse] = React.useState([]);
  const [customerTransactions, setCustomerTransactions] = React.useState([]);

  function getPaymentHistory() {
    return Lbryio.call(
      'customer',
      'list',
      {
        environment: stripeEnvironment,
      },
      'post'
    );
  }

  function getAccountTransactions() {
    return Lbryio.call(
      'account',
      'list',
      {
        environment: stripeEnvironment,
      },
      'post'
    );
  }

  // calculate account transactions section
  React.useEffect(() => {
    (async function () {
      try {
        const accountTransactionResponse = await getAccountTransactions();

        // reverse so order is from most recent to latest
        if (accountTransactionResponse && accountTransactionResponse.length) {
          accountTransactionResponse.reverse();
        }

        // TODO: remove this once pagination is implemented
        if (
          accountTransactionResponse &&
          accountTransactionResponse.length &&
          accountTransactionResponse.length > 100
        ) {
          accountTransactionResponse.length = 100;
        }

        setAccountTransactionResponse(accountTransactionResponse);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  // populate customer payment data
  React.useEffect(() => {
    (async function () {
      try {
        // get card payments customer has made
        let customerTransactionResponse = await getPaymentHistory();
        // console.log('amount of transactions');
        // console.log(customerTransactionResponse.length);

        // reverse so order is from most recent to latest
        if (customerTransactionResponse && customerTransactionResponse.length) {
          customerTransactionResponse.reverse();
        }

        // TODO: remove this once pagination is implemented
        if (
          customerTransactionResponse &&
          customerTransactionResponse.length &&
          customerTransactionResponse.length > 100
        ) {
          customerTransactionResponse.length = 100;
        }

        setCustomerTransactions(customerTransactionResponse);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const urlParams = new URLSearchParams(search);
  const page = urlParams.get(TXO.PAGE) || String(1);
  const pageSize = urlParams.get(TXO.PAGE_SIZE) || String(TXO.PAGE_SIZE_DEFAULT);
  const type = urlParams.get(TXO.TYPE) || TXO.ALL;
  const subtype = urlParams.get(TXO.SUB_TYPE);
  const active = urlParams.get(TXO.ACTIVE) || TXO.ALL;
  const currency = urlParams.get(QUERY_NAME_CURRENCY) || DEFAULT_CURRENCY_PARAM;
  const fiatType = urlParams.get(QUERY_NAME_FIAT_TYPE) || DEFAULT_FIAT_TYPE_PARAM;
  // tab used in the wallet section
  // TODO: need to change this eventually
  const tab = urlParams.get(QUERY_NAME_TAB) || DEFAULT_TAB_PARAM;

  const currentUrlParams = {
    page,
    pageSize,
    active,
    type,
    subtype,
    currency,
    fiatType,
    tab,
  };

  const hideStatus =
    type === TXO.SENT || (currentUrlParams.type === TXO.RECEIVED && currentUrlParams.subtype !== TXO.TIP);

  // this is for sdk params
  const params = {};
  if (currentUrlParams.type) {
    if (currentUrlParams.type === TXO.ALL) {
      params[TXO.EXCLUDE_INTERNAL_TRANSFERS] = true;
      params[TXO.IS_MY_INPUT_OR_OUTPUT] = true;
    } else if (currentUrlParams.type === TXO.SENT) {
      params[TXO.IS_MY_INPUT] = true;
      params[TXO.IS_NOT_MY_OUTPUT] = true;
      if (currentUrlParams.subtype === TXO.TIP) {
        params[TXO.TX_TYPE] = TXO.SUPPORT;
      } else if (currentUrlParams.subtype === TXO.PURCHASE) {
        params[TXO.TX_TYPE] = TXO.PURCHASE;
      } else if (currentUrlParams.subtype === TXO.PAYMENT) {
        params[TXO.TX_TYPE] = TXO.OTHER;
      } else {
        params[TXO.TX_TYPE] = [TXO.OTHER, TXO.PURCHASE, TXO.SUPPORT];
      }
    } else if (currentUrlParams.type === TXO.RECEIVED) {
      params[TXO.IS_MY_OUTPUT] = true;
      params[TXO.IS_NOT_MY_INPUT] = true;
      if (currentUrlParams.subtype === TXO.TIP) {
        params[TXO.TX_TYPE] = TXO.SUPPORT;
      } else if (currentUrlParams.subtype === TXO.PURCHASE) {
        params[TXO.TX_TYPE] = TXO.PURCHASE;
      } else if (currentUrlParams.subtype === TXO.PAYMENT) {
        params[TXO.TX_TYPE] = TXO.OTHER;
        params[TXO.EXCLUDE_INTERNAL_TRANSFERS] = true;
      } else {
        params[TXO.TX_TYPE] = [TXO.OTHER, TXO.PURCHASE, TXO.SUPPORT];
      }
    } else if (currentUrlParams.type === TXO.SUPPORT) {
      params[TXO.TX_TYPE] = TXO.SUPPORT;
      params[TXO.IS_MY_INPUT] = true;
      params[TXO.IS_MY_OUTPUT] = true;
    } else if (currentUrlParams.type === TXO.CHANNEL || currentUrlParams.type === TXO.REPOST) {
      params[TXO.TX_TYPE] = currentUrlParams.type;
    } else if (currentUrlParams.type === TXO.PUBLISH) {
      params[TXO.TX_TYPE] = TXO.STREAM;
    }
  }
  if (currentUrlParams.active) {
    if (currentUrlParams.active === 'spent') {
      params[TXO.IS_SPENT] = true;
    } else if (currentUrlParams.active === 'active') {
      params[TXO.IS_NOT_SPENT] = true;
    }
  }

  if (currentUrlParams.page) params[TXO.PAGE] = Number(page);
  if (currentUrlParams.pageSize) params[TXO.PAGE_SIZE] = Number(pageSize);

  function handleChange(delta: Delta) {
    const url = updateUrl(delta);
    history.push(url);
  }

  function updateUrl(delta: Delta) {
    const newUrlParams = new URLSearchParams();

    switch (delta.changedParameterKey) {
      case TXO.PAGE:
        if (currentUrlParams.type) {
          newUrlParams.set(TXO.TYPE, currentUrlParams.type);
        }
        if (currentUrlParams.subtype) {
          newUrlParams.set(TXO.SUB_TYPE, currentUrlParams.subtype);
        }
        if (currentUrlParams.active) {
          newUrlParams.set(TXO.ACTIVE, currentUrlParams.active);
        }
        newUrlParams.set(TXO.PAGE, delta.value);
        newUrlParams.set(QUERY_NAME_TAB, currentUrlParams.tab);
        newUrlParams.set(QUERY_NAME_CURRENCY, currentUrlParams.currency);
        break;
      case TXO.TYPE:
        newUrlParams.set(TXO.TYPE, delta.value);
        if (delta.value === TXO.SENT || delta.value === TXO.RECEIVED) {
          newUrlParams.set(TXO.ACTIVE, 'all');
          if (currentUrlParams.subtype) {
            newUrlParams.set(TXO.SUB_TYPE, currentUrlParams.subtype);
          } else {
            newUrlParams.set(TXO.SUB_TYPE, 'all');
          }
        }
        if (currentUrlParams.active && !hideStatus) {
          newUrlParams.set(TXO.ACTIVE, currentUrlParams.active);
        } else {
          newUrlParams.set(TXO.ACTIVE, 'all');
        }
        newUrlParams.set(TXO.PAGE, String(1));
        newUrlParams.set(TXO.PAGE_SIZE, currentUrlParams.pageSize);
        newUrlParams.set(QUERY_NAME_TAB, currentUrlParams.tab);
        newUrlParams.set(QUERY_NAME_CURRENCY, currentUrlParams.currency);
        break;
      case TXO.SUB_TYPE:
        if (currentUrlParams.type) {
          newUrlParams.set(TXO.TYPE, currentUrlParams.type);
        }
        newUrlParams.set(TXO.ACTIVE, 'all');
        newUrlParams.set(TXO.SUB_TYPE, delta.value);
        newUrlParams.set(TXO.PAGE, String(1));
        newUrlParams.set(TXO.PAGE_SIZE, currentUrlParams.pageSize);
        newUrlParams.set(QUERY_NAME_TAB, currentUrlParams.tab);
        newUrlParams.set(QUERY_NAME_CURRENCY, currentUrlParams.currency);
        break;
      case TXO.ACTIVE:
        if (currentUrlParams.type) {
          newUrlParams.set(TXO.TYPE, currentUrlParams.type);
        }
        if (currentUrlParams.subtype) {
          newUrlParams.set(TXO.SUB_TYPE, currentUrlParams.subtype);
        }
        newUrlParams.set(TXO.ACTIVE, delta.value);
        newUrlParams.set(TXO.PAGE, String(1));
        newUrlParams.set(TXO.PAGE_SIZE, currentUrlParams.pageSize);
        newUrlParams.set(QUERY_NAME_TAB, currentUrlParams.tab);
        newUrlParams.set(QUERY_NAME_CURRENCY, currentUrlParams.currency);
        break;
      // toggling the currency type (lbc/fiat)
      case QUERY_NAME_CURRENCY:
        newUrlParams.set(QUERY_NAME_CURRENCY, delta.value);
        newUrlParams.set(QUERY_NAME_TAB, currentUrlParams.tab);
        // only set fiat type (incoming|outgoing) if fiat is being used
        if (delta.value === 'credits') {
          newUrlParams.delete(QUERY_NAME_FIAT_TYPE);
        } else {
          newUrlParams.set(QUERY_NAME_FIAT_TYPE, currentUrlParams.fiatType);
        }
        break;
      // toggling the fiat type (incoming/outgoing)
      case QUERY_NAME_FIAT_TYPE:
        newUrlParams.set(QUERY_NAME_FIAT_TYPE, delta.value);
        newUrlParams.set(QUERY_NAME_TAB, currentUrlParams.tab);
        newUrlParams.set(QUERY_NAME_CURRENCY, currentUrlParams.currency);
        break;
    }

    return `?${newUrlParams.toString()}`;
  }

  const paramsString = JSON.stringify(params);

  useEffect(() => {
    if (paramsString && updateTxoPageParams) {
      const params = JSON.parse(paramsString);
      updateTxoPageParams(params);
    }
  }, [paramsString, updateTxoPageParams]);

  return (
    <Card
      title={
        <>
          <div className="table__header-text txo__table_header">{__(`Transactions`)}</div>
          <div className="txo__radios_container">
            <fieldset-section style={{ display: 'inline' }} className="txo__radios_fieldset">
              {/* toggle between LBC and fiat buttons */}
              <div className={'txo__radios'}>
                {/* toggle to LBC */}
                <Button
                  button="alt"
                  onClick={(e) => handleChange({ changedParameterKey: QUERY_NAME_CURRENCY, value: 'credits' })}
                  className={classnames(`button-toggle`, {
                    'button-toggle--active': currency === 'credits',
                  })}
                  label={__('Credits --[transactions tab]--')}
                />
                {/* toggle to fiat */}
                <Button
                  button="alt"
                  onClick={(e) => handleChange({ changedParameterKey: QUERY_NAME_CURRENCY, value: 'fiat' })}
                  className={classnames(`button-toggle`, {
                    'button-toggle--active': currency === 'fiat',
                  })}
                  label={__('Currency --[transactions tab]--')}
                />
              </div>
            </fieldset-section>
          </div>
        </>
      }
      isBodyList
      body={
        currency === 'credits' ? (
          <div>
            {/* LBC transactions section */}
            <div className="card__body-actions">
              <div className="card__actions card__actions--between">
                <div className="card__actions--inline">
                  <div>
                    {/* LBC transaction type dropdown */}
                    <FormField
                      type="select"
                      name="type"
                      label={
                        <>
                          {__('Type')}
                          <HelpLink href="https://odysee.com/@OdyseeHelp:b/Transactions-and-Wallet:7" />
                        </>
                      }
                      value={type || 'all'}
                      onChange={(e) => handleChange({ changedParameterKey: TXO.TYPE, value: e.target.value, tab })}
                    >
                      {Object.values(TXO.DROPDOWN_TYPES).map((v) => {
                        const stringV = String(v);
                        return (
                          <option key={stringV} value={stringV}>
                            {stringV && __(toCapitalCase(stringV))}
                          </option>
                        );
                      })}
                    </FormField>
                  </div>
                  {(type === TXO.SENT || type === TXO.RECEIVED) && (
                    <div>
                      <FormField
                        type="select"
                        name="subtype"
                        label={__('Payment Type')}
                        value={subtype || 'all'}
                        onChange={(e) =>
                          handleChange({ changedParameterKey: TXO.SUB_TYPE, value: e.target.value, tab })
                        }
                      >
                        {Object.values(TXO.DROPDOWN_SUBTYPES).map((v) => {
                          const stringV = String(v);
                          return (
                            <option key={stringV} value={stringV}>
                              {stringV && __(toCapitalCase(stringV))}
                            </option>
                          );
                        })}
                      </FormField>
                    </div>
                  )}
                  {!hideStatus && (
                    <div>
                      <fieldset-section>
                        <label>{__('Status')}</label>
                        <div className={'txo__radios'}>
                          {/* active transactions button */}
                          <Button
                            button="alt"
                            onClick={(e) => handleChange({ changedParameterKey: TXO.ACTIVE, value: 'active' })}
                            className={classnames(`button-toggle`, {
                              'button-toggle--active': active === TXO.ACTIVE,
                            })}
                            label={__('Active')}
                          />
                          {/* historical transactions button */}
                          <Button
                            button="alt"
                            onClick={(e) => handleChange({ changedParameterKey: TXO.ACTIVE, value: 'spent' })}
                            className={classnames(`button-toggle`, {
                              'button-toggle--active': active === 'spent',
                            })}
                            label={__('Historical')}
                          />
                          {/* all transactions button */}
                          <Button
                            button="alt"
                            onClick={(e) => handleChange({ changedParameterKey: TXO.ACTIVE, value: 'all' })}
                            className={classnames(`button-toggle`, {
                              'button-toggle--active': active === 'all',
                            })}
                            label={__('All')}
                          />
                        </div>
                      </fieldset-section>
                    </div>
                  )}
                </div>
                {/* export and refresh buttons */}
                <div className="card__actions--inline">
                  {!isFetchingTransactions && transactionsFile === null && (
                    <label>{<span className="error__text">{__('Failed to process fetched data.')}</span>}</label>
                  )}
                  <div className="txo__export">
                    <FileExporter
                      data={transactionsFile}
                      label={__('Export')}
                      tooltip={__('Fetch transaction data for export')}
                      defaultFileName={'transactions-history.csv'}
                      onFetch={() => fetchTransactions()}
                      progressMsg={isFetchingTransactions ? __('Fetching data') : ''}
                    />
                  </div>
                  <Button button="alt" icon={ICONS.REFRESH} label={__('Refresh')} onClick={() => fetchTxoPage()} />
                </div>
              </div>
            </div>
            {/* listing of the lbc transactions */}
            <TransactionListTable txos={txoPage} />
            <Paginate totalPages={Math.ceil(txoItemCount / Number(pageSize))} />
          </div>
        ) : (
          <div>
            {/* FIAT SECTION ( toggle buttons and transactions) */}
            <div className="section card-stack">
              <div className="card__body-actions">
                <div className="card__actions">
                  <div>
                    <fieldset-section>
                      <label>{__('Type')}</label>
                      <div className={'txo__radios'}>
                        {/* incoming transactions button */}
                        <Button
                          button="alt"
                          onClick={(e) =>
                            handleChange({ changedParameterKey: QUERY_NAME_FIAT_TYPE, value: 'incoming' })
                          }
                          className={classnames(`button-toggle`, {
                            'button-toggle--active': fiatType === 'incoming',
                          })}
                          label={__('Incoming')}
                        />
                        {/* incoming transactions button */}
                        <Button
                          button="alt"
                          onClick={(e) =>
                            handleChange({ changedParameterKey: QUERY_NAME_FIAT_TYPE, value: 'outgoing' })
                          }
                          className={classnames(`button-toggle`, {
                            'button-toggle--active': fiatType === 'outgoing',
                          })}
                          label={__('Outgoing')}
                        />
                      </div>
                    </fieldset-section>
                  </div>
                </div>
              </div>
              {/* listing of the transactions */}
              {fiatType === 'incoming' && <WalletFiatAccountHistory transactions={accountTransactionResponse} />}
              {fiatType === 'outgoing' && <WalletFiatPaymentHistory transactions={customerTransactions} />}
              {/* TODO: have to finish pagination */}
              {/* <Paginate totalPages={Math.ceil(txoItemCount / Number(pageSize))} /> */}
            </div>
          </div>
        )
      }
    />
  );
}

export default withRouter(TxoList);
