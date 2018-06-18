// @flow
import * as React from 'react';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import FileExporter from 'component/common/file-exporter';
import * as icons from 'constants/icons';
import { MODALS } from 'lbry-redux';
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
};

type State = {
  filter: string,
};

class TransactionList extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      filter: 'all',
    };

    (this: any).handleFilterChanged = this.handleFilterChanged.bind(this);
    (this: any).filterTransaction = this.filterTransaction.bind(this);
    (this: any).revokeClaim = this.revokeClaim.bind(this);
    (this: any).isRevokeable = this.isRevokeable.bind(this);
  }

  handleFilterChanged(event: SyntheticInputEvent<*>) {
    this.setState({
      filter: event.target.value,
    });
  }

  filterTransaction(transaction: Transaction) {
    const { filter } = this.state;

    return filter === 'all' || filter === transaction.type;
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
    const { emptyMessage, rewards, transactions, slim } = this.props;
    const { filter } = this.state;
    const transactionList = transactions.filter(this.filterTransaction);

    return (
      <React.Fragment>
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
          <div className="card__actions-top-corner">
            <FormField
              type="select"
              value={filter}
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
              <option value="all">{__('All')}</option>
              <option value="spend">{__('Spends')}</option>
              <option value="receive">{__('Receives')}</option>
              <option value="publish">{__('Publishes')}</option>
              <option value="channel">{__('Channels')}</option>
              <option value="tip">{__('Tips')}</option>
              <option value="support">{__('Supports')}</option>
              <option value="update">{__('Updates')}</option>
            </FormField>
          </div>
        )}
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
