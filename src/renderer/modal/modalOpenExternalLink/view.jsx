// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import { shell } from 'electron';

type Props = {
  uri: string,
  closeModal: () => void,
};

class ModalOpenExternalLink extends React.PureComponent<Props> {
  openExternalLink() {
    const { uri, closeModal } = this.props;
    const { openExternal } = shell;
    if (uri) {
      openExternal(uri);
    }
    closeModal();
  }

  render() {
    const { uri, closeModal } = this.props;
    return (
      <Modal
        isOpen
        contentLabel={__('Confirm External Link')}
        type="confirm"
        confirmButtonLabel={__('Continue')}
        onConfirmed={() => this.openExternalLink()}
        onAborted={closeModal}
      >
        <h1>Warning!</h1>
        <p>{__('This link leads to an external website.')}</p>
        <blockquote>{uri}</blockquote>
        <p>
          {__(
            'LBRY Inc is not responsible for its content, click continue to proceed at your own risk.'
          )}
        </p>
      </Modal>
    );
  }
}

export default ModalOpenExternalLink;
