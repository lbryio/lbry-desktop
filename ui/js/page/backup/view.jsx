import React from "react";
import SubHeader from "component/subHeader";
import Link from "component/link";

class BackupPage extends React.PureComponent {
  render() {
    const { daemonSettings } = this.props;

    if (!daemonSettings || Object.keys(daemonSettings).length === 0) {
      return (
        <main className="main--single-column">
          <SubHeader />
          <span className="empty">{__("Failed to load settings.")}</span>
        </main>
      );
    }

    return (
      <main className="main--single-column">
        <SubHeader />
        <section className="card">
          <div className="card__title-primary">
            <h3>{__("Backup Wallet")}</h3>
          </div>
          <div className="card__content">
            {__(
              "Right now there is no automated procedure for backing up the wallet, but rest assured we are working on it(We do have a lot on our plates ^‿^)."
            )}
            {__(
              " But you can still back it up manually, by following the steps mentioned here."
            )}
            <Link
              label={__("Backup LBRY wallet")}
              href="https://lbry.io/faq/how-to-backup-wallet"
            />
          </div>
          <div className="card__content">
            {__("Path of your wallet is: ")}
            <span style={{ backgroundColor: "rgba(211, 211, 211, 0.49)" }}>
              {__(`${daemonSettings.lbryum_wallet_dir}`)}
            </span>
          </div>
        </section>
      </main>
    );
  }
}

export default BackupPage;
