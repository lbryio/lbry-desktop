// @flow
import React from 'react';
import { withRouter } from 'react-router';
import WalletBalance from 'component/walletBalance';
import TxoList from 'component/txoList';
import Page from 'component/page';

type Props = {
  history: { action: string, push: string => void, replace: string => void },
  location: { search: string, pathname: string },
};

const WalletPage = (props: Props) => {
  const { location } = props;
  const { search } = location;

  return (
    <Page>
      <WalletBalance />
      <TxoList search={search} />
    </Page>
  );
};

export default withRouter(WalletPage);
