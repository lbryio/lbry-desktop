// @flow
import React from 'react';
import classnames from 'classnames';
import TransactionList from 'component/transactionList';
import Page from 'component/page';
import UnsupportedOnWeb from 'component/common/unsupported-on-web';

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
        {IS_WEB && <UnsupportedOnWeb />}
        <section
          className={classnames('card', {
            'card--disabled': IS_WEB,
          })}
        >
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
