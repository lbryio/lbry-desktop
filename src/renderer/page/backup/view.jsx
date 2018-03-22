// @flow
import * as React from 'react';
import Button from 'component/button';
import Page from 'component/page';

type Props = {
  daemonSettings: {
    lbryum_wallet_dir: ?string,
  },
};

class BackupPage extends React.PureComponent<Props> {
  render() {
    const { daemonSettings } = this.props;
    const { lbryum_wallet_dir } = daemonSettings;

    const noDaemonSettings = Object.keys(daemonSettings).length === 0;

    return (
      <Page>
        <section className="card card--section">
          {noDaemonSettings ? (
            <div className="card__title">{__('Failed to load settings.')}</div>
          ) : (
            <React.Fragment>
              <div className="card__title">{__('Backup Your LBRY Credits')}</div>
              <p className="card__subtitle">
                {__(
                  'Your LBRY credits are controllable by you and only you, via wallet file(s) stored locally on your computer.'
                )}
              </p>
              <div className="card__content">
                <p>
                  {__(
                    'Currently, there is no automatic wallet backup. If you lose access to these files, you will lose your credits permanently.'
                  )}
                </p>
              </div>
              <div className="card__content">
                <p>
                  {__(
                    'However, it is fairly easy to back up manually. To backup your wallet, make a copy of the folder listed below:'
                  )}
                </p>
                <div className="card__content">
                  <code>{lbryum_wallet_dir}</code>
                </div>
              </div>
              <div className="card__content">
                <p>
                  <strong>
                    {__(
                      'Access to these files are equivalent to having access to your credits. Keep any copies you make of your wallet in a secure place.'
                    )}
                  </strong>
                </p>
                <p>
                  For more details on backing up and best practices,{' '}
                  <Button
                    button="link"
                    href="https://lbry.io/faq/how-to-backup-wallet"
                    label={__('see this article')}
                  />.
                </p>
              </div>
            </React.Fragment>
          )}
        </section>
      </Page>
    );
  }
}

export default BackupPage;
