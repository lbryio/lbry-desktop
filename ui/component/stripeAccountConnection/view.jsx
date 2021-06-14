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

  // useEffect(() => {
  //   if (paramsString && updateTxoPageParams) {
  //     const params = JSON.parse(paramsString);
  //     updateTxoPageParams(params);
  //   }
  // }, [paramsString, updateTxoPageParams]);

  return (
    <Card
      title={<div className="table__header-text">{__(`Connect to Stripe`)}</div>}
      isBodyList
      body={
        <div>
          <div className="card__body-actions">
            <div>
              <div>
                <h3>Connect your account to Stripe to receive tips from viewers directly to your bank account</h3>
              </div>
              <div>
                <a href="#" className="stripe-connect"><span>Connect with Stripe</span></a>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}

export default withRouter(TxoList);
