// @flow
import React from 'react';
import Button from 'component/button';
import moment from 'moment';
import * as STRIPE from 'constants/stripe';

type Props = {
  accountDetails: any,
  transactions: StripeTransactions,
  lastFour: ?any,
  doGetCustomerStatus: () => void,
};

const WalletFiatPaymentHistory = (props: Props) => {
  // receive transactions from parent component
  const { transactions: accountTransactions, lastFour, doGetCustomerStatus } = props;

  React.useEffect(() => {
    doGetCustomerStatus();
  }, [doGetCustomerStatus]);

  return (
    <>
      <div className="section card-stack">
        <div className="table__wrapper">
          <table className="table table--transactions">
            {/* table header */}
            <thead>
              <tr>
                <th className="date-header">{__('Date')}</th>
                <th className="channelName-header">{<>{__('Receiving Channel Name')}</>}</th>
                <th className="location-header">{__('Tip Location')}</th>
                <th className="amount-header">{__('Amount')} </th>
                <th className="card-header">{__('Card Last 4')}</th>
                <th className="anonymous-header">{__('Anonymous')}</th>
              </tr>
            </thead>
            {/* list data for transactions */}
            <tbody>
              {accountTransactions &&
                accountTransactions.map((transaction) => (
                  <tr key={transaction.name + transaction.created_at}>
                    {/* date */}
                    <td>{moment(transaction.created_at).format('LLL')}</td>
                    {/* receiving channel name */}
                    <td>
                      <Button
                        className=""
                        navigate={'/' + transaction.channel_name + ':' + transaction.channel_claim_id}
                        label={transaction.channel_name}
                        button="link"
                      />
                    </td>
                    {/* link to content or channel */}
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
                    {/* how much tipped */}
                    <td>
                      {STRIPE.CURRENCY[transaction.currency.toUpperCase()].symbol}
                      {transaction.tipped_amount / 100} {STRIPE.CURRENCIES[transaction.currency.toUpperCase()]}
                    </td>
                    {/* TODO: this is incorrect need it per transactions not per user */}
                    {/* last four of credit card  */}
                    <td>{lastFour}</td>
                    {/* whether tip is anonymous or not */}
                    <td>{transaction.private_tip ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          {/* show some markup if there's no transactions */}
          {(!accountTransactions || accountTransactions.length === 0) && (
            <p className="wallet__fiat-transactions">{__('No Transactions')}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default WalletFiatPaymentHistory;
