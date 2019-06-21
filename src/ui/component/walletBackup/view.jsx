// @flow
import * as React from 'react';
import { shell, clipboard, remote } from 'electron';
import Button from 'component/button';
import AdmZip from 'adm-zip';
import path from 'path';

type Props = {
  daemonSettings: {
    wallet_dir: ?string,
  },
};

type State = {
  errorMessage: ?string,
  successMessage: ?string,
};

class WalletBackup extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      errorMessage: null,
      successMessage: null,
    };
  }

  showErrorMessage(message: string) {
    this.setState({ errorMessage: message });
  }

  showSuccessMessage(message: string) {
    this.setState({ successMessage: message });
  }

  flashSuccessMessage(message: string, delay: ?number) {
    delay = delay || 2000;
    this.showSuccessMessage(message);
    setTimeout(() => this.setState({ successMessage: null }), delay, { once: true });
  }

  clearMessages() {
    this.setState({ errorMessage: null, successMessage: null });
  }

  backupWalletDir(lbryumWalletDir: ?string) {
    this.clearMessages();

    if (!lbryumWalletDir) {
      this.showErrorMessage(__('No wallet folder was found.'));
      return;
    }

    // Colon fails on Windows. Backups should be portable, so replace it on other platforms, too.
    const filenameTime = new Date().toISOString().replace(/:/g, '-');

    const outputFilename = [path.basename(lbryumWalletDir), '-', filenameTime, '.zip'].join('');

    // Prefer placing backup in user's Downloads folder, then their home folder, and finally
    // right next to the lbryum folder itself.
    let outputDir = path.dirname(lbryumWalletDir);
    if (remote && remote.app) {
      outputDir = remote.app.getPath('downloads') || remote.app.getPath('home') || outputDir;
    }

    const outputPath = path.join(outputDir, outputFilename);

    const zip = new AdmZip();

    try {
      zip.addLocalFolder(lbryumWalletDir);
    } catch (err) {
      console.error(err);
      this.showErrorMessage(__('The wallet folder could not be added to the zip archive.'));
      return;
    }

    try {
      zip.writeZip(outputPath);
    } catch (err) {
      console.error(err);
      this.showErrorMessage(__('There was a problem writing the zip archive to disk.'));
      return;
    }

    this.showSuccessMessage(__('Saved zip archive to ' + outputPath));

    shell.showItemInFolder(outputPath);
  }

  copyWalletDirToClipboard(lbryumWalletDir: ?string) {
    this.clearMessages();

    if (lbryumWalletDir) {
      clipboard.writeText(lbryumWalletDir);
      this.flashSuccessMessage(__('Copied path to clipboard.'));
    } else {
      this.showErrorMessage(__('No wallet folder was found.'));
    }
  }

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
              <p className={'card__message card__message--error' + (this.state.errorMessage ? '' : ' hidden')}>
                {this.state.errorMessage}
              </p>
              <p className={'card__message card__message--success' + (this.state.successMessage ? '' : ' hidden')}>
                {this.state.successMessage}
              </p>
              <div className="card__actions">
                <Button
                  button="primary"
                  label={__('Copy Folder Path')}
                  onClick={() => this.copyWalletDirToClipboard(lbryumWalletDir)}
                />
                <Button button="primary" label={__('Open Folder')} onClick={() => shell.openItem(lbryumWalletDir)} />
                <Button
                  button="primary"
                  label={__('Create Backup')}
                  onClick={() => this.backupWalletDir(lbryumWalletDir)}
                />
              </div>
            </div>
          </React.Fragment>
        )}
      </section>
    );
  }
}

export default WalletBackup;
