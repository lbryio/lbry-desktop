// @flow
import type { Transaction } from 'component/transactionList/view';
import * as ICONS from 'constants/icons';
import React, { Fragment } from 'react';
import BusyIndicator from 'component/common/busy-indicator';
import Button from 'component/button';
import TransactionList from 'component/transactionList';
import RefreshTransactionButton from 'component/transactionRefreshButton';

type Props = {
  fetchTransactions: () => void,
  fetchingTransactions: boolean,
  hasTransactions: boolean,
  transactions: Array<Transaction>,
  fetchMyClaims: () => void,
};

class TransactionListRecent extends React.PureComponent<Props> {
  componentDidMount() {
    const { fetchMyClaims, fetchTransactions } = this.props;

    fetchMyClaims();
    fetchTransactions();
  }

  render() {
    const { fetchingTransactions, hasTransactions, transactions } = this.props;
    return (
      <section className="card card--section">
        <div className="card__title card--space-between">
          {__('Recent Transactions')}
          <RefreshTransactionButton />
        </div>
        <div className="card__subtitle">
          {__('To view all of your transactions, navigate to the')}{' '}
          <Button button="link" navigate="/history" label={__('transactions page')} />.
        </div>
        {fetchingTransactions &&
          !hasTransactions && (
            <div className="card__content">
              <BusyIndicator message={__('Loading transactions')} />
            </div>
          )}
        {hasTransactions && (
          <Fragment>
            <TransactionList
              slim
              transactions={transactions}
              emptyMessage={__("Looks like you don't have any recent transactions.")}
            />
            <div className="card__actions">
              <Button
                button="primary"
                navigate="/history"
                label={__('Full History')}
                icon={ICONS.CLOCK}
              />
            </div>
          </Fragment>
        )}
      </section>
    );
  }
}

export default TransactionListRecent;
