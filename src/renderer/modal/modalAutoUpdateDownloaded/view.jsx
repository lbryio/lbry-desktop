// @flow
import React from 'react';
import { ipcRenderer } from 'electron';
import { Modal } from 'modal/modal';
import Button from 'component/button';

type Props = {
  closeModal: any => any,
  declineAutoUpdate: () => any,
};

class ModalAutoUpdateDownloaded extends React.PureComponent<Props> {
  constructor(props: ModalProps) {
    super(props);

    this.state = {
      disabled: false,
    };
  }

  render() {
    const { closeModal, declineAutoUpdate } = this.props;

    return (
      <Modal
        isOpen
        type="confirm"
        contentLabel={__('Update Downloaded')}
        confirmButtonLabel={__('Use it Now')}
        abortButtonLabel={__('Upgrade on Close')}
        confirmButtonDisabled={this.state.disabled}
        onConfirmed={() => {
          this.setState({ disabled: true });
          ipcRenderer.send('autoUpdateAccepted');
        }}
        onAborted={() => {
          declineAutoUpdate();
          ipcRenderer.send('autoUpdateDeclined');
          closeModal();
        }}
      >
        <section>
          <h3 className="text-center">{__('LBRY Leveled Up')}</h3>
          <p>
            {__(
              'A new version of LBRY has been released, downloaded, and is ready for you to use pending a restart.'
            )}
          </p>
          <p className="meta text-center">
            {__('Want to know what has changed?')} See the{' '}
            <Button
              button="link"
              label={__('release notes')}
              href="https://github.com/lbryio/lbry-desktop/releases"
            />.
          </p>
        </section>
      </Modal>
    );
  }
}

export default ModalAutoUpdateDownloaded;
