import React from 'react';
import { Modal } from 'modal/modal';
import { Line } from 'rc-progress';
import Button from 'component/button';

class ModalDownloading extends React.PureComponent {
  render() {
    const {
      downloadProgress,
      downloadComplete,
      downloadItem,
      startUpgrade,
      cancelUpgrade,
    } = this.props;

    return (
      <Modal isOpen contentLabel={__('Downloading Update')} type="custom">
        {__('Downloading Update')}
        {downloadProgress ? `: ${downloadProgress}%` : null}
        <Line percent={downloadProgress || 0} strokeWidth="4" />
        {downloadComplete ? (
          <div>
            <br />
            <p>{__('Click "Begin Upgrade" to start the upgrade process.')}</p>
            <p>
              {__(
                'The app will close, and you will be prompted to install the latest version of LBRY.'
              )}
            </p>
            <p>
              {__(
                'To launch installation manually, close LBRY and run the command below in the terminal.'
              )}
            </p>
            <blockquote>sudo dpkg -i {downloadItem}</blockquote>
            <p>{__('After the install is complete, please reopen the app.')}</p>
          </div>
        ) : null}
        <div className="modal__buttons">
          {downloadComplete ? (
            <Button
              button="primary"
              label={__('Begin Upgrade')}
              className="modal__button"
              onClick={startUpgrade}
            />
          ) : null}
          <Button
            button="link"
            label={__('Cancel')}
            className="modal__button"
            onClick={cancelUpgrade}
          />
        </div>
      </Modal>
    );
  }
}

export default ModalDownloading;
