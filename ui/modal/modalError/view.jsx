// @flow
import { Lbryio } from 'lbryinc';
import React from 'react';
import { Modal } from 'modal/modal';

// Note: It accepts an object for 'error', but never pass Error itself as Error
// cannot be stringified (unless the code below is updated to handle that).

type Props = {
  error: string | { message: string, cause?: any },
  closeModal: () => void,
};

class ModalError extends React.PureComponent<Props> {
  componentDidMount() {
    const { error } = this.props;

    // Yuck
    // https://github.com/lbryio/lbry-sdk/issues/1118
    // The sdk logs failed downloads, they happen so often that it's mostly noise in the desktop logs
    // The thumbnail error shouldn't be routed here, but it's troublesome to create a different path.
    let errorMessage = typeof error === 'string' ? error : error.message;
    const skipLog =
      errorMessage.startsWith('Failed to download') ||
      /^Thumbnail size over (.*)MB, please edit and reupload.$/.test(errorMessage);

    if (error.cause) {
      try {
        errorMessage += ' => ' + (JSON.stringify(error.cause, null, '\t') || '');
      } catch (e) {
        console.error(e); // eslint-disable-line no-console
      }
    }

    if (process.env.NODE_ENV === 'production' && !skipLog) {
      Lbryio.call('event', 'desktop_error', { error_message: errorMessage });
    }
  }

  render() {
    const { closeModal, error } = this.props;

    const errorObj = typeof error === 'string' ? { message: error, cause: undefined } : error;

    const errorKeyLabels = {
      connectionString: __('API connection string'),
      method: __('Method'),
      params: __('Parameters'),
      code: __('Error code'),
      message: __('Error message'),
      data: __('Error data'),
      cause: 'skip',
    };

    const errorInfoList = [];
    for (const key of Object.keys(errorObj)) {
      const label = errorKeyLabels[key];
      if (label !== 'skip') {
        const val = typeof errorObj[key] === 'string' ? errorObj[key] : JSON.stringify(errorObj[key]);
        errorInfoList.push(
          <li key={key}>
            <strong>{label}</strong>: {val}
          </li>
        );
      }
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
