// @flow
import React from 'react';
import { withRouter } from 'react-router';
import WalletBalance from 'component/walletBalance';
import TxoList from 'component/txoList';
import Page from 'component/page';
import Spinner from 'component/spinner';
import YrblWalletEmpty from 'component/yrblWalletEmpty';

type Props = {
  history: { action: string, push: string => void, replace: string => void },
  location: { search: string, pathname: string },
  balance: number,
};

const WalletPage = (props: Props) => {
  const { location, balance } = props;
  const { search } = location;
  const showIntro = balance === 0;
  const loading = balance === undefined;

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
            <>
              <WalletBalance />
              <TxoList search={search} />
            </>
          )}
        </>
      )}
    </Page>
  );
};

export default withRouter(WalletPage);
