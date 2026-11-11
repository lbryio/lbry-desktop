import * as React from 'react';
// @ts-expect-error - TS2792 - Cannot find module 'electron'. Did you mean to set the 'moduleResolution' option to 'node', or to add aliases to the 'paths' option?
import { ipcRenderer, shell } from 'electron';
import Button from 'component/button';
import CopyableText from 'component/copyableText';
import AdmZip from 'adm-zip';
import path from 'path';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';

type Props = {
  daemonSettings: {
    wallet_dir: string | null | undefined
  }
};

type State = {
  errorMessage: string | null | undefined,
  successMessage: string | null | undefined
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

  clearMessages() {
    this.setState({ errorMessage: null, successMessage: null });
  }

  backupWalletDir(lbryumWalletDir?: string | null) {
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
    const downloadsDir = ipcRenderer.sendSync('app:getPath', 'downloads');
    const homeDir = ipcRenderer.sendSync('app:getPath', 'home');
    outputDir = downloadsDir || homeDir || outputDir;

    const outputPath = path.join(outputDir, outputFilename);

    const zip = new AdmZip();

    try {
      zip.addLocalFolder(lbryumWalletDir);
    } catch (err: any) {
      console.error(err); // eslint-disable-line no-console
      this.showErrorMessage(__('The wallet folder could not be added to the zip archive.'));
      return;
    }

    try {
      zip.writeZip(outputPath);
    } catch (err: any) {
      console.error(err); // eslint-disable-line no-console
      this.showErrorMessage(__('There was a problem writing the zip archive to disk.'));
      return;
    }

    this.showSuccessMessage(__('Saved zip archive to %outputPath%', { outputPath }));

    shell.showItemInFolder(outputPath);
  }

  render() {
    const { daemonSettings = {} } = this.props;
// @ts-expect-error - TS2339 - Property 'wallet_dir' does not exist on type '{}'.
    const { wallet_dir: lbryumWalletDir } = daemonSettings;

    return (
      <Card
        title={__('Backup your LBRY wallet')}
        subtitle={
          <ul>
            <li>
              {__(
                'Your LBRY Credits, channels, and publishes are controllable by you and only you, via wallet file(s) stored locally on your computer.'
              )}
            </li>
            <li>
              {__(
                'If Sync is on, LBRY will backup your wallet and preferences. If disabled, you are responsible for keeping a backup.'
              )}
            </li>
            <li>
              {__(
                'However, it is easy to back up manually. To backup your wallet, make a copy of the folder listed below:'
              )}
            </li>
          </ul>
        }
        actions={
          <React.Fragment>
            <CopyableText copyable={lbryumWalletDir} snackMessage={__('Path copied.')} />
            <p className="help">
              {/* @ts-expect-error - TS2745 (ts-migration) */}
              <I18nMessage
                // @ts-expect-error - TS2322 (ts-migration)
                tokens={{
                  helpLink: (
                    <Button
                      // @ts-expect-error - TS2322 (ts-migration)
                      button="link"
                      href="https://lbry.com/faq/how-to-backup-wallet"
                      label={__('see this article')}
                    />
                  ),
                }}
              >
                Access to these files are equivalent to having access to your Credits, channels, and publishes. Keep any
                copies you make of your wallet in a secure place. For more details on backing up and best practices
                %helpLink%.
              </I18nMessage>
            </p>
            <p className={'card__message card__message--error' + (this.state.errorMessage ? '' : ' hidden')}>
              {this.state.errorMessage}
            </p>
            <p className={'card__message card__message--success' + (this.state.successMessage ? '' : ' hidden')}>
              {this.state.successMessage}
            </p>
            <div className="card__actions">
              <Button
                // @ts-expect-error - TS2322 (ts-migration)
                button="primary"
                label={__('Create Backup')}
                onClick={() => this.backupWalletDir(lbryumWalletDir)}
              />
              {/* @ts-expect-error - TS2322 (ts-migration) */}
              <Button button="link" label={__('Open Folder')} onClick={() => shell.openPath(lbryumWalletDir)} />
            </div>
          </React.Fragment>
        }
      />
    );
  }
}

export default WalletBackup;
