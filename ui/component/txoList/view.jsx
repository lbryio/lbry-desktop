// @flow
import * as ICONS from 'constants/icons';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import { TXO_LIST as TXO } from 'lbry-redux';
import TransactionListTable from 'component/transactionListTable';
import Paginate from 'component/common/paginate';
import { FormField } from 'component/common/form-components/form-field';
import Button from 'component/button';
import Card from 'component/common/card';
import { toCapitalCase } from 'util/string';
import classnames from 'classnames';
import HelpLink from 'component/common/help-link';
import FileExporter from 'component/common/file-exporter';

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
  dkey: string,
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

  const urlParams = new URLSearchParams(search);
  const page = urlParams.get(TXO.PAGE) || String(1);
  const pageSize = urlParams.get(TXO.PAGE_SIZE) || String(TXO.PAGE_SIZE_DEFAULT);
  const type = urlParams.get(TXO.TYPE) || TXO.ALL;
  const subtype = urlParams.get(TXO.SUB_TYPE);
  const active = urlParams.get(TXO.ACTIVE) || TXO.ALL;

  const currentUrlParams = {
    page,
    pageSize,
    active,
    type,
    subtype,
  };

  const hideStatus =
    type === TXO.SENT || (currentUrlParams.type === TXO.RECEIVED && currentUrlParams.subtype !== TXO.TIP);

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
    switch (delta.dkey) {
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
        break;
      case TXO.SUB_TYPE:
        if (currentUrlParams.type) {
          newUrlParams.set(TXO.TYPE, currentUrlParams.type);
        }
        newUrlParams.set(TXO.ACTIVE, 'all');
        newUrlParams.set(TXO.SUB_TYPE, delta.value);
        newUrlParams.set(TXO.PAGE, String(1));
        newUrlParams.set(TXO.PAGE_SIZE, currentUrlParams.pageSize);
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
      title={<div className="table__header-text">{__(`Transactions`)}</div>}
      titleActions={
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
      }
      isBodyList
      body={
        <div>
          <div className="card__body-actions">
            <div className="card__actions">
              <div>
                <FormField
                  type="select"
                  name="type"
                  label={
                    <>
                      {__('Type')}
                      <HelpLink href="https://lbry.com/faq/transaction-types" />
                    </>
                  }
                  value={type || 'all'}
                  onChange={(e) => handleChange({ dkey: TXO.TYPE, value: e.target.value })}
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
                    onChange={(e) => handleChange({ dkey: TXO.SUB_TYPE, value: e.target.value })}
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
                      <Button
                        button="alt"
                        onClick={(e) => handleChange({ dkey: TXO.ACTIVE, value: 'active' })}
                        className={classnames(`button-toggle`, {
                          'button-toggle--active': active === TXO.ACTIVE,
                        })}
                        label={__('Active')}
                      />
                      <Button
                        button="alt"
                        onClick={(e) => handleChange({ dkey: TXO.ACTIVE, value: 'spent' })}
                        className={classnames(`button-toggle`, {
                          'button-toggle--active': active === 'spent',
                        })}
                        label={__('Historical')}
                      />
                      <Button
                        button="alt"
                        onClick={(e) => handleChange({ dkey: TXO.ACTIVE, value: 'all' })}
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
          </div>
          <TransactionListTable txos={txoPage} />
          <Paginate totalPages={Math.ceil(txoItemCount / Number(pageSize))} />
        </div>
      }
    />
  );
}

export default withRouter(TxoList);
