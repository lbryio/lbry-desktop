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
      <div className="section__subtitle">
        <p>{__('You just subscribed to your first channel. Awesome!')}</p>
        <p>{__('A few quick things to know:')}</p>
      </div>
      <ol className="section">
        <li>
          {__(
            'This app will automatically download new free content from channels you are subscribed to. You may configure this in Settings or on the Subscriptions page.'
          )}
          {__('(Only available on the desktop app.)')}
        </li>
        <li>
          {__(
            'If we have your email address, we will send you notifications related to new content. You may configure these emails from the Help page.'
          )}
        </li>
      </ol>
      <div className="section__actions">
        <Button button="primary" onClick={closeModal} label={__('Got it')} />
      </div>
    </Modal>
  );
};

export default ModalFirstSubscription;
