import React from 'react'
import {
  Modal
} from 'component/modal'
import {Line} from 'rc-progress';
import Link from 'component/link'

class DownloadingModal extends React.Component {
  render() {
    const {
      downloadProgress,
      downloadComplete,
      startUpgrade,
      cancelUpgrade,
    } = this.props

    return (
      <Modal isOpen={true} contentLabel="Downloading Update" type="custom">
        Downloading Update{downloadProgress ? `: ${downloadProgress}%` : null}
        <Line percent={downloadProgress} strokeWidth="4"/>
        {downloadComplete ? (
           <div>
             <br />
             <p>Click "Begin Upgrade" to start the upgrade process.</p>
             <p>The app will close, and you will be prompted to install the latest version of LBRY.</p>
             <p>After the install is complete, please reopen the app.</p>
           </div>
         ) : null }
        <div className="modal__buttons">
          {downloadComplete
            ? <Link button="primary" label="Begin Upgrade" className="modal__button" onClick={startUpgrade} />
            : null}
          <Link button="alt" label="Cancel" className="modal__button" onClick={cancelUpgrade} />
        </div>
      </Modal>
    )
  }
}

export default DownloadingModal
