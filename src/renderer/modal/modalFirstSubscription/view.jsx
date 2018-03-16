import React from 'react';
import { Modal } from 'modal/modal';
import Link from 'component/link/index';

const ModalFirstSubscription = props => {
  const { closeModal } = props;

  return (
    <Modal type="custom" isOpen contentLabel="Your first subscription!">
      <section>
        <h3 className="modal__header">{__('Your first subscription!')}</h3>
        <p>
          {__(
            'When you subscribe to a channel, you will automatically download, and be notified of, all of its new content.'
          )}
        </p>
        <div className="modal__buttons">
          <Link button="primary" onClick={closeModal} label={__('Got it')} />
        </div>
      </section>
    </Modal>
  );
};

export default ModalFirstSubscription;
