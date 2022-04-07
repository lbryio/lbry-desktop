// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import { SETTINGS_GRP } from 'constants/settings';
import React from 'react';
import Button from 'component/button';
import Card from 'component/common/card';
import SettingsRow from 'component/settingsRow';
import SyncToggle from 'component/syncToggle';
import { getPasswordFromCookie } from 'util/saved-passwords';
import { getStripeEnvironment } from 'util/stripe';

type Props = {
  // --- redux ---
  isAuthenticated: boolean,
  walletEncrypted: boolean,
  user: User,
  hasChannels: boolean,
  doWalletStatus: () => void,
};

export default function SettingAccount(props: Props) {
  const { isAuthenticated, walletEncrypted, user, hasChannels, doWalletStatus } = props;
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
            {isAuthenticated && (
              <SettingsRow title={__('Password')}>
                <Button
                  button="inverse"
                  label={__('Manage')}
                  icon={ICONS.ARROW_RIGHT}
                  navigate={`/$/${PAGES.SETTINGS_UPDATE_PWD}`}
                />
              </SettingsRow>
            )}

            {/* @if TARGET='app' */}
            <SyncToggle disabled={walletEncrypted && !storedPassword && storedPassword !== ''} />
            {/* @endif */}

            {/* @if TARGET='web' */}
            {user && getStripeEnvironment() && (
              <SettingsRow
                title={__('Bank Accounts')}
                subtitle={__('Connect a bank account to receive tips and compensation in your local currency.')}
              >
                <Button
                  button="inverse"
                  label={__('Manage')}
                  icon={ICONS.ARROW_RIGHT}
                  navigate={`/$/${PAGES.SETTINGS_STRIPE_ACCOUNT}`}
                />
              </SettingsRow>
            )}
            {/* @endif */}

            {/* @if TARGET='web' */}
            {isAuthenticated && getStripeEnvironment() && (
              <SettingsRow
                title={__('Payment Methods')}
                subtitle={__('Add a credit card to tip creators in their local currency.')}
              >
                <Button
                  button="inverse"
                  label={__('Manage')}
                  icon={ICONS.ARROW_RIGHT}
                  navigate={`/$/${PAGES.SETTINGS_STRIPE_CARD}`}
                />
              </SettingsRow>
            )}
            {/* @endif */}

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

            <SettingsRow title={__('Purchases')} subtitle={__('View your purchased content.')}>
              <Button button="inverse" label={__('Manage')} icon={ICONS.ARROW_RIGHT} navigate={`/$/${PAGES.LIBRARY}`} />
            </SettingsRow>
          </>
        }
      />
    </>
  );
}
