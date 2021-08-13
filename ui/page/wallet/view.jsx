// @flow
import React from 'react';
import { useHistory, withRouter } from 'react-router';
import WalletBalance from 'component/walletBalance';
import WalletFiatBalance from 'component/walletFiatBalance';
import WalletFiatPaymentBalance from 'component/walletFiatPaymentBalance';
import WalletFiatAccountHistory from 'component/walletFiatAccountHistory';
import WalletFiatPaymentHistory from 'component/walletFiatPaymentHistory';
import TxoList from 'component/txoList';
import Page from 'component/page';
import * as PAGES from 'constants/pages';
import Spinner from 'component/spinner';
import YrblWalletEmpty from 'component/yrblWalletEmpty';
import { Lbryio } from 'lbryinc';
import { SIMPLE_SITE, STRIPE_PUBLIC_KEY } from 'config';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'component/common/tabs';
import { PAGE_VIEW_QUERY } from '../channel/view';

const TAB_QUERY = 'tab';

const TABS = {
  LBRY_CREDITS_TAB: 'credits',
  ACCOUNT_HISTORY: 'fiat-account-history',
  PAYMENT_HISTORY: 'fiat-payment-history',
};

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
  const {
    location: { search },
    push,
  } = useHistory();

  // @if TARGET='web'
  const urlParams = new URLSearchParams(search);

  const currentView = urlParams.get(TAB_QUERY) || TABS.LBRY_CREDITS_TAB;

  let tabIndex;
  switch (currentView) {
    case TABS.LBRY_CREDITS_TAB:
      tabIndex = 0;
      break;
    case TABS.PAYMENT_HISTORY:
      tabIndex = 1;
      break;
    case TABS.ACCOUNT_HISTORY:
      tabIndex = 2;
      break;
    default:
      tabIndex = 0;
      break;
  }

  function onTabChange(newTabIndex) {
    let url = `/$/${PAGES.WALLET}?`;

    if (newTabIndex === 0) {
      url += `${TAB_QUERY}=${TABS.LBRY_CREDITS_TAB}`;
    } else if (newTabIndex === 1) {
      url += `${TAB_QUERY}=${TABS.PAYMENT_HISTORY}`;
    } else if (newTabIndex === 2) {
      url += `${TAB_QUERY}=${TABS.ACCOUNT_HISTORY}`;
    } else {
      url += `${TAB_QUERY}=${TABS.LBRY_CREDITS_TAB}`;
    }
    push(url);
  }

  const [accountStatusResponse, setAccountStatusResponse] = React.useState();
  const [accountTransactionResponse, setAccountTransactionResponse] = React.useState([]);
  const [customerTransactions, setCustomerTransactions] = React.useState([]);

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

        setCustomerTransactions(customerTransactionResponse);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  // @endif

  const { totalBalance } = props;
  const showIntro = totalBalance === 0;
  const loading = totalBalance === undefined;

  // @if TARGET='web'
  return (
    <Page>
      <Tabs onChange={onTabChange} index={tabIndex}>
        <TabList className="tabs__list--collection-edit-page">
          <Tab>{__('LBRY Credits')}</Tab>
          <Tab>{__('Account History')}</Tab>
          <Tab>{__('Payment History')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div className="section card-stack">
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
            </div>
          </TabPanel>
          <TabPanel>
            <div className="section card-stack">
              <WalletFiatBalance accountDetails={accountStatusResponse} />
              <WalletFiatAccountHistory transactions={accountTransactionResponse} />
            </div>
          </TabPanel>
          <TabPanel>
            <div className="section card-stack">
              <WalletFiatPaymentBalance transactions={customerTransactions} accountDetails={accountStatusResponse} />
              <WalletFiatPaymentHistory transactions={customerTransactions} />
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Page>
  );
  // @endif
  // @if TARGET='app'
  // eslint-disable-next-line no-unreachable
  return (
    <Page>
      {loading && (
        <div className="main--empty">
          <Spinner delayed />
        </div>
      )}
      {!loading && (
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
    </Page>
  );
  // @endif

};

export default WalletPage;
