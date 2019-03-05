// @flow
import React from 'react';
import { ExpandableModal } from 'modal/modal';

type Props = {
  error: string | { message: string },
  closeModal: () => void,
};

class ModalError extends React.PureComponent<Props> {
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

    const errorInfo = <ul className="error-modal__error-list">{errorInfoList}</ul>;

    return (
      <ExpandableModal
        isOpen
        contentLabel={__('Error')}
        title={__('Error')}
        className="error-modal"
        onConfirmed={closeModal}
        extraContent={errorInfo}
      >
        <section className="card__content">
          <p>
            {__(
              "We're sorry that LBRY has encountered an error. This has been reported and we will investigate the problem."
            )}
          </p>
        </section>
      </ExpandableModal>
    );
  }
}

export default ModalError;
