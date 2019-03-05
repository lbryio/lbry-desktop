// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Button from 'component/button';
import { ipcRenderer } from 'electron';

type Props = {
  closeModal: () => void,
  declineAutoUpdate: () => void,
};

class ModalAutoUpdateConfirm extends React.PureComponent<Props> {
  render() {
    const { closeModal, declineAutoUpdate } = this.props;

    return (
      <Modal
        isOpen
        type="confirm"
        contentLabel={__('Update Downloaded')}
        title={__('LBRY Update Ready')}
        confirmButtonLabel={__('Upgrade')}
        abortButtonLabel={__('Not now')}
        onConfirmed={() => {
          ipcRenderer.send('autoUpdateAccepted');
        }}
        onAborted={() => {
          declineAutoUpdate();
          closeModal();
        }}
      >
        <section className="card__content">
          <p>{__('Your LBRY update is ready. Restart LBRY now to use it!')}</p>
          <p className="help">
            {__('Want to know what has changed?')} See the{' '}
            <Button
              button="link"
              label={__('release notes')}
              href="https://github.com/lbryio/lbry-desktop/releases"
            />
            .
          </p>
        </section>
      </Modal>
    );
  }
}

export default ModalAutoUpdateConfirm;
