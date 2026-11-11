import * as ICONS from "constants/icons";
import * as PAGES from "constants/pages";
import { SETTINGS_GRP } from "constants/settings";
import React from "react";
import Button from "component/button";
import Card from "component/common/card";
import SettingsRow from "component/settingsRow";
import SyncToggle from "component/syncToggle";
import { getPasswordFromCookie } from "util/saved-passwords";

type Props = {
  isAuthenticated: boolean;
  walletEncrypted: boolean;
  user: User;
  hasChannels: boolean;
  doWalletStatus: () => void;
};

export default function SettingAccount(props: Props) {
  const { isAuthenticated, walletEncrypted, hasChannels, doWalletStatus } = props;
  const [storedPassword, setStoredPassword] = React.useState(false);

  // Determine if password is stored.
  React.useEffect(() => {
    doWalletStatus();
    getPasswordFromCookie().then((p) => {
      if (typeof p === "string") {
        setStoredPassword(true);
      }
    });
  }, []);

  return (
    <>
      <div className="card__title-section">
        <h2 className="card__title">{__("Account")}</h2>
      </div>

      <Card
        id={SETTINGS_GRP.ACCOUNT}
        isBodyList
        body={
          <>
            {isAuthenticated && (
              <SettingsRow title={__("Password")}>
                <Button
                  // @ts-expect-error - TS2322 (ts-migration)
                  button="inverse"
                  label={__("Manage")}
                  icon={ICONS.ARROW_RIGHT}
                  navigate={`/$/${PAGES.SETTINGS_UPDATE_PWD}`}
                />
              </SettingsRow>
            )}

            {/* @ts-expect-error - TS2367 - This condition will always return 'true' since the types 'boolean' and 'string' have no overlap. */}
            <SyncToggle disabled={walletEncrypted && !storedPassword && storedPassword !== ""} />

            {hasChannels && (
              <SettingsRow title={__("Comments")} subtitle={__("View your past comments.")}>
                <Button
                  // @ts-expect-error - TS2322 (ts-migration)
                  button="inverse"
                  label={__("Manage")}
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
