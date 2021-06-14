// @flow
import React from 'react';
import { withRouter } from 'react-router';
import WalletBalance from 'component/walletBalance';
import TxoList from 'component/txoList';
import FiatTxoList from 'component/fiatTxoList';
import StripeAccountConnection from 'component/stripeAccountConnection';
import Page from 'component/page';
import Spinner from 'component/spinner';
import YrblWalletEmpty from 'component/yrblWalletEmpty';

type Props = {
  history: { action: string, push: string => void, replace: string => void },
  location: { search: string, pathname: string },
  totalBalance: ?number,
};

const WalletPage = (props: Props) => {
  const { location, totalBalance } = props;
  const { search } = location;
  const showIntro = totalBalance === 0;
  const loading = totalBalance === undefined;

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
              <StripeAccountConnection />
              <TxoList search={search} />
              <FiatTxoList search={search} />
            </div>
          )}
        </>
      )}
    </Page>
  );
};

export default withRouter(WalletPage);
