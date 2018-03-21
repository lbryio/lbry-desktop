import React from 'react';
import { BusyMessage } from 'component/common';
import TransactionList from 'component/transactionList';
import Page from 'component/page';

class TransactionHistoryPage extends React.PureComponent {
  componentWillMount() {
    this.props.fetchTransactions();
  }

  render() {
    const { fetchingTransactions, transactions } = this.props;

    return (
      <Page>
        <section className="card card--section">
          <div
            className={`card__title-primary ${
              fetchingTransactions && transactions.length ? 'reloading' : ''
            }`}
          >
            <h3>{__('Transaction History')}</h3>
          </div>
          <div className="card__content">
            {fetchingTransactions && !transactions.length ? (
              <BusyMessage message={__('Loading transactions')} />
            ) : (
              ''
            )}
            {transactions && transactions.length ? (
              <TransactionList transactions={transactions} />
            ) : (
              ''
            )}
          </div>
        </section>
      </Page>
    );
  }
}

export default TransactionHistoryPage;
