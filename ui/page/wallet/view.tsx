import React from 'react';
import { useHistory } from 'react-router';
import TxoList from 'component/txoList';
import Page from 'component/page';
import WalletBalance from 'component/walletBalance';
import Spinner from 'component/spinner';
import YrblWalletEmpty from 'component/yrblWalletEmpty';

type Props = {
  history: {
    action: string,
    push: (arg1: string) => void,
    replace: (arg1: string) => void
  },
  location: {
    search: string,
    pathname: string
  },
  totalBalance: number | null | undefined
};

const WalletPage = (props: Props) => {
  const {
    location: { search },
  } = useHistory();

  const { totalBalance } = props;
  const showIntro = totalBalance === 0;
  const loading = totalBalance === undefined;

  return (
    // @ts-expect-error - TS2740 (ts-migration)
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
              {/* @ts-expect-error - TS2741 (ts-migration) */}
              <WalletBalance />
              <TxoList search={search} />
            </div>
          )}
        </>
      )}
    </Page>
  );
};

export default WalletPage;
