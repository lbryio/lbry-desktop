// @flow
import React from 'react';
// @if TARGET='app'
import { ipcRenderer } from 'electron';
// @endif
import { Modal } from 'modal/modal';
import Button from 'component/button';
import I18nMessage from 'component/i18nMessage';

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
        title={__('LBRY leveled up')}
        confirmButtonLabel={__('Upgrade Now')}
        abortButtonLabel={__('Not now')}
        confirmButtonDisabled={this.state.disabled}
        onConfirmed={() => {
          this.setState({ disabled: true });
          ipcRenderer.send('autoUpdateAccepted');
        }}
        onAborted={() => {
          declineAutoUpdate();
          closeModal();
        }}
      >
        <p>{__('A new version of LBRY is ready for you.')}</p>
        <p className="help">
          <I18nMessage
            tokens={{
              release_notes: (
                <Button
                  button="link"
                  label={__('release notes')}
                  href="https://github.com/lbryio/lbry-desktop/releases"
                />
              ),
            }}
          >
            Want to know what has changed? See the %release_notes%.
          </I18nMessage>
        </p>
      </Modal>
    );
  }
}

export default ModalAutoUpdateDownloaded;
