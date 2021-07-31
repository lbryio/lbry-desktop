// @flow
import React from 'react';
import Page from 'component/page';
import WalletSwap from 'component/walletSwap';

type Props = {};

export default function SwapPage(props: Props) {
  return (
    <Page
      noSideNavigation
      className="main--swap"
      backout={{
        backoutLabel: __('Done'),
        title: __('Swap Crypto'),
      }}
    >
      <WalletSwap />
    </Page>
  );
}
