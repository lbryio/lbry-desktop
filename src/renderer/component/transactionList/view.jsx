// @flow
import * as React from 'react';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import FileExporter from 'component/common/file-exporter';
import * as icons from 'constants/icons';
import { MODALS, TRANSACTIONS } from 'lbry-redux';
import TransactionListItem from './internal/transaction-list-item';

export type Transaction = {
  amount: number,
  claim_id: string,
  claim_name: string,
  fee: number,
  nout: number,
  txid: string,
  type: string,
  date: Date,
};

type Props = {
  emptyMessage: ?string,
  slim?: boolean,
  transactions: Array<Transaction>,
  rewards: {},
  openModal: ({ id: string }, { nout: number, txid: string }) => void,
  myClaims: any,
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
    return (
      this.props.filterSetting === TRANSACTIONS.ALL || this.props.filterSetting === transaction.type
    );
  }

  isRevokeable(txid: string, nout: number) {
    const { myClaims } = this.props;
    // a claim/support/update is revokable if it
    // is in my claim list(claim_list_mine)
    return myClaims.has(`${txid}:${nout}`);
  }

  revokeClaim(txid: string, nout: number) {
    this.props.openModal({ id: MODALS.CONFIRM_CLAIM_REVOKE }, { txid, nout });
  }

  render() {
    const { emptyMessage, rewards, transactions, slim, filterSetting } = this.props;
    const transactionList = transactions.filter(this.filterTransaction);
    // Flow offers little support for Object.values() typing.
    // https://github.com/facebook/flow/issues/2221
    // $FlowFixMe
    const transactionTypes: Array<string> = Object.values(TRANSACTIONS);

    return (
      <React.Fragment>
        <header className="card__header">
          {!transactionList.length && (
            <p className="card__content">{emptyMessage || __('No transactions to list.')}</p>
          )}
          {!slim &&
            !!transactionList.length && (
              <div className="card__actions">
                <FileExporter
                  data={transactionList}
                  label={__('Export')}
                  title={__('Export Transactions')}
                  filters={['nout']}
                  defaultPath={__('lbry-transactions-history')}
                />
              </div>
            )}
          {!slim && (
            <div className="card__actions--top-corner">
              <FormField
                type="select"
                value={filterSetting || TRANSACTIONS.ALL}
                onChange={this.handleFilterChanged}
                affixClass="form-field--align-center"
                prefix={__('Show')}
                postfix={
                  <Button
                    button="link"
                    icon={icons.HELP}
                    href="https://lbry.io/faq/transaction-types"
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
          )}
        </header>

        {!!transactionList.length && (
          <table className="card__content table table--transactions table--stretch">
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
        )}
      </React.Fragment>
    );
  }
}

export default TransactionList;
