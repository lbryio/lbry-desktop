import React from 'react';
import BusyIndicator from 'component/common/busy-indicator';
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
            className={`card__title ${
              fetchingTransactions && transactions.length ? 'reloading' : ''
            }`}
          >
            <h3>{__('Transaction History')}</h3>
          </div>
          {fetchingTransactions && !transactions.length ? (
            <div className="card__content">
              <BusyIndicator message={__('Loading transactions')} />
            </div>
          ) : (
            ''
          )}
          {transactions && transactions.length ? (
            <TransactionList transactions={transactions} />
          ) : (
            <div className="card__content">{__("Looks like you don't have any transactions")}</div>
          )}
        </section>
      </Page>
    );
  }
}

export default TransactionHistoryPage;
