// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Card from 'component/common/card';
import Button from 'component/button';

type Props = {
  doHideModal: () => void,
  doSignOut: () => void,
};

function ModalRepost(props: Props) {
  const { doHideModal, doSignOut } = props;

  return (
    <Modal isOpen type="card">
      <Card
        title={__('Sign Out')}
        subtitle={__(
          'Are you sure you want to sign out? Your wallet data will be merged with another account if they sign in on this device.'
        )}
        actions={
          <div className="section__actions">
            <Button button="primary" label={__('Sign Out')} onClick={doSignOut} />
            <Button button="link" label={__('Cancel')} onClick={doHideModal} />
          </div>
        }
      />
    </Modal>
  );
}

export default ModalRepost;
