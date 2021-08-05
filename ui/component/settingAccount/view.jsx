// @flow
import React from 'react';
import Card from 'component/common/card';
import SettingAccountPassword from 'component/settingAccountPassword';
import SyncToggle from 'component/syncToggle';
import { getPasswordFromCookie } from 'util/saved-passwords';

type Props = {
  // --- select ---
  isAuthenticated: boolean,
  walletEncrypted: boolean,
  // --- perform ---
  doWalletStatus: () => void,
};

export default function SettingAccount(props: Props) {
  const { isAuthenticated, walletEncrypted, doWalletStatus } = props;
  const [storedPassword, setStoredPassword] = React.useState(false);

  // Determine if password is stored.
  React.useEffect(() => {
    if (isAuthenticated || !IS_WEB) {
      doWalletStatus();
      getPasswordFromCookie().then((p) => {
        if (typeof p === 'string') {
          setStoredPassword(true);
        }
      });
    }
    // enterSettings(); @KP need to do this at each component, or just at Settings Page?
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Card
      title={__('Account')}
      subtitle=""
      isBodyList
      body={
        <>
          {isAuthenticated && (
            <div className="card__main-actions">
              <SettingAccountPassword />
            </div>
          )}

          {/* @if TARGET='app' */}
          <div className="card__main-actions">
            <SyncToggle disabled={walletEncrypted && !storedPassword && storedPassword !== ''} />
          </div>
          {/* @endif */}
        </>
      }
    />
  );
}
