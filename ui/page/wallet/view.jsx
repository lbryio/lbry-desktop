// @flow
import React from 'react';
import { withRouter } from 'react-router';
import WalletBalance from 'component/walletBalance';
import WalletFiatBalance from 'component/walletFiatBalance';
import WalletFiatPaymentBalance from 'component/walletFiatPaymentBalance';
import WalletFiatAccountHistory from 'component/walletFiatAccountHistory';
import WalletFiatPaymentHistory from 'component/walletFiatPaymentHistory';
import TxoList from 'component/txoList';
import Page from 'component/page';
import Spinner from 'component/spinner';
import YrblWalletEmpty from 'component/yrblWalletEmpty';
import { Lbryio } from 'lbryinc';
import { STRIPE_PUBLIC_KEY } from '../../../config';

let stripeEnvironment = 'test';
// if the key contains pk_live it's a live key
// update the environment for the calls to the backend to indicate which environment to hit
if (STRIPE_PUBLIC_KEY.indexOf('pk_live') > -1) {
  stripeEnvironment = 'live';
}

type Props = {
  history: { action: string, push: (string) => void, replace: (string) => void },
  location: { search: string, pathname: string },
  totalBalance: ?number,
};

const WalletPage = (props: Props) => {
  const tab = new URLSearchParams(props.location.search).get('tab');

  const [accountStatusResponse, setAccountStatusResponse] = React.useState();
  const [accountTransactionResponse, setAccountTransactionResponse] = React.useState([]);
  const [customerTransactions, setCustomerTransactions] = React.useState([]);
  const [totalTippedAmount, setTotalTippedAmount] = React.useState(0);

  function getPaymentHistory() {
    return Lbryio.call(
      'customer',
      'list',
      {
        environment: stripeEnvironment,
      },
      'post'
    );
  }

  function getAccountStatus() {
    return Lbryio.call(
      'account',
      'status',
      {
        environment: stripeEnvironment,
      },
      'post'
    );
  }

  function getAccountTransactionsa() {
    return Lbryio.call(
      'account',
      'list',
      {
        environment: stripeEnvironment,
      },
      'post'
    );
  }

  // calculate account transactions section
  React.useEffect(() => {
    (async function() {
      try {
        const response = await getAccountStatus();

        setAccountStatusResponse(response);

        // TODO: some weird naming clash hence getAccountTransactionsa
        const getAccountTransactions = await getAccountTransactionsa();

        setAccountTransactionResponse(getAccountTransactions);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  // populate customer payment data
  React.useEffect(() => {
    (async function() {
      try {
        // get card payments customer has made
        const customerTransactionResponse = await getPaymentHistory();

        let totalTippedAmount = 0;

        for (const transaction of customerTransactionResponse) {
          totalTippedAmount = totalTippedAmount + transaction.tipped_amount;
        }

        setTotalTippedAmount(totalTippedAmount / 100);

        setCustomerTransactions(customerTransactionResponse);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  // TODO: use built in tabs functionality
  function focusLBCTab() {
    document.getElementsByClassName('lbc-transactions')[0].style.display = 'inline';
    document.getElementsByClassName('fiat-transactions')[0].style.display = 'none';
    document.getElementsByClassName('payment-history-tab')[0].style.display = 'none';

    document.getElementsByClassName('lbc-tab-switcher')[0].style.textDecoration = 'underline';
    document.getElementsByClassName('fiat-tab-switcher')[0].style.textDecoration = 'none';
    document.getElementsByClassName('fiat-payment-history-switcher')[0].style.textDecoration = 'none';
  }

  function focusAccountHistoryTab() {
    document.getElementsByClassName('lbc-transactions')[0].style.display = 'none';
    document.getElementsByClassName('payment-history-tab')[0].style.display = 'none';
    document.getElementsByClassName('fiat-transactions')[0].style.display = 'inline';

    document.getElementsByClassName('lbc-tab-switcher')[0].style.textDecoration = 'none';
    document.getElementsByClassName('fiat-tab-switcher')[0].style.textDecoration = 'underline';
    document.getElementsByClassName('fiat-payment-history-switcher')[0].style.textDecoration = 'none';
  }

  function focusPaymentHistoryTab() {
    document.getElementsByClassName('lbc-transactions')[0].style.display = 'none';
    document.getElementsByClassName('fiat-transactions')[0].style.display = 'none';
    document.getElementsByClassName('payment-history-tab')[0].style.display = 'inline';

    document.getElementsByClassName('lbc-tab-switcher')[0].style.textDecoration = 'none';
    document.getElementsByClassName('fiat-tab-switcher')[0].style.textDecoration = 'none';
    document.getElementsByClassName('fiat-payment-history-switcher')[0].style.textDecoration = 'underline';
  }

  // select the first tab
  React.useEffect(() => {
    if (tab === 'account-history') {
    // if (1 === 2) {
      focusAccountHistoryTab();
    } else if (tab === 'payment-history') {
    // } else if (1 === 2){
      focusPaymentHistoryTab();
    } else {
      focusLBCTab();
    }
  }, []);

  const { location, totalBalance } = props;
  const { search } = location;
  const showIntro = totalBalance === 0;
  const loading = totalBalance === undefined;

  return (
    <Page>
      {/* tabs to switch between fiat and lbc */}
      {/* lbc button */}
      <h2 className="lbc-tab-switcher"
        style={{display: 'inline-block', paddingBottom: '16px', marginRight: '14px', textUnderlineOffset: '4px', fontSize: '18px', marginLeft: '3px'}}
        onClick={() => {
          focusLBCTab();
        }}
      >LBRY Credits</h2>
      {/* account history button */}
      <h2 className="fiat-tab-switcher"
        style={{display: 'inline-block', textUnderlineOffset: '4px', fontSize: '18px', marginRight: '14px'}}
        onClick={() => {
          focusAccountHistoryTab();
        }}
      >Account History</h2>
      {/* payment history button */}
      <h2 className="fiat-payment-history-switcher"
        style={{display: 'inline-block', textUnderlineOffset: '4px', fontSize: '18px'}}
        onClick={() => {
            focusPaymentHistoryTab();
          }}
      >Payment History</h2>

      {/* lbc wallet section */}
      <div className="lbc-transactions">
        {/* if the transactions are loading */}
        { loading && (
          <div className="main--empty">
            <Spinner delayed />
          </div>
        )}
        {/* when the transactions are finished loading */}
        { !loading && (
          <>
            {showIntro ? (
              <YrblWalletEmpty includeWalletLink />
            ) : (
              <div className="card-stack">
                <WalletBalance />
                <TxoList search={search} />
              </div>
            )}
          </>
        )}
      </div>

      {/* account received transactions section */}
      <div className="fiat-transactions" style={{display: 'none'}}>
          <WalletFiatBalance accountDetails={accountStatusResponse} />
          <div style={{paddingTop: '25px'}} />
          <WalletFiatAccountHistory transactions={accountTransactionResponse} />
      </div>

      {/* fiat payment history for tips made by user */}
      <div className="payment-history-tab" style={{display: 'none'}}>
        <WalletFiatPaymentBalance transactions={customerTransactions} totalTippedAmount={totalTippedAmount} accountDetails={accountStatusResponse} />
        <div style={{paddingTop: '25px'}} />
        <WalletFiatPaymentHistory transactions={customerTransactions} />
      </div>

    </Page>
  );
};

export default withRouter(WalletPage);
