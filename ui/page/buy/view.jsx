// @flow
import React from 'react';
import Page from 'component/page';
import LbcSymbol from 'component/common/lbc-symbol';
import WalletBuy from 'component/walletBuy';

type Props = {};

export default function BuyPage(props: Props) {
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
    <WalletBuy />
    </Page>
  );
}
