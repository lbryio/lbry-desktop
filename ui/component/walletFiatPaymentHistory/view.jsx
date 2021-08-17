// @flow
import React from 'react';
import Button from 'component/button';
import Card from 'component/common/card';
import { Lbryio } from 'lbryinc';
import moment from 'moment';
import { getStripeEnvironment } from 'util/stripe';
let stripeEnvironment = getStripeEnvironment();

type Props = {
  accountDetails: any,
  transactions: any,
};

const WalletBalance = (props: Props) => {
  // receive transactions from parent component
  const { transactions: accountTransactions } = props;

  // const [accountStatusResponse, setAccountStatusResponse] = React.useState();

  // const [subscriptions, setSubscriptions] = React.useState();

  const [lastFour, setLastFour] = React.useState();

  function getCustomerStatus() {
    return Lbryio.call(
      'customer',
      'status',
      {
        environment: stripeEnvironment,
      },
      'post'
    );
  }

  // TODO: this is actually incorrect, last4 should be populated based on the transaction not the current customer details
  React.useEffect(() => {
    (async function () {
      const customerStatusResponse = await getCustomerStatus();

      const lastFour =
        customerStatusResponse.PaymentMethods &&
        customerStatusResponse.PaymentMethods.length &&
        customerStatusResponse.PaymentMethods[0].card.last4;

      setLastFour(lastFour);
    })();
  }, []);

  return (
    <>
      <Card
        title={__('Payment History')}
        body={
          <>
            <div className="table__wrapper">
              <table className="table table--transactions">
                <thead>
                  <tr>
                    <th className="date-header">{__('Date')}</th>
                    <th>{<>{__('Receiving Channel Name')}</>}</th>
                    <th>{__('Tip Location')}</th>
                    <th>{__('Amount (USD)')} </th>
                    <th>{__('Card Last 4')}</th>
                    <th>{__('Anonymous')}</th>
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
                        <td>{lastFour}</td>
                        <td>{transaction.private_tip ? 'Yes' : 'No'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {(!accountTransactions || accountTransactions.length === 0) && (
                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'rgb(171, 171, 171)' }}>
                  No Transactions
                </p>
              )}
            </div>
          </>
        }
      />
    </>
  );
};

export default WalletBalance;
