import {Lbryio} from 'lbryinc';
import React from 'react';
import { Modal } from 'modal/modal';

type Props = {
  error: string | {
    message: string
  },
  closeModal: () => void
};

class ModalError extends React.PureComponent<Props> {
  componentDidMount() {
    const { error } = this.props;

    // Yuck
    // https://github.com/lbryio/lbry-sdk/issues/1118
    // The sdk logs failed downloads, they happen so often that it's mostly noise in the desktop logs
    const errorMessage = typeof error === 'string' ? error : error.message;
    const failedToDownloadError = errorMessage.startsWith('Failed to download');

    if (process.env.NODE_ENV === 'production' && !failedToDownloadError) {
      // @ts-expect-error - TS2339 (ts-migration)
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
    } as const;

    const errorInfoList: unknown = [];
    for (const key of Object.keys(errorObj)) {
      const val = typeof errorObj[key] === 'string' ? errorObj[key] : JSON.stringify(errorObj[key]);
      const label = errorKeyLabels[key];
// @ts-expect-error - TS2339 - Property 'push' does not exist on type 'unknown'.
      errorInfoList.push(
        <li key={key}>
          <strong>{label}</strong>: {val}
        </li>
      );
    }

    return (
// @ts-expect-error - TS2322 - Type '{ children: Element[]; isOpen: true; contentLabel: string; title: string; className: string; onConfirmed: () => void; }' is not assignable to type 'IntrinsicAttributes & ModalProps'.
      <Modal isOpen contentLabel={__('Error')} title={__('Error')} className="error-modal" onConfirmed={closeModal}>
        <p>
          {__(
            "We're sorry that LBRY has encountered an error. This has been reported and we will investigate the problem."
          )}
        </p>
        <ul className="error-modal__error-list ul--no-style">{errorInfoList}</ul>
      </Modal>
    );
  }
}

export default ModalError;
