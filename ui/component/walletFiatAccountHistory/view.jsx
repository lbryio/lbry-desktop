// @flow
import React from 'react';
import Button from 'component/button';
import moment from 'moment';

type Props = {
  accountDetails: any,
  transactions: any,
};

const WalletFiatAccountHistory = (props: Props) => {
  // receive transactions from parent component
  const { transactions } = props;

  let accountTransactions = transactions;

  // TODO: should add pagination here
  // if there are more than 10 transactions, limit it to 10 for the frontend
  // if (accountTransactions && accountTransactions.length > 10) {
  //   accountTransactions.length = 10;
  // }

  function getSymbol(transaction) {
    if (transaction.currency === 'eur') {
      return '€';
    } else {
      return '$';
    }
  }

  function getCurrencyIso(transaction) {
    if (transaction.currency === 'eur') {
      return 'EUR';
    } else {
      return 'USD';
    }
  }

  return (
    <div className="table__wrapper">
      <table className="table table--transactions">
        <thead>
          <tr>
            <th className="date-header">{__('Date')}</th>
            <th className="channelName-header">{<>{__('Receiving Channel Name')}</>}</th>
            <th className="location-header">{__('Tip Location')}</th>
            <th className="amount-header">{__('Amount')} </th>
            <th className="processingFee-header">{__('Processing Fee')}</th>
            <th className="odyseeFee-header">{__('Odysee Fee')}</th>
            <th className="receivedAmount-header">{__('Received Amount')}</th>
          </tr>
        </thead>
        <tbody>
          {accountTransactions &&
            accountTransactions.map((transaction) => (
              <tr key={transaction.name + transaction.created_at}>
                <td>{moment(transaction.created_at).format('LLL')}</td>
                <td>
                  <Button
                    className=""
                    navigate={'/' + transaction.channel_name + ':' + transaction.channel_claim_id}
                    label={transaction.channel_name}
                    button="link"
                  />
                </td>
                <td>
                  <Button
                    className=""
                    navigate={'/' + transaction.channel_name + ':' + transaction.source_claim_id}
                    label={
                      transaction.channel_claim_id === transaction.source_claim_id
                        ? __('Channel Page')
                        : __('Content Page')
                    }
                    button="link"
                  />
                </td>
                <td>
                  {getSymbol(transaction)}
                  {transaction.tipped_amount / 100} {getCurrencyIso(transaction)}
                </td>
                <td>
                  {getSymbol(transaction)}
                  {transaction.transaction_fee / 100}
                </td>
                <td>
                  {getSymbol(transaction)}
                  {transaction.application_fee / 100}
                </td>
                <td>
                  {getSymbol(transaction)}
                  {transaction.received_amount / 100}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {!accountTransactions && <p className="wallet__fiat-transactions">{__('No Transactions')}</p>}
    </div>
  );
};

export default WalletFiatAccountHistory;
