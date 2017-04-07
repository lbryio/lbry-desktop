import React from 'react'
import lbry from 'lbry'
import {
  ExpandableModal
} from 'component/modal'

class ErrorModal extends React.Component {
  render() {
    const {
      modal,
      closeModal,
      error,
    } = this.props

    const _error_key_labels = {
      connectionString: 'API connection string',
      method: 'Method',
      params: 'Parameters',
      code: 'Error code',
      message: 'Error message',
      data: 'Error data',
    }
    const errorInfo = <ul className="error-modal__error-list"></ul>
    const errorInfoList = []
    for (let key of Object.keys(error)) {
      let val = typeof error[key] == 'string' ? error[key] : JSON.stringify(error[key]);
      let label = this._error_key_labels[key];
      errorInfoList.push(<li key={key}><strong>{label}</strong>: <code>{val}</code></li>);
    }

    return(
      <ExpandableModal
        isOpen={modal == 'error'}
        contentLabel="Error" className="error-modal"
        overlayClassName="error-modal-overlay"
        onConfirmed={closeModal}
        extraContent={errorInfo}
      >
        <h3 className="modal__header">Error</h3>

        <div className="error-modal__content">
          <div><img className="error-modal__warning-symbol" src={lbry.imagePath('warning.png')} /></div>
          <p>We're sorry that LBRY has encountered an error. This has been reported and we will investigate the problem.</p>
        </div>
      </ExpandableModal>
    )
  }
}

export default ErrorModal
