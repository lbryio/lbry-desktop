// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import { formatLbryUriForWeb } from 'util/uri';
// @if TARGET='app'
import { shell } from 'electron';
// @endif

type Props = {
  uri: string,
  path: string,
  closeModal: () => void,
};

class ModalOpenExternalResource extends React.PureComponent<Props> {
  openExternalResource() {
    const { uri, path, closeModal } = this.props;
    // @if TARGET='app'
    const { openExternal, openItem, showItemInFolder } = shell;
    if (uri) {
      openExternal(uri);
    } else if (path) {
      const success = openItem(path);
      if (!success) {
        showItemInFolder(path);
      }
    }
    // @endif
    // @if TARGET='web'
    if (uri) {
      window.open(uri);
    } else if (path) {
      // Converintg path into uri, like "file://path/to/file"
      let _uri = path.replace(/\\/g, '/');
      // Windows drive letter must be prefixed with a slash
      if (_uri[0] !== '/') {
        _uri = `/${_uri}`;
      }
      _uri = encodeURI(`file://${_uri}`).replace(/[?#]/g, encodeURIComponent);
      window.open(_uri);
    }
    // @endif

    closeModal();
  }

  render() {
    const { uri, path, closeModal } = this.props;
    return (
      <Modal
        isOpen
        title={__('Warning!')}
        contentLabel={__('Confirm External Resource')}
        type="confirm"
        confirmButtonLabel={__('Continue')}
        onConfirmed={() => this.openExternalResource()}
        onAborted={closeModal}
      >
        <section className="card__content">
          <p>
            {(uri && __('This link leads to an external website.')) ||
              (path && __('This file has been shared with you by other people.'))}
          </p>
          <blockquote>{uri || path}</blockquote>
          <p>{__('LBRY Inc is not responsible for its content, click continue to proceed at your own risk.')}</p>
        </section>
      </Modal>
    );
  }
}

export default ModalOpenExternalResource;
