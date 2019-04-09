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
    if (process.env.NODE_ENV === 'production') {
      Lbryio.call('event', 'desktop_error', { error_message: JSON.stringify(this.props.error) });
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
      <Modal
        isOpen
        contentLabel={__('Error')}
        title={__('Error')}
        className="error-modal"
        onConfirmed={closeModal}
      >
        <section className="card__content">
          <p>
            {__(
              "We're sorry that LBRY has encountered an error. This has been reported and we will investigate the problem."
            )}
          </p>
        </section>
        <ul className="card__content error-modal__error-list">{errorInfoList}</ul>
      </Modal>
    );
  }
}

export default ModalError;
