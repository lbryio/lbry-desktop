// @flow
import React from 'react';
import classnames from 'classnames';
import BusyIndicator from 'component/common/busy-indicator';
import TransactionList from 'component/transactionList';
import Page from 'component/page';
import RefreshTransactionButton from 'component/transactionRefreshButton';
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
    const { fetchingTransactions, transactions } = this.props;

    return (
      <Page>
        {IS_WEB && <UnsupportedOnWeb />}
        <section
          className={classnames('card card--section', {
            'card--disabled': IS_WEB,
          })}
        >
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
            <div className="card__content">
              <TransactionList transactions={transactions} />
            </div>
          ) : (
            <div className="card__content">{__("Looks like you don't have any transactions")}</div>
          )}
        </section>
      </Page>
    );
  }
}

export default TransactionHistoryPage;
