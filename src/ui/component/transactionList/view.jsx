// @flow
import * as icons from 'constants/icons';
import React from 'react';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import FileExporter from 'component/common/file-exporter';
import { TRANSACTIONS, TX_LIST } from 'lbry-redux';
import * as PAGES from 'constants/pages';
import TransactionListTable from 'component/transactionListTable';
import RefreshTransactionButton from 'component/transactionRefreshButton';
import Spinner from 'component/spinner';
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
  transactionCount?: number,
  history: { replace: string => void },
};

function TransactionList(props: Props) {
  const { emptyMessage, slim, filterSetting, title, transactions, loading, history, transactionCount } = props;
  // Flow offers little support for Object.values() typing.
  // https://github.com/facebook/flow/issues/2221
  // $FlowFixMe
  const transactionTypes: Array<string> = Object.values(TRANSACTIONS);

  function capitalize(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function handleFilterChanged(event: SyntheticInputEvent<*>) {
    props.setTransactionFilter(event.target.value);
    history.replace(`/$/${PAGES.TRANSACTIONS}`); //
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
            <RefreshTransactionButton />
            {slim && <Button button="primary" navigate={`/$/${PAGES.TRANSACTIONS}`} label={__('Full History')} />}
          </div>
        </h2>
      </header>
      {!slim && (
        <header className="table__header">
          <div className="card__actions--between">
            <FileExporter
              data={transactions}
              label={__('Export')}
              title={__('Export Transactions')}
              filters={['nout']}
              defaultPath={__('lbry-transactions-history')}
              disabled={!transactions.length}
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

      {!loading && !transactions.length && (
        <h2 className="main--empty empty">{emptyMessage || __('No transactions.')}</h2>
      )}

      {!!transactions && !!transactions.length && <TransactionListTable transactionList={transactions} />}
      {!slim && !!transactionCount && (
        <Paginate
          onPageChange={page => history.replace(`/$/${PAGES.TRANSACTIONS}?page=${Number(page)}`)}
          totalPages={Math.ceil(transactionCount / TX_LIST.PAGE_SIZE)}
        />
      )}
    </React.Fragment>
  );
}

export default TransactionList;
