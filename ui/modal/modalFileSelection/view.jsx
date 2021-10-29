// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import { Modal } from 'modal/modal';
import { withRouter } from 'react-router';
import Card from 'component/common/card';
import Button from 'component/button';
import FileList from 'component/common/file-list';

type Props = {
  files: Array<WebFile>,
  hideModal: () => void,
  updatePublishForm: ({}) => void,
  history: {
    location: { pathname: string },
    push: string => void,
  },
};

const PUBLISH_URL = `/$/${PAGES.UPLOAD}`;

const ModalFileSelection = (props: Props) => {
  const { history, files, hideModal, updatePublishForm } = props;
  const [selectedFile, setSelectedFile] = React.useState(null);

  const navigateToPublish = React.useCallback(() => {
    // Navigate only if location is not publish area:
    // - Prevent spam in history
    if (history.location.pathname !== PUBLISH_URL) {
      history.push(PUBLISH_URL);
    }
  }, [history]);

  function handleCloseModal() {
    hideModal();
    setSelectedFile(null);
  }

  function handleSubmit() {
    updatePublishForm({ filePath: selectedFile });
    handleCloseModal();
    navigateToPublish();
  }

  const handleFileChange = (file?: WebFile) => {
    // $FlowFixMe
    setSelectedFile(file);
  };

  return (
    <Modal isOpen type="card" onAborted={handleCloseModal} onConfirmed={handleCloseModal}>
      <Card
        icon={ICONS.PUBLISH}
        title={__('Choose a file')}
        subtitle={__('Only one file is allowed, choose wisely:')}
        actions={
          <div>
            <div>
              <FileList files={files} onChange={handleFileChange} />
            </div>
            <div className="section__actions">
              <Button
                disabled={!selectedFile || !files || !files.length}
                button="primary"
                label={__('Accept')}
                onClick={handleSubmit}
              />
              <Button button="link" label={__('Cancel')} onClick={handleCloseModal} />
            </div>
          </div>
        }
      />
    </Modal>
  );
};

export default withRouter(ModalFileSelection);
