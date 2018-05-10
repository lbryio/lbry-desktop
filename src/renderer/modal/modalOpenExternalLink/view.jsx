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
    const { url } = this.props;
    const { openExternal } = shell;
    openExternal(url);
  }

  render() {
    const { url, closeModal } = this.props;
    return (
      <Modal
        isOpen
        contentLabel={__('Confirm External Link')}
        type="confirm"
        confirmButtonLabel={__('Continue')}
        onConfirmed={() => this.openExternalLink(url)}
        onAborted={closeModal}
      >
        <p>
          {__('This link leads to an external website:')}
          <cite>{url}</cite>
          {__('LBRY Inc is not responsible for its content, click OK to proceed at your own risk.')}
        </p>
      </Modal>
    );
  }
}

export default ModalOpenExternalLink;
