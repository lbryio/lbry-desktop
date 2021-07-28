// @flow
import React from 'react';
import { withRouter } from 'react-router';
import WalletBalance from 'component/walletBalance';
import TxoList from 'component/txoList';
import Page from 'component/page';
import Spinner from 'component/spinner';
import YrblWalletEmpty from 'component/yrblWalletEmpty';

type Props = {
  history: { action: string, push: (string) => void, replace: (string) => void },
  location: { search: string, pathname: string },
  totalBalance: ?number,
};

const WalletPage = (props: Props) => {
  const { location, totalBalance } = props;
  const { search } = location;
  const showIntro = totalBalance === 0;
  const loading = totalBalance === undefined;

  const TAB_LBC_TRANSACTIONS = 'TabLBCTransactions';
  const TAB_FIAT_TRANSACTIONS = 'TabFiatTransactions';

  const [activeTab, setActiveTab] = React.useState(TAB_LBC_TRANSACTIONS);

  return (
    <Page>
      {/* tabs to switch between fiat and lbc */}
      <h2 style={{display: 'inline-block', paddingBottom: '14px', marginRight: '10px', textUnderlineOffset: '4px', textDecoration: 'underline'}}
        onClick={() => {
          document.getElementsByClassName('lbc-transactions')[0].style.display = 'inline';
          document.getElementsByClassName('fiat-transactions')[0].style.display = 'none';
        }}
      >LBC Transactions</h2>
      <h2 style={{display: 'inline-block'}}
        onClick={() => {
          document.getElementsByClassName('lbc-transactions')[0].style.display = 'none';
          document.getElementsByClassName('fiat-transactions')[0].style.display = 'inline';
        }}
      >Fiat Transactions</h2>
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
          <div className="fiat-transactions">
            <h2>Here's your fiat transactions</h2>
          </div>
        </>
      )}
    </Page>
  );
};

export default withRouter(WalletPage);
