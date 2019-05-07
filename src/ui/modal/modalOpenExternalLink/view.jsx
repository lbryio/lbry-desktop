// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import { formatLbryUriForWeb } from 'util/uri';
// @if TARGET='app'
import { shell } from 'electron';
// @endif

type Props = {
  uri: string,
  closeModal: () => void,
};

class ModalOpenExternalLink extends React.PureComponent<Props> {
  openExternalLink() {
    const { uri, closeModal } = this.props;
    // @if TARGET='app'
    const { openExternal } = shell;
    if (uri) {
      openExternal(uri);
    }
    // @endif
    // @if TARGET='web'
    window.open(uri);
    // @endif

    closeModal();
  }

  render() {
    const { uri, closeModal } = this.props;
    return (
      <Modal
        isOpen
        title={__('Warning!')}
        contentLabel={__('Confirm External Link')}
        type="confirm"
        confirmButtonLabel={__('Continue')}
        onConfirmed={() => this.openExternalLink()}
        onAborted={closeModal}
      >
        <section className="card__content">
          <p>{__('This link leads to an external website.')}</p>
          <blockquote>{uri}</blockquote>
          <p>{__('LBRY Inc is not responsible for its content, click continue to proceed at your own risk.')}</p>
        </section>
      </Modal>
    );
  }
}

export default ModalOpenExternalLink;
