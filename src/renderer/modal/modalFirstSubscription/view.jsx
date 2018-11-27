// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';

type Props = {
  closeModal: () => void,
};

const ModalFirstSubscription = (props: Props) => {
  const { closeModal } = props;

  return (
    <Modal type="custom" isOpen contentLabel="Subscriptions 101" title={__('Subscriptions 101')}>
      <section className="card__content">
        <p>{__('You just subscribed to your first channel. Awesome!')}</p>
        <p>{__('A few quick things to know:')}</p>
        <p className="card__content">
          {__(
            '1) This app will automatically download new free content from channels you are subscribed to.'
          )}
        </p>
        <p className="card__content">
          {__(
            '2) If we have your email address, we may send you notifications and rewards related to new content.'
          )}
        </p>
        <div className="modal__buttons">
          <Button button="primary" onClick={closeModal} label={__('Got it')} />
        </div>
      </section>
    </Modal>
  );
};

export default ModalFirstSubscription;
