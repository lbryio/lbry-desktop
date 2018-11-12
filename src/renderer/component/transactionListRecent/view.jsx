// @flow
import React from 'react';
import BusyIndicator from 'component/common/busy-indicator';
import Button from 'component/button';
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
        <header className="card__header">
          <h2 className="card__title">{__('Recent Transactions')}</h2>

          <p className="card__subtitle">
            {__('To view all of your transactions, navigate to the')}{' '}
            <Button button="link" navigate="/history" label={__('transactions page')} />.
          </p>
        </header>

        {fetchingTransactions && (
          <div className="card__content">
            <BusyIndicator message={__('Loading transactions')} />
          </div>
        )}
        {!fetchingTransactions && (
          <TransactionList
            slim
            transactions={transactions}
            emptyMessage={__("Looks like you don't have any recent transactions.")}
          />
        )}
        {hasTransactions && (
          <div className="card__content">
            <div className="card__actions">
              <Button
                button="primary"
                navigate="/history"
                label={__('Full History')}
                icon={icons.CLOCK}
              />
            </div>
          </div>
        )}
      </section>
    );
  }
}

export default TransactionListRecent;
