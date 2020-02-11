// @flow
import React from 'react';
import TransactionList from 'component/transactionList';
import { TX_LIST } from 'lbry-redux';

type Props = {
  fetchTransactions: (number, number) => void,
  fetchClaimListMine: () => void,
  fetchingTransactions: boolean,
  hasTransactions: boolean,
  transactions: Array<Transaction>,
  myClaims: ?Array<StreamClaim>,
};

function TransactionListRecent(props: Props) {
  const { transactions, fetchTransactions, myClaims, fetchClaimListMine } = props;

  React.useEffect(() => {
    fetchTransactions(1, TX_LIST.LATEST_PAGE_SIZE);
  }, [fetchTransactions]);

  const myClaimsString = myClaims && myClaims.map(channel => channel.permanent_url).join(',');
  React.useEffect(() => {
    if (myClaimsString === '') {
      fetchClaimListMine();
    }
  }, [myClaimsString, fetchClaimListMine]);

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

export default TransactionListRecent;
