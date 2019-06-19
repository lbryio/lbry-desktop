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
  transactions: Array<{}>,
};

class TransactionHistoryPage extends React.PureComponent<Props> {
  componentDidMount() {
    const { fetchMyClaims, fetchTransactions } = this.props;

    fetchMyClaims();
    fetchTransactions();
  }

  render() {
    const { transactions } = this.props;

    return (
      <Page>
        {IS_WEB && <UnsupportedOnWeb />}
        <section
          className={classnames('card', {
            'card--disabled': IS_WEB,
          })}
        >
          <TransactionList transactions={transactions} title={__('Transaction History')} />
        </section>
      </Page>
    );
  }
}

export default TransactionHistoryPage;
