// @flow
import React from 'react';
import Page from 'component/page';
import WalletSwap from 'component/walletSwap';
import WalletBuy from 'component/walletBuy';

type Props = {};

export default function SwapPage(props: Props) {
  const [buyMethod, setBuyMethod] = React.useState(false);

  return (
    <Page
      noSideNavigation
      className="main--swap"
      backout={{
        backoutLabel: __('Done'),
        title: __('Swap Crypto'),
      }}
    >
      {!buyMethod ? <WalletSwap buyMethod={buyMethod} setBuyMethod={setBuyMethod} />
      : <WalletBuy buyMethod={buyMethod} setBuyMethod={setBuyMethod} />}
    </Page>
  );
}
