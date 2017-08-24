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
            <h3>{__("Backup Your LBRY Credits")}</h3>
          </div>
          <div className="card__content">
            <p>
              {__(
                "Your LBRY credits are controllable by you and only you, via wallet file(s) stored locally on your computer."
              )}
            </p>
            <p>
              {__(
                "Currently, there is no automatic wallet backup. If you lose access to these files, you will lose your credits permanently."
              )}
            </p>
            <p>
              {__(
                "However, it is fairly easy to back up manually. To backup your wallet, make a copy of the folder listed below:"
              )}
            </p>
            <p>
              <code>
                {__(`${daemonSettings.lbryum_wallet_dir}`)}
              </code>
            </p>
            <p>
              <strong>
                {__(
                  "Access to these files are equivalent to having access to your credits. Keep any copies you make of your wallet in a secure place."
                )}
              </strong>
            </p>
            <p>
              For more details on backing up and best practices,{" "}
              <Link
                href="https://lbry.io/faq/how-to-backup-wallet"
                label={__("see this article")}
              />.
            </p>
          </div>
        </section>
      </main>
    );
  }
}

export default BackupPage;
