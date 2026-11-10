import * as React from 'react';
import Page from 'component/page';
import WalletBackup from 'component/walletBackup';
import WalletSeed from 'component/walletSeed';

function BackupPage() {
  return (
    // @ts-expect-error - TS2740 (ts-migration)
    <Page className="card-stack">
      <WalletSeed />
      <WalletBackup />
    </Page>
  );
}

export default BackupPage;
