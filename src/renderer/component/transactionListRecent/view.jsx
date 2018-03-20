// @flow
import React from 'react';
import { BusyMessage } from 'component/common';
import Button from 'component/link';
import TransactionList from 'component/transactionList';
import * as icons from 'constants/icons';
import type { Transaction } from 'component/transactionList/view';

type Props = {
  fetchTransactions: () => void,
  fetchingTransactions: boolean,
  hasTransactions: boolean,
  transactions: Array<Transaction>,
};

class TransactionListRecent extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.fetchTransactions();
  }

  render() {
    const { fetchingTransactions, hasTransactions, transactions } = this.props;

    return (
      <section className="card card--section">
        <div className="card__title">{__('Recent Transactions')}</div>
        <div className="card__content">
          {fetchingTransactions && <BusyMessage message={__('Loading transactions')} />}
          {!fetchingTransactions && (
            <TransactionList
              slim
              transactions={transactions}
              emptyMessage={__("Looks like you don't have any recent transactions.")}
            />
          )}
        </div>
        {hasTransactions && (
          <div className="card__actions">
            <Button button="primary" navigate="/history" label={__('Full History')} icon="Clock" />
          </div>
        )}
      </section>
    );
  }
}

export default TransactionListRecent;
