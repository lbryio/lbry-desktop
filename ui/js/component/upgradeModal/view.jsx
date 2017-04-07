import React from 'react'
import {
  Modal
} from 'component/modal'
import {
  downloadUpgrade,
  skipUpgrade
} from 'actions/app'

class UpgradeModal extends React.Component {
  render() {
    const {
      downloadUpgrade,
      skipUpgrade
    } = this.props

    return (
      <Modal
        isOpen={true}
        contentLabel="Update available"
        type="confirm"
        confirmButtonLabel="Upgrade"
        abortButtonLabel="Skip"
        onConfirmed={downloadUpgrade}
        onAborted={skipUpgrade}>
        Your version of LBRY is out of date and may be unreliable or insecure.
      </Modal>
    )
  }
}

export default UpgradeModal
