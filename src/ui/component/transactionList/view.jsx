// @flow
import * as icons from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import * as React from 'react';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import FileExporter from 'component/common/file-exporter';
import { TRANSACTIONS } from 'lbry-redux';
import TransactionListItem from './internal/transaction-list-item';
import RefreshTransactionButton from 'component/transactionRefreshButton';
import Spinner from 'component/spinner';

type Props = {
  emptyMessage: ?string,
  filterSetting: string,
  loading: boolean,
  mySupports: {},
  myClaims: any,
  openModal: (id: string, { nout: number, txid: string }) => void,
  rewards: {},
  setTransactionFilter: string => void,
  slim?: boolean,
  title: string,
  transactions: Array<Transaction>,
};

class TransactionList extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    (this: any).handleFilterChanged = this.handleFilterChanged.bind(this);
    (this: any).filterTransaction = this.filterTransaction.bind(this);
    (this: any).revokeClaim = this.revokeClaim.bind(this);
    (this: any).isRevokeable = this.isRevokeable.bind(this);
  }

  capitalize(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  handleFilterChanged(event: SyntheticInputEvent<*>) {
    this.props.setTransactionFilter(event.target.value);
  }

  filterTransaction(transaction: Transaction) {
    return this.props.filterSetting === TRANSACTIONS.ALL || this.props.filterSetting === transaction.type;
  }

  isRevokeable(txid: string, nout: number) {
    const outpoint = `${txid}:${nout}`;
    const { mySupports, myClaims } = this.props;
    return !!mySupports[outpoint] || myClaims.has(outpoint);
  }

  revokeClaim(txid: string, nout: number) {
    this.props.openModal(MODALS.CONFIRM_CLAIM_REVOKE, { txid, nout });
  }

  render() {
    const { emptyMessage, rewards, transactions, slim, filterSetting, title, loading } = this.props;
    // The shorter "recent transactions" list shouldn't be filtered
    const transactionList = slim ? transactions : transactions.filter(this.filterTransaction);

    // Flow offers little support for Object.values() typing.
    // https://github.com/facebook/flow/issues/2221
    // $FlowFixMe
    const transactionTypes: Array<string> = Object.values(TRANSACTIONS);

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
                onChange={this.handleFilterChanged}
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
                    {__(`${this.capitalize(tt)}`)}
                  </option>
                ))}
              </FormField>
            </div>
          </header>
        )}

        {!loading && !transactionList.length && (
          <h2 className="main--empty empty">{emptyMessage || __('No transactions.')}</h2>
        )}

        {!!transactionList.length && (
          <React.Fragment>
            <table className="table table--transactions">
              <thead>
                <tr>
                  <th>{__('Amount')}</th>
                  <th>{__('Type')} </th>
                  <th>{__('Details')} </th>
                  <th>{__('Transaction')}</th>
                  <th>{__('Date')}</th>
                </tr>
              </thead>
              <tbody>
                {transactionList.map(t => (
                  <TransactionListItem
                    key={`${t.txid}:${t.nout}`}
                    transaction={t}
                    reward={rewards && rewards[t.txid]}
                    isRevokeable={this.isRevokeable(t.txid, t.nout)}
                    revokeClaim={this.revokeClaim}
                  />
                ))}
              </tbody>
            </table>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default TransactionList;
