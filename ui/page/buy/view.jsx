// @flow
import React from 'react';
import Page from 'component/page';
import LbcSymbol from 'component/common/lbc-symbol';
import WalletBuy from 'component/walletBuy';
import WalletSwap from 'component/walletSwap';

type Props = {};

export default function BuyPage(props: Props) {
  const [buyMethod, setBuyMethod] = React.useState(true);

  return (
    <Page
      noSideNavigation
      className="main--buy"
      backout={{
        backoutLabel: __('Done'),
        title: (
          <>
            <LbcSymbol prefix={__('Buy')} size={28} />
          </>
        ),
      }}
    >
    {buyMethod ? <WalletBuy buyMethod={buyMethod} setBuyMethod={setBuyMethod} />
    : <WalletSwap buyMethod={buyMethod} setBuyMethod={setBuyMethod} />}
    </Page>
  );
}
