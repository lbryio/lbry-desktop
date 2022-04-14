// @flow
import React from 'react';
import { useHistory } from 'react-router';
import TxoList from 'component/txoList';
import Page from 'component/page';
import WalletBalance from 'component/walletBalance';
import ClaimList from 'component/claimList';

type Props = {
  history: { action: string, push: (string) => void, replace: (string) => void },
  location: { search: string, pathname: string },
};

const Elements = (props: Props) => {
  const {
    location: { search },
  } = useHistory();

  return (
    <Page>
      <div className="card-stack">
        <label>claims</label>
        <ClaimList uris={'lbry://@Odysee#8/Odysee-Android-App#1'} showUnresolvedClaims showHiddenByUser hideMenu />
        <ClaimList
          uris={'lbry://@Odysee#8/Odysee-Android-App#1'}
          showUnresolvedClaims
          showHiddenByUser
          hideMenu
          tileLayout
        />

        <label>channels</label>
        <ClaimList uris={'lbry://@Odysee#8'} showUnresolvedClaims showHiddenByUser hideMenu />
        <ClaimList uris={'lbry://@Odysee#8'} showUnresolvedClaims showHiddenByUser hideMenu tileLayout />
        <WalletBalance />
        <TxoList search={search} />
      </div>
    </Page>
  );
};

export default Elements;
