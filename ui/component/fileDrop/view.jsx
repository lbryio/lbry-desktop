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
const CLEAR_TIME_OUT = 300;
const NAVIGATE_TIME_OUT = 400;
const PUBLISH_URL = `/$/${PAGES.PUBLISH}`;

function FileDrop(props: Props) {
  const { modal, history, openModal, updatePublishForm } = props;
  const { drag, dropData } = useDragDrop();
  const [files, setFiles] = React.useState([]);
  const [error, setError] = React.useState(false);
  const [target, updateTarget] = React.useState(false);
  const hideTimer = React.useRef(null);
  const clearDataTimer = React.useRef(null);
  const navigationTimer = React.useRef(null);

  const navigateToPublish = React.useCallback(() => {
    // Navigate only if location is not publish area:
    // - Prevent spam in history
    if (history.location.pathname !== PUBLISH_URL) {
      history.push(PUBLISH_URL);
    }
  }, [history]);

  // Delay hide and navigation for a smooth transition
  const hideDropArea = () => {
    hideTimer.current = setTimeout(() => {
      setFiles([]);
      // Navigate to publish area
      navigationTimer.current = setTimeout(() => {
        navigateToPublish();
      }, NAVIGATE_TIME_OUT);
    }, HIDE_TIME_OUT);
  };

  const handleFileSelected = selectedFile => {
    updatePublishForm({ filePath: selectedFile });
    hideDropArea();
  };

  const getFileIcon = type => {
    // Not all files have a type
    if (!type) {
      return ICONS.FILE;
    }
    // Detect common types
    const contentType = type.split('/')[0];
    if (contentType === 'text') {
      return ICONS.TEXT;
    } else if (contentType === 'image') {
      return ICONS.IMAGE;
    } else if (contentType === 'video') {
      return ICONS.VIDEO;
    } else if (contentType === 'audio') {
      return ICONS.AUDIO;
    }
    // Binary file
    return ICONS.FILE;
  };

  // Clear timers
  React.useEffect(() => {
    return () => {
      // Clear hide timer
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
      // Clear navigation timer
      if (navigationTimer.current) {
        clearTimeout(navigationTimer.current);
      }
      // Clear clearData timer
      if (navigationTimer.current) {
        clearTimeout(clearDataTimer.current);
      }
    };
  }, []);

  React.useEffect(() => {
    // Clear selected file after modal closed
    if ((target && !files) || !files.length) {
      clearDataTimer.current = setTimeout(() => updateTarget(null), CLEAR_TIME_OUT);
    }
  }, [files, target]);

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
      } else if (files.length === 1) {
        // Handle single file selection
        updateTarget(files[0]);
        handleFileSelected(files[0]);
      }
    }
  }, [drag, files, error, openModal]);

  // Show icon based on file type
  const icon = target ? getFileIcon(target.type) : ICONS.PUBLISH;
  // Show drop area when files are dragged over or processing dropped file
  const show = files.length === 1 || (!target && drag && (!modal || modal.id !== MODALS.FILE_SELECTION));

  return (
    <div className={classnames('file-drop', show && 'file-drop--show')}>
      <div className={classnames('card', 'file-drop__area')}>
        <Icon size={64} icon={icon} className={'main-icon'} />
        <p>{target ? target.name : __(`Drop here to publish!`)} </p>
      </div>
    </div>
  );
}

export default withRouter(FileDrop);
