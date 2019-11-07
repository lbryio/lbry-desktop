// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';

type Props = {
  closeModal: () => void,
};

const ModalWelcome = (props: Props) => {
  const { closeModal } = props;

  return (
    <Modal type="custom" isOpen contentLabel="Welcome to LBRY" title={__('Welcome to LBRY')}>
      <p>
        {__('Using LBRY is like dating a centaur. Totally normal up top, and')} <em>{__('way different')}</em>{' '}
        {__('underneath.')}
      </p>
      <p>{__('Up top, LBRY is similar to popular media sites.')}</p>
      <p>{__('Below, LBRY is controlled by users -- you -- via blockchain and decentralization.')}</p>
      <div className="card__actions">
        <Button button="primary" onClick={closeModal} label={__("I'm In")} />
      </div>
    </Modal>
  );
};

export default ModalWelcome;
