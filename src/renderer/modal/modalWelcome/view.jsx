import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';

const ModalWelcome = props => {
  const { closeModal } = props;

  return (
    <Modal type="custom" isOpen contentLabel="Welcome to LBRY">
      <section>
        <h3 className="modal__header">{__('Welcome to LBRY')}</h3>
        <p>
          {__('Using LBRY is like dating a centaur. Totally normal up top, and')}{' '}
          <em>{__('way different')}</em> {__('underneath.')}
        </p>
        <p>{__('Up top, LBRY is similar to popular media sites.')}</p>
        <p>
          {__('Below, LBRY is controlled by users -- you -- via blockchain and decentralization.')}
        </p>
        <div className="modal__buttons">
          <Button button="primary" onClick={closeModal} label={__("Blockchain Centaurs? I'm In")} />
        </div>
      </section>
    </Modal>
  );
};

export default ModalWelcome;
