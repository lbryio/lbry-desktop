// @flow
import * as MODALS from 'constants/modal_types';
import React from 'react';
import TransactionListItem from './internal/transaction-list-item';

type Props = {
  emptyMessage: ?string,
  loading: boolean,
  mySupports: {},
  myClaims: any,
  openModal: (id: string, { nout: number, txid: string }) => void,
  rewards: {},
  transactionList: Array<any>,
};

function TransactionListTable(props: Props) {
  const { emptyMessage, rewards, loading, transactionList } = props;

  function isRevokeable(txid: string, nout: number) {
    const outpoint = `${txid}:${nout}`;
    const { mySupports, myClaims } = props;

    return !!mySupports[outpoint] || myClaims.has(outpoint);
  }

  function revokeClaim(txid: string, nout: number) {
    props.openModal(MODALS.CONFIRM_CLAIM_REVOKE, { txid, nout });
  }

  return (
    <React.Fragment>
      {!loading && !transactionList.length && (
        <h2 className="main--empty empty">{emptyMessage || __('No transactions.')}</h2>
      )}
      {!!transactionList.length && (
        <div className="table__wrapper">
          <table className="table table--transactions">
            <thead>
              <tr>
                <th>{__('Date')}</th>
                <th>{__('Type')} </th>
                <th>{__('Details')} </th>
                <th>{__('Transaction')}</th>
                <th className="table__item--align-right">{__('Amount')}</th>
              </tr>
            </thead>
            <tbody>
              {transactionList.map(t => (
                <TransactionListItem
                  key={`${t.txid}:${t.nout}`}
                  transaction={t}
                  reward={rewards && rewards[t.txid]}
                  isRevokeable={isRevokeable(t.txid, t.nout)}
                  revokeClaim={revokeClaim}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </React.Fragment>
  );
}

export default TransactionListTable;
