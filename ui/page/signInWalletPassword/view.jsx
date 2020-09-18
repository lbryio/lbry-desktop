import React from 'react';
import Page from 'component/page';
import SyncPassword from 'component/syncPassword';

export default function SignInWalletPasswordPage() {
  return (
    <Page authPage>
      <SyncPassword />
    </Page>
  );
}
