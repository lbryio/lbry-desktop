// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import { SETTINGS_GRP } from 'constants/settings';
import React from 'react';
import Button from 'component/button';
import Card from 'component/common/card';
import SettingsRow from 'component/settingsRow';
// maybe bring this back
// import SyncToggle from 'component/syncToggle';
import { getPasswordFromCookie } from 'util/saved-passwords';

type Props = {
  walletEncrypted: boolean,
  hasChannels: boolean,
  doWalletStatus: () => void,
};

export default function SettingAccount(props: Props) {
  const { hasChannels, doWalletStatus } = props;
  // const [storedPassword, setStoredPassword] = React.useState(false);

  // Determine if password is stored.
  React.useEffect(() => {
    doWalletStatus();
    getPasswordFromCookie().then((p) => {
      if (typeof p === 'string') {
        // get password
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="card__title-section">
        <h2 className="card__title">{__('Account')}</h2>
      </div>

      <Card
        id={SETTINGS_GRP.ACCOUNT}
        isBodyList
        body={
          <>
            {/* This will probably start the new sync flow when checked (-> openModal(SYNC_ENABLE) )  */}
            {/* <SyncToggle disabled={true} /> */}

            {hasChannels && (
              <SettingsRow title={__('Comments')} subtitle={__('View your past comments.')}>
                <Button
                  button="inverse"
                  label={__('Manage')}
                  icon={ICONS.ARROW_RIGHT}
                  navigate={`/$/${PAGES.SETTINGS_OWN_COMMENTS}`}
                />
              </SettingsRow>
            )}
          </>
        }
      />
    </>
  );
}
