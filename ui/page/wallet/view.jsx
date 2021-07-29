// @flow
import React from 'react';
import { withRouter } from 'react-router';
import WalletBalance from 'component/walletBalance';
import WalletFiatBalance from 'component/walletFiatBalance';
import WalletFiatTransactions from 'component/walletFiatTransactions';
import TxoList from 'component/txoList';
import Page from 'component/page';
import Spinner from 'component/spinner';
import YrblWalletEmpty from 'component/yrblWalletEmpty';
import { Lbryio } from 'lbryinc';

type Props = {
  history: { action: string, push: (string) => void, replace: (string) => void },
  location: { search: string, pathname: string },
  totalBalance: ?number,
};

const WalletPage = (props: Props) => {
  console.log(props);

  var stripeEnvironment = 'test';

  const tab = new URLSearchParams(props.location.search).get('tab');

  const [accountStatusResponse, setAccountStatusResponse] = React.useState();
  const [accountTransactionResponse, setAccountTransactionResponse] = React.useState();

  function getAccountStatus(){
    return Lbryio.call(
      'account',
      'status',
      {
        environment: stripeEnvironment,
      },
      'post'
    );
  }

  function getAccountTransactionsa(){
    return Lbryio.call(
      'account',
      'list',
      {
        environment: stripeEnvironment,
      },
      'post'
    );
  }

  React.useEffect(() => {
    (async function(){
      try {
        const response = await getAccountStatus();

        console.log('account status');

        console.log(response);

        setAccountStatusResponse(response);

        // TODO: some weird naming clash
        const getAccountTransactions = await getAccountTransactionsa();

        console.log('transactions');

        setAccountTransactionResponse(getAccountTransactions)

        console.log(getAccountTransactions);

      } catch (err){





      }


    })();
  }, []);

  React.useEffect(() => {
    // if (tab === 'currency') {
    if (1 === 1) {
      document.getElementsByClassName('lbc-transactions')[0].style.display = 'none';
      document.getElementsByClassName('fiat-transactions')[0].style.display = 'inline';

      document.getElementsByClassName('lbc-tab-switcher')[0].style.textDecoration = 'none';
      document.getElementsByClassName('fiat-tab-switcher')[0].style.textDecoration = 'underline';
    }
  }, []);

  const { location, totalBalance } = props;
  const { search } = location;
  const showIntro = totalBalance === 0;
  const loading = totalBalance === undefined;

  return (
    <Page>
      {/* tabs to switch between fiat and lbc */}
      <h2 className="lbc-tab-switcher"
        style={{display: 'inline-block', paddingBottom: '16px', marginRight: '14px', textUnderlineOffset: '4px', textDecoration: 'underline', fontSize: '18px', marginLeft: '3px'}}
        onClick={() => {
          document.getElementsByClassName('lbc-transactions')[0].style.display = 'inline';
          document.getElementsByClassName('fiat-transactions')[0].style.display = 'none';

          document.getElementsByClassName('lbc-tab-switcher')[0].style.textDecoration = 'underline';
          document.getElementsByClassName('fiat-tab-switcher')[0].style.textDecoration = 'none';
        }}
      >LBC Wallet</h2>
      <h2 className="fiat-tab-switcher"
        style={{display: 'inline-block', textUnderlineOffset: '4px', fontSize: '18px'}}
        onClick={() => {
          document.getElementsByClassName('lbc-transactions')[0].style.display = 'none';
          document.getElementsByClassName('fiat-transactions')[0].style.display = 'inline';

          document.getElementsByClassName('lbc-tab-switcher')[0].style.textDecoration = 'none';
          document.getElementsByClassName('fiat-tab-switcher')[0].style.textDecoration = 'underline';
        }}
      >Account History</h2>
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
      {(
        <>
          <div className="fiat-transactions" style={{display: 'none'}}>
            <WalletFiatBalance accountDetails={accountStatusResponse} />
            <div style={{paddingTop: '20px'}}></div>
            <WalletFiatTransactions transactions={accountTransactionResponse}/>
          </div>
        </>
      )}
    </Page>
  );
};

export default withRouter(WalletPage);
