// @flow
import React from 'react';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import * as MODALS from 'constants/modal_types';
import classnames from 'classnames';
import useDragDrop from 'effects/use-drag-drop';
import { getTree } from 'util/web-file-system';
import { withRouter } from 'react-router';
import Icon from 'component/common/icon';
import FileList from 'component/common/file-list';

type Props = {
  modal: { id: string, modalProps: {} },
  filePath: string | WebFile,
  clearPublish: () => void,
  updatePublishForm: ({}) => void,
  openModal: (id: string, { files: Array<WebFile> }) => void,
  // React router
  history: {
    entities: {}[],
    goBack: () => void,
    goForward: () => void,
    index: number,
    length: number,
    location: { pathname: string },
    push: string => void,
  },
};

const HIDE_TIME_OUT = 600;
const NAVIGATE_TIME_OUT = 300;
const PUBLISH_URL = `/$/${PAGES.PUBLISH}`;

function FileDrop(props: Props) {
  const { modal, history, openModal, updatePublishForm } = props;
  const { drag, dropData } = useDragDrop();
  const [files, setFiles] = React.useState([]);
  const [error, setError] = React.useState(false);

  const navigateToPublish = React.useCallback(() => {
    // Navigate only if location is not publish area:
    // - Prevent spam in history
    if (history.location.pathname !== PUBLISH_URL) {
      history.push(PUBLISH_URL);
    }
  }, [history]);

  // Delay hide and navigation for a smooth transition
  const hideDropArea = () => {
    setTimeout(() => {
      setFiles([]);
      setTimeout(() => navigateToPublish(), NAVIGATE_TIME_OUT);
    }, HIDE_TIME_OUT);
  };

  const handleFileSelected = selectedFile => {
    updatePublishForm({ filePath: selectedFile });
    hideDropArea();
  };

  // Firt file will be selected by default:
  const handleFileChange = (file?: WebFile) => {
    if (files && files.length && file) {
      handleFileSelected(file);
    }
  };

  React.useEffect(() => {
    // Handle drop...
    if (dropData && !files.length && (!modal || modal.id !== MODALS.FILE_SELECTION)) {
      getTree(dropData)
        .then(entries => {
          if (entries && entries.length) {
            setFiles(entries);
          }
        })
        .catch(error => {
          setError(error || true);
        });
    }
  }, [dropData, files, modal]);

  React.useEffect(() => {
    // Files or directory dropped:
    if (!drag && files.length) {
      // Handle multiple files selection
      if (files.length > 1) {
        openModal(MODALS.FILE_SELECTION, { files: files });
        setFiles([]);
      }
    }
  }, [drag, files, error]);

  const show = files.length === 1 || (drag && (!modal || modal.id !== MODALS.FILE_SELECTION));

  return (
    <div className={classnames('file-drop', show && 'file-drop--show')}>
      <div className={classnames('card', 'file-drop__area')}>
        <Icon size={64} icon={ICONS.PUBLISH} className={'main-icon'} />
        <p>{`Drop here to publish!`} </p>
        {files && files.length === 1 && <FileList files={files} onChange={handleFileChange} />}
      </div>
    </div>
  );
}

export default withRouter(FileDrop);
