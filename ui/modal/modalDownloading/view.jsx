// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import { Line } from 'rc-progress';
import Button from 'component/button';

type Props = {
  downloadProgress: ?number,
  downloadComplete: boolean,
  downloadItem: string,
  startUpgrade: () => void,
  cancelUpgrade: () => void,
};

class ModalDownloading extends React.PureComponent<Props> {
  render() {
    const { downloadProgress, downloadComplete, downloadItem, startUpgrade, cancelUpgrade } = this.props;

    return (
      <Modal title={__('Downloading update')} isOpen contentLabel={__('Downloading update')} type="custom">
        {downloadProgress ? `${downloadProgress}% ${__('complete')}` : null}
        <Line percent={downloadProgress || 0} strokeWidth="4" />
        {downloadComplete ? (
          <React.Fragment>
            <p>{__('Click "Begin Upgrade" to start the upgrade process.')}</p>
            <p>
              {__(
                'The app will close (if not, quit with CTRL-Q), and you will be prompted to install the latest version of LBRY.'
              )}
            </p>
            <p>
              {__('To launch installation manually, close LBRY (CTRL-Q) and run the command below in the terminal.')}
            </p>
            <blockquote>sudo dpkg -i {downloadItem}</blockquote>
            <p>{__('After the install is complete, please reopen the app.')}</p>
            <p>
              {__('Note: You can also install the AppImage version for streamlined updates.')}{' '}
              <Button button="link" label={__('Download here.')} href="https://lbry.com/get/lbry.AppImage" />
            </p>
          </React.Fragment>
        ) : null}

        <div className="card__actions">
          {downloadComplete ? <Button button="primary" label={__('Begin Upgrade')} onClick={startUpgrade} /> : null}
          <Button button="link" label={__('Cancel')} onClick={cancelUpgrade} />
        </div>
      </Modal>
    );
  }
}

export default ModalDownloading;
