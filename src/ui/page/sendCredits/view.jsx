import React from 'react';
import classnames from 'classnames';
import WalletSend from 'component/walletSend';
import WalletAddress from 'component/walletAddress';
import Page from 'component/page';
import UnsupportedOnWeb from 'component/common/unsupported-on-web';

const SendReceivePage = () => (
  <Page>
    {IS_WEB && <UnsupportedOnWeb />}
    <div className={classnames({ 'card--disabled': IS_WEB })}>
      <WalletSend />
      <WalletAddress />
    </div>
  </Page>
);

export default SendReceivePage;
