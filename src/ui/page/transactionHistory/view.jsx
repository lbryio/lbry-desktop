// @flow
import React from 'react';
import TransactionList from 'component/transactionList';
import Page from 'component/page';

type Props = {
  fetchMyClaims: () => void,
  fetchTransactions: () => void,
  fetchingTransactions: boolean,
  filteredTransactionPage: Array<{}>,
  filteredTransactionsCount: number,
};

class TransactionHistoryPage extends React.PureComponent<Props> {
  componentDidMount() {
    const { fetchMyClaims, fetchTransactions } = this.props;

    fetchMyClaims();
    fetchTransactions();
  }

  render() {
    const { filteredTransactionPage, filteredTransactionsCount } = this.props;

    return (
      <Page>
        <section className="card">
          <TransactionList
            transactions={filteredTransactionPage}
            transactionCount={filteredTransactionsCount}
            title={__('Transaction History')}
          />
        </section>
      </Page>
    );
  }
}

export default TransactionHistoryPage;
