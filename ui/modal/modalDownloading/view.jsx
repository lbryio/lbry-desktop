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
      <Modal title={__('Downloading Update')} isOpen contentLabel={__('Downloading Update')} type="custom">
        {downloadProgress ? `${downloadProgress}% ${__('complete')}` : null}
        <Line percent={downloadProgress || 0} strokeWidth="4" />
        {downloadComplete ? (
          <React.Fragment>
            <p>{__('Click "Begin Upgrade" to start the upgrade process.')}</p>
            <p>{__('The app will close, and you will be prompted to install the latest version of LBRY.')}</p>
            <p>{__('To launch installation manually, close LBRY and run the command below in the terminal.')}</p>
            <blockquote>sudo dpkg -i {downloadItem}</blockquote>
            <p>{__('After the install is complete, please reopen the app.')}</p>
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
