// @flow
import React from 'react';
// @if TARGET='app'
import { ipcRenderer } from 'electron';
// @endif
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
        contentLabel={__('Upgrade Downloaded')}
        title={__('LBRY Leveled Up')}
        confirmButtonLabel={__('Use Now')}
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
        <p>{__('A new version of LBRY is ready for you.')}</p>
        <p className="help">
          {__('Want to know what has changed?')} See the{' '}
          <Button button="link" label={__('release notes')} href="https://github.com/lbryio/lbry-desktop/releases" />.
        </p>
      </Modal>
    );
  }
}

export default ModalAutoUpdateDownloaded;
