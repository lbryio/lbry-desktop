// @flow
import React from 'react';
import TransactionList from 'component/transactionList';
import { LATEST_PAGE_SIZE } from 'constants/claim';

type Props = {
  fetchTransactions: (page, pageSize) => void,
  fetchingTransactions: boolean,
  hasTransactions: boolean,
  transactions: Array<Transaction>,
};

class TransactionListRecent extends React.PureComponent<Props> {
  componentDidMount() {
    const { fetchTransactions } = this.props;

    fetchTransactions(1, LATEST_PAGE_SIZE);
  }

  render() {
    const { transactions } = this.props;
    return (
      <section className="card">
        <TransactionList
          slim
          title={__('Latest Transactions')}
          transactions={transactions}
          emptyMessage={__("Looks like you don't have any transactions.")}
        />
      </section>
    );
  }
}

export default TransactionListRecent;
