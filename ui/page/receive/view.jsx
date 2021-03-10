// @flow
import React from 'react';
import Page from 'component/page';
import LbcSymbol from 'component/common/lbc-symbol';
import WalletAddress from 'component/walletAddress';

type Props = {};

export default function ReceivePage(props: Props) {
  return (
    <Page
      noSideNavigation
      className="main--buy"
      backout={{
        backoutLabel: __('Done'),
        title: (
          <>
            <LbcSymbol prefix={__('Receive')} size={28} />
          </>
        ),
      }}
    >
      <WalletAddress />
    </Page>
  );
}
