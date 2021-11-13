// @flow
import React from 'react';
import { useHistory } from 'react-router';
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
  const {
    location: { search },
  } = useHistory();

  const { totalBalance } = props;
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
              <TxoList search={search} />
            </div>
          )}
        </>
      )}
    </Page>
  );
};

export default WalletPage;
