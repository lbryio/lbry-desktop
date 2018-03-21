import React from 'react';
import TransactionListItem from './internal/TransactionListItem';
import FormField from 'component/formField';
import Link from 'component/link';
import FileExporter from 'component/file-exporter.js';
import * as icons from 'constants/icons';
import * as modals from 'constants/modal_types';

class TransactionList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      filter: null,
    };
  }

  handleFilterChanged(event) {
    this.setState({
      filter: event.target.value,
    });
  }

  filterTransaction(transaction) {
    const { filter } = this.state;

    return !filter || filter == transaction.type;
  }

  isRevokeable(txid, nout) {
    // a claim/support/update is revokable if it
    // is in my claim list(claim_list_mine)
    return this.props.myClaims.has(`${txid}:${nout}`);
  }

  revokeClaim(txid, nout) {
    this.props.openModal(modals.CONFIRM_CLAIM_REVOKE, { txid, nout });
  }

  render() {
    const { emptyMessage, rewards, transactions } = this.props;

    const transactionList = transactions.filter(this.filterTransaction.bind(this));

    return (
      <div>
        {Boolean(transactionList.length) && (
          <FileExporter
            data={transactionList}
            title={__('Export Transactions')}
            label={__('Export')}
          />
        )}
        {(transactionList.length || this.state.filter) && (
          <span className="sort-section">
            {__('Filter')}{' '}
            <FormField type="select" onChange={this.handleFilterChanged.bind(this)}>
              <option value="">{__('All')}</option>
              <option value="spend">{__('Spends')}</option>
              <option value="receive">{__('Receives')}</option>
              <option value="publish">{__('Publishes')}</option>
              <option value="channel">{__('Channels')}</option>
              <option value="tip">{__('Tips')}</option>
              <option value="support">{__('Supports')}</option>
              <option value="update">{__('Updates')}</option>
            </FormField>{' '}
            <Link href="https://lbry.io/faq/transaction-types" icon={icons.HELP_CIRCLE} />
          </span>
        )}
        {!transactionList.length && (
          <div className="empty">{emptyMessage || __('No transactions to list.')}</div>
        )}
        {Boolean(transactionList.length) && (
          <table className="table-standard table-transactions table-stretch">
            <thead>
              <tr>
                <th>{__('Date')}</th>
                <th>{__('Amount (Fee)')}</th>
                <th>{__('Type')} </th>
                <th>{__('Details')} </th>
                <th>{__('Transaction')}</th>
              </tr>
            </thead>
            <tbody>
              {transactionList.map(t => (
                <TransactionListItem
                  key={`${t.txid}:${t.nout}`}
                  transaction={t}
                  reward={rewards && rewards[t.txid]}
                  isRevokeable={this.isRevokeable(t.txid, t.nout)}
                  revokeClaim={this.revokeClaim.bind(this)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

export default TransactionList;
