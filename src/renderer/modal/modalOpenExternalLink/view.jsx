// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import { shell } from 'electron';

type Props = {
  url: string,
  closeModal: () => void,
};

class ModalOpenExternalLink extends React.PureComponent<Props> {
  openExternalLink() {
    const { url, closeModal } = this.props;
    const { openExternal } = shell;
    if (url) {
      openExternal(url);
    }
    closeModal();
  }

  render() {
    const { url, closeModal } = this.props;
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
        <blockquote>{url}</blockquote>
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
