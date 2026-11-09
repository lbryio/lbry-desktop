import * as React from 'react';
import Page from 'component/page';
import WalletBackup from 'component/walletBackup';

function BackupPage() {
  return (
    // @ts-expect-error - TS2740 (ts-migration)
    <Page>
      <WalletBackup />
    </Page>
  );
}

export default BackupPage;
