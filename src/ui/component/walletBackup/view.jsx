// @flow
import * as React from 'react';
import Button from 'component/button';

type Props = {
  daemonSettings: {
    wallet_dir: ?string,
  },
};

class WalletBackup extends React.PureComponent<Props> {
  render() {
    const { daemonSettings } = this.props;
    const { wallet_dir: lbryumWalletDir } = daemonSettings;

    const noDaemonSettings = Object.keys(daemonSettings).length === 0;

    return (
      <section className="card card--section">
        {noDaemonSettings ? (
          <header className="card__header">
            <h2 className="card__title">{__('Failed to load settings.')}</h2>
          </header>
        ) : (
          <React.Fragment>
            <header className="card__header">
              <h2 className="card__title">{__('Backup Your LBRY Credits')}</h2>

              <p className="card__subtitle">
                {__(
                  'Your LBRY credits are controllable by you and only you, via wallet file(s) stored locally on your computer.'
                )}
              </p>
            </header>

            <div className="card__content">
              <p>
                {__(
                  'Currently, there is no automatic wallet backup. If you lose access to these files, you will lose your credits permanently.'
                )}
              </p>
              <p>
                {__(
                  'However, it is fairly easy to back up manually. To backup your wallet, make a copy of the folder listed below:'
                )}
              </p>
              <p className="card__message">{lbryumWalletDir}</p>
              <p>
                {__(
                  'Access to these files are equivalent to having access to your credits. Keep any copies you make of your wallet in a secure place.'
                )}
              </p>
              <p>
                For more details on backing up and best practices,{' '}
                <Button button="link" href="https://lbry.com/faq/how-to-backup-wallet" label={__('see this article')} />
                .
              </p>
            </div>
          </React.Fragment>
        )}
      </section>
    );
  }
}

export default WalletBackup;
