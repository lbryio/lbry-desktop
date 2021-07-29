// @flow
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import * as PAGES from 'constants/pages';
import React from 'react';
import CreditAmount from 'component/common/credit-amount';
import Button from 'component/button';
import HelpLink from 'component/common/help-link';
import Card from 'component/common/card';
import Icon from 'component/common/icon';
import LbcSymbol from 'component/common/lbc-symbol';
import I18nMessage from 'component/i18nMessage';
import { formatNumberWithCommas } from 'util/number';
import { Lbryio } from 'lbryinc';
import moment from 'moment';

type Props = {
  accountDetails: any,
  transactions: any,
  totalTippedAmount: number,
};

const WalletBalance = (props: Props) => {
  const {

  } = props;

  // receive transactions from parent component
  let accountTransactions = props.transactions;

  console.log('heres transactions')
  console.log(accountTransactions);

  // let totalTippedAmount = props.totalTippedAmount;

  // totalTippedAmount = 0;



  // reverse so most recent payments come first
  if(accountTransactions){
    accountTransactions = accountTransactions.reverse();
  }

  const [detailsExpanded, setDetailsExpanded] = React.useState(false);
  const [accountStatusResponse, setAccountStatusResponse] = React.useState();
  const [paymentHistoryTransactions, setPaymentHistoryTransactions] = React.useState();
  const [subscriptions, setSubscriptions] = React.useState();
  const [totalTippedAmount, setTotalTippedAmount] = React.useState(0);


  const [lastFour, setLastFour] = React.useState();

  var environment = 'test';

  function getPaymentHistory() {
    return Lbryio.call(
    'customer',
    'list',
    {
      environment,
    },
    'post'
  )};

  function getCustomerStatus(){
    return Lbryio.call(
      'customer',
      'status',
      {
        environment,
      },
      'post'
    )
  }

  React.useEffect(() => {
    (async function(){
        let response = accountTransactions;

        console.log('payment transactions');
        console.log(response);

        const customerStatusResponse = await getCustomerStatus();

        setLastFour(customerStatusResponse.PaymentMethods[0].card.last4);

        if (response && response.length > 10) response.length = 10;

        setPaymentHistoryTransactions(response);

        const subscriptions  = [...response];

        if(subscriptions && subscriptions.length > 2){
          subscriptions.length = 2
          setSubscriptions([])
        } else {
          setSubscriptions([])
        }

        console.log(response);

    })();
  }, [accountTransactions]);

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
                        className="stripe__card-link-text"
                        navigate={'/' + transaction.channel_name + ':' + transaction.channel_claim_id}
                        label={transaction.channel_name}
                        button="link"
                      />
                    </td>
                    <td>
                      <Button
                        className="stripe__card-link-text"
                        navigate={'/' + transaction.channel_name + ':' + transaction.source_claim_id}
                        label={
                          transaction.channel_claim_id === transaction.source_claim_id
                            ? 'Channel Page'
                            : 'File Page'
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
              {(!accountTransactions || accountTransactions.length === 0) && <p style={{textAlign:"center", marginTop: '20px', fontSize: '13px', color: 'rgb(171, 171, 171)'}}>No Transactions</p>}
            </div>
          </>
        }
      />

    <Card
      title={__('Subscriptions')}
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
              {subscriptions &&
              subscriptions.reverse().map((transaction) => (
                <tr key={transaction.name + transaction.created_at}>
                  <td>{moment(transaction.created_at).format('LLL')}</td>
                  <td>
                    <Button
                      className="stripe__card-link-text"
                      navigate={'/' + transaction.channel_name + ':' + transaction.channel_claim_id}
                      label={transaction.channel_name}
                      button="link"
                    />
                  </td>
                  <td>
                    <Button
                      className="stripe__card-link-text"
                      navigate={'/' + transaction.channel_name + ':' + transaction.source_claim_id}
                      label={
                        transaction.channel_claim_id === transaction.source_claim_id
                          ? 'Channel Page'
                          : 'File Page'
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
            {(!subscriptions || subscriptions.length === 0) && <p style={{textAlign:"center", marginTop: '20px', fontSize: '13px', color: 'rgb(171, 171, 171)'}}>No Subscriptions</p>}
          </div>
        </>
      }
    />
  </>
  );
};

export default WalletBalance;
