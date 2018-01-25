// @flow
import React from 'react';
import { BusyMessage } from 'component/common';
import Button from 'component/link';
import TransactionList from 'component/transactionList';
import * as icons from 'constants/icons';

type Props = {
  fetchTransactions: () => void,
  fetchingTransactions: boolean,
  hasTransactions: boolean,
  transactions: Array<{}>, // Will iron this out when I work on transactions page - Sean
};

class TransactionListRecent extends React.PureComponent<Props> {
  componentWillMount() {
    this.props.fetchTransactions();
  }

  render() {
    const { fetchingTransactions, hasTransactions, transactions } = this.props;

    return (
      <section className="card card--section">
        <h2>{__('Recent Transactions')}</h2>
        <div className="card__content">
          {fetchingTransactions && <BusyMessage message={__('Loading transactions')} />}
          {!fetchingTransactions && (
            <TransactionList
              transactions={transactions}
              emptyMessage={__("Looks like you don't have any recent transactions.")}
            />
          )}
        </div>
        {hasTransactions && (
          <div className="card__actions">
            <Button navigate="/history" label={__('Full History')} icon="Clock" />
          </div>
        )}
      </section>
    );
  }
}

export default TransactionListRecent;
