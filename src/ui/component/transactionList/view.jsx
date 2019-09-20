// @flow
import * as icons from 'constants/icons';
import React, { useEffect, useState } from 'react';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import FileExporter from 'component/common/file-exporter';
import { TRANSACTIONS } from 'lbry-redux';
import TransactionListTable from 'component/transactionListTable';
import RefreshTransactionButton from 'component/transactionRefreshButton';
import Spinner from 'component/spinner';
import { withRouter } from 'react-router';
import Paginate from 'component/common/paginate';

type Props = {
  emptyMessage: ?string,
  filterSetting: string,
  loading: boolean,
  myClaims: any,
  setTransactionFilter: string => void,
  slim?: boolean,
  title: string,
  transactions: Array<Transaction>,
  location: { search: string },
  history: { replace: string => void },
};

function TransactionList(props: Props) {
  const { emptyMessage, transactions, slim, filterSetting, title, loading, location, history } = props;
  const PAGE_QUERY = `page`;
  const { search } = location;
  const urlParams = new URLSearchParams(search);
  const currentPage = urlParams.get(PAGE_QUERY) || 0;

  const PAGE_SIZE = 10;

  const paginateTransactions = (pageSize, arr, page) => {
    const start = Number(page) * Number(pageSize);
    const end = (Number(page) + 1) * Number(pageSize);
    return arr && arr.length ? arr.slice(start, end) : [];
  };

  const [transactionList, setTransactionList] = useState([]);
  const [numTransactions, setNumTransactions] = useState(0);

  useEffect(() => {
    let txList;
    if (transactions && transactions.length) {
      if (slim) {
        txList = transactions;
        setNumTransactions(transactionList.length);
      } else {
        let filteredTransactionList = transactions.filter(filterTransaction);
        txList = paginateTransactions(PAGE_SIZE, filteredTransactionList, currentPage);
        setNumTransactions(filteredTransactionList.length);
      }
      setTransactionList(txList);
    }
  }, [loading, currentPage, paginateTransactions, setTransactionList, setNumTransactions]);

  // Flow offers little support for Object.values() typing.
  // https://github.com/facebook/flow/issues/2221
  // $FlowFixMe
  const transactionTypes: Array<string> = Object.values(TRANSACTIONS);

  function capitalize(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function handleFilterChanged(event: SyntheticInputEvent<*>) {
    props.setTransactionFilter(event.target.value);
    history.replace(`#/$/transactions?page=0`);
  }

  function filterTransaction(transaction: Transaction) {
    return props.filterSetting === TRANSACTIONS.ALL || props.filterSetting === transaction.type;
  }

  return (
    <React.Fragment>
      <header className="table__header">
        <h2 className="card__title--between">
          <span>
            {title}
            {loading && <Spinner type="small" />}
          </span>
          <div className="card__actions--inline">
            {slim && (
              <Button button="link" className="button--alt" navigate="/$/transactions" label={__('Full History')} />
            )}
            <RefreshTransactionButton />
          </div>
        </h2>
      </header>
      {!slim && !!transactions.length && (
        <header className="table__header">
          <div className="card__actions--between">
            <FileExporter
              data={transactionList}
              label={__('Export')}
              title={__('Export Transactions')}
              filters={['nout']}
              defaultPath={__('lbry-transactions-history')}
            />

            <FormField
              type="select"
              name="file-sort"
              value={filterSetting || TRANSACTIONS.ALL}
              onChange={handleFilterChanged}
              label={__('Show')}
              postfix={
                <Button
                  button="link"
                  icon={icons.HELP}
                  href="https://lbry.com/faq/transaction-types"
                  title={__('Help')}
                />
              }
            >
              {transactionTypes.map(tt => (
                <option key={tt} value={tt}>
                  {__(`${capitalize(tt)}`)}
                </option>
              ))}
            </FormField>
          </div>
        </header>
      )}

      {!loading && !transactionList.length && (
        <h2 className="main--empty empty">{emptyMessage || __('No transactions.')}</h2>
      )}

      {!!transactionList && !!transactionList.length && <TransactionListTable transactionList={transactionList} />}
      {!slim && (
        <Paginate
          onPageChange={page => history.replace(`#/$/transactions?page=${Number(page) - 1}`)}
          totalPages={Math.floor(numTransactions / PAGE_SIZE)}
          loading={loading}
        />
      )}
    </React.Fragment>
  );
}

export default withRouter(TransactionList);
