import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';

const ModalFirstSubscription = props => {
  const { closeModal, navigate } = props;

  return (
    <Modal type="custom" isOpen contentLabel="Subscriptions 101">
      <section>
        <h3 className="modal__header">{__('Subscriptions 101')}</h3>
        <p>{__('You just subscribed to your first channel. Awesome!')}</p>
        <p>{__('A few quick things to know:')}</p>
        <p className="card__content">
          {__('1) You can use the')}{' '}
          <Button
            button="link"
            label={__('Subscriptions Page')}
            onClick={() => {
              navigate('/subscriptions');
              closeModal();
            }}
          />{' '}
          {__('to view content across all of your subscribed channels.')}
        </p>
        <p className="card__content">
          {__(
            '2) This app will automatically download new free content from channels you are subscribed to.'
          )}
        </p>
        <p className="card__content">
          {__(
            '3) If we have your email address, we may send you notifications and rewards related to new content.'
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
