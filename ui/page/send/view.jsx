// @flow
import React from 'react';
import Page from 'component/page';
import LbcSymbol from 'component/common/lbc-symbol';
import WalletSend from 'component/walletSend';

type Props = {};

export default function SendPage(props: Props) {
  return (
    <Page
      noSideNavigation
      className="main--send"
      backout={{
        backoutLabel: __('Done'),
        title: (
          <>
            <LbcSymbol prefix={__('Send')} size={28} />
          </>
        ),
      }}
    >
      <WalletSend />
    </Page>
  );
}
