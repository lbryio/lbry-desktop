// @flow
import React from 'react';
import BusyIndicator from 'component/common/busy-indicator';
import TransactionList from 'component/transactionList';
import Page from 'component/page';
import RefreshTransactionButton from 'component/transactionRefreshButton';

type Props = {
  fetchMyClaims: () => void,
  fetchTransactions: () => void,
  fetchingTransactions: boolean,
  transactions: Array<{}>,
};

class TransactionHistoryPage extends React.PureComponent<Props> {
  componentDidMount() {
    const { fetchMyClaims, fetchTransactions } = this.props;

    fetchMyClaims();
    fetchTransactions();
  }

  render() {
    const { fetchingTransactions, transactions } = this.props;

    return (
      <Page>
        <section className="card card--section">
          <header className="card__header card__header--flat">
            <h2 className="card__title card__title--flex-between ">
              {__('Transaction History')}
              <RefreshTransactionButton />
            </h2>
          </header>
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
