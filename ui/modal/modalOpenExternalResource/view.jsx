// @flow
import React, { useCallback, useEffect } from 'react';
import { Modal } from 'modal/modal';
import { formatFileSystemPath } from 'util/url';
import { FormField } from 'component/common/form';
import usePersistedState from 'effects/use-persisted-state';
// @if TARGET='app'
import { shell } from 'electron';
// @endif

type Props = {
  uri: string,
  isTrusted: boolean,
  path: string,
  isMine: boolean,
  closeModal: () => void,
};

function ModalOpenExternalResource(props: Props) {
  const [stopWarning, setStopWarning] = usePersistedState('stop-warning', false);
  const { uri, isTrusted, path, isMine, closeModal } = props;

  const openResource = useCallback(() => {
    // @if TARGET='app'
    const { openExternal, openPath, showItemInFolder } = shell;
    if (uri) {
      openExternal(uri);
    } else if (path) {
      const success = openPath(path);
      if (!success) {
        showItemInFolder(path);
      }
    }
    // @endif
    // @if TARGET='web'
    if (uri) {
      window.open(uri);
    } else if (path) {
      window.open(formatFileSystemPath(path));
    }
    // @endif

    closeModal();
  }, [closeModal, path, uri]);

  useEffect(() => {
    if ((uri && isTrusted) || (path && isMine) || stopWarning) {
      openResource();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uri, isTrusted, path, isMine, openResource]);

  return (
    <Modal
      isOpen
      title={__('Warning!')}
      contentLabel={__('Confirm External Resource')}
      type="confirm"
      confirmButtonLabel={__('Continue')}
      onConfirmed={() => openResource()}
      onAborted={closeModal}
    >
      <p>
        {(uri && __('This link leads to an external website.')) ||
          (path && __('This file has been shared with you by other people.'))}
      </p>
      <blockquote>{uri || path}</blockquote>
      <p>{__('LBRY Inc is not responsible for its content, click continue to proceed at your own risk.')}</p>
      <div className="stop-warning">
        <FormField
          type="checkbox"
          checked={stopWarning}
          onChange={() => setStopWarning(!stopWarning)}
          label={__("Don't Show This Message Again")}
          name="stop_warning"
        />
      </div>
    </Modal>
  );
}

export default ModalOpenExternalResource;
