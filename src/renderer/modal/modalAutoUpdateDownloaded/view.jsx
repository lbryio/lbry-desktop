// @flow
import React from 'react';
import { ipcRenderer } from 'electron';
import { Modal } from 'modal/modal';
import Button from 'component/button';

type Props = {
  closeModal: any => any,
  declineAutoUpdate: () => any,
};

type State = {
  disabled: boolean,
};

class ModalAutoUpdateDownloaded extends React.PureComponent<Props, State> {
  constructor(props: Props) {
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
        title={__('LBRY Leveled Up')}
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
        <section className="card__content">
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
