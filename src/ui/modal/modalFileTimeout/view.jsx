// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import type { Metadata } from 'types/claim';

type Props = {
  metadata: Metadata,
  closeModal: () => void,
};

class ModalFileTimeout extends React.PureComponent<Props> {
  render() {
    const {
      metadata: { title },
      closeModal,
    } = this.props;

    return (
      <Modal
        isOpen
        title={__('Unable to Download')}
        contentLabel={__('Download failed')}
        onConfirmed={closeModal}
      >
        <section className="card__content">
          <p className="error-modal__error-list">
            {__('LBRY was unable to download the stream')}:
            <div>
              <b>{`"${title}"`}</b>
            </div>
          </p>
        </section>
      </Modal>
    );
  }
}

export default ModalFileTimeout;
