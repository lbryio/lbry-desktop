// @flow
import { Lbryio } from 'lbryinc';
import React from 'react';
import { Modal } from 'modal/modal';

type Props = {
  error: string | { message: string },
  closeModal: () => void,
};

class ModalError extends React.PureComponent<Props> {
  componentDidMount() {
    const { error } = this.props;

    // Yuck
    // https://github.com/lbryio/lbry-sdk/issues/1118
    // The sdk logs failed downloads, they happen so often that it's mostly noise in the desktop logs
    const errorMessage = typeof error === 'string' ? error : error.message;
    const skipLog =
      errorMessage.startsWith('Failed to download') ||
      errorMessage.endsWith('Uploading the same file from multiple tabs or windows is not allowed.');

    if (process.env.NODE_ENV === 'production' && !skipLog) {
      Lbryio.call('event', 'desktop_error', { error_message: JSON.stringify(error) });
    }
  }

  render() {
    const { closeModal, error } = this.props;

    const errorObj = typeof error === 'string' ? { message: error } : error;

    const errorKeyLabels = {
      connectionString: __('API connection string'),
      method: __('Method'),
      params: __('Parameters'),
      code: __('Error code'),
      message: __('Error message'),
      data: __('Error data'),
    };

    const errorInfoList = [];
    for (const key of Object.keys(errorObj)) {
      const val = typeof errorObj[key] === 'string' ? errorObj[key] : JSON.stringify(errorObj[key]);
      const label = errorKeyLabels[key];
      errorInfoList.push(
        <li key={key}>
          <strong>{label}</strong>: {val}
        </li>
      );
    }

    return (
      <Modal isOpen contentLabel={__('Error')} title={__('Error')} className="error-modal" onConfirmed={closeModal}>
        <p>
          {__(
            "We're sorry that Odysee has encountered an error. Please try again or reach out to hello@odysee.com with detailed information."
          )}
        </p>
        <ul className="error-modal__error-list ul--no-style">{errorInfoList}</ul>
      </Modal>
    );
  }
}

export default ModalError;
