// @flow
import React from 'react';
import Button from 'component/button';
import Card from 'component/common/card';
import moment from 'moment';

type Props = {
  accountDetails: any,
  transactions: any,
};

const WalletBalance = (props: Props) => {
  // receive transactions from parent component
  const { transactions } = props;

  let accountTransactions;

  // reverse so most recent payments come first
  if (transactions && transactions.length) {
    accountTransactions = transactions.reverse();
  }

  // if there are more than 10 transactions, limit it to 10 for the frontend
  if (accountTransactions && accountTransactions.length > 10) {
    accountTransactions.length = 10;
  }

  return (
    <><Card
      title={'Tip History'}
      body={(
          <>
            <div className="table__wrapper">
              <table className="table table--transactions">
                <thead>
                <tr>
                  <th className="date-header">{__('Date')}</th>
                  <th>{<>{__('Receiving Channel Name')}</>}</th>
                  <th>{__('Tip Location')}</th>
                  <th>{__('Amount (USD)')} </th>
                  <th>{__('Processing Fee')}</th>
                  <th>{__('Odysee Fee')}</th>
                  <th>{__('Received Amount')}</th>
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
                            ? 'Channel Page'
                            : 'Content Page'
                        }
                        button="link"
                      />
                    </td>
                    <td>${transaction.tipped_amount / 100}</td>
                    <td>${transaction.transaction_fee / 100}</td>
                    <td>${transaction.application_fee / 100}</td>
                    <td>${transaction.received_amount / 100}</td>
                  </tr>
                ))}
                </tbody>
              </table>
              {!accountTransactions && <p style={{textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'rgb(171, 171, 171)'}}>No Transactions</p>}
            </div>
          </>
      )}
    />
  </>
  );
};

export default WalletBalance;
