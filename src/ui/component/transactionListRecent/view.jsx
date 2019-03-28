// @flow
import type { Transaction } from 'types/transaction';
import * as icons from 'constants/icons';
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
        <header className="card__header card__header--flat">
          <h2 className="card__title card__title--flex-between">
            {__('Recent Transactions')}
            <RefreshTransactionButton />
          </h2>

          <p className="card__subtitle">
            {__('To view all of your transactions, navigate to the')}{' '}
            <Button button="link" navigate="/$/history" label={__('transactions page')} />.
          </p>
        </header>

        {fetchingTransactions && !hasTransactions && (
          <div className="card__content">
            <BusyIndicator message={__('Loading transactions')} />
          </div>
        )}

        {hasTransactions && (
          <Fragment>
            <div className="card__content">
              <TransactionList
                slim
                transactions={transactions}
                emptyMessage={__("Looks like you don't have any recent transactions.")}
              />
              <div className="card__actions">
                <Button
                  button="primary"
                  navigate="/$/history"
                  label={__('Full History')}
                  icon={icons.HISTORY}
                />
              </div>
            </div>
          </Fragment>
        )}
      </section>
    );
  }
}

export default TransactionListRecent;
