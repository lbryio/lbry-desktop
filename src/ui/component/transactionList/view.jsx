// @flow
import * as icons from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import * as React from 'react';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import FileExporter from 'component/common/file-exporter';
import { TRANSACTIONS } from 'lbry-redux';
import TransactionListItem from './internal/transaction-list-item';

type Props = {
  emptyMessage: ?string,
  slim?: boolean,
  transactions: Array<Transaction>,
  rewards: {},
  openModal: (id: string, { nout: number, txid: string }) => void,
  mySupports: {},
  filterSetting: string,
  setTransactionFilter: string => void,
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

  isRevokeable(txid: string) {
    const { mySupports } = this.props;
    return !!mySupports[txid];
  }

  revokeClaim(txid: string, nout: number) {
    this.props.openModal(MODALS.CONFIRM_CLAIM_REVOKE, { txid, nout });
  }

  render() {
    const { emptyMessage, rewards, transactions, slim, filterSetting } = this.props;

    // The shorter "recent transactions" list shouldn't be filtered
    const transactionList = slim ? transactions : transactions.filter(this.filterTransaction);

    // Flow offers little support for Object.values() typing.
    // https://github.com/facebook/flow/issues/2221
    // $FlowFixMe
    const transactionTypes: Array<string> = Object.values(TRANSACTIONS);

    return (
      <React.Fragment>
        <header className="card__header">
          {!slim && !!transactions.length && (
            <div className="card__actions card__actions--between card__actions--top-space">
              <FileExporter
                data={transactionList}
                label={__('Export')}
                title={__('Export Transactions')}
                filters={['nout']}
                defaultPath={__('lbry-transactions-history')}
              />

              <Form>
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
              </Form>
            </div>
          )}
        </header>
        {!transactionList.length && <p className="card__subtitle">{emptyMessage || __('No transactions to list.')}</p>}

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
                    isRevokeable={this.isRevokeable(t.txid)}
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
