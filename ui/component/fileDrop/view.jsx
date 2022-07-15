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
    push: (string) => void,
  },
};

const HIDE_TIME_OUT = 600;
const TARGET_TIME_OUT = 300;
const NAVIGATE_TIME_OUT = 400;
const PUBLISH_URL = `/$/${PAGES.UPLOAD}`;

function FileDrop(props: Props) {
  const { modal, history, openModal, updatePublishForm } = props;
  const { drag, dropData } = useDragDrop();
  const [files, setFiles] = React.useState([]);
  const [error, setError] = React.useState(false);
  const [target, setTarget] = React.useState<?WebFile>(null);
  const hideTimer = React.useRef(null);
  const targetTimer = React.useRef(null);
  const navigationTimer = React.useRef(null);

  // Gets respective icon given a mimetype
  const getFileIcon = (type) => {
    // Not all files have a type
    if (!type) return ICONS.FILE;
    // Detect common types
    const contentType = type.split('/')[0];
    if (contentType === 'text') return ICONS.TEXT;
    if (contentType === 'image') return ICONS.IMAGE;
    if (contentType === 'video') return ICONS.VIDEO;
    if (contentType === 'audio') return ICONS.AUDIO;
    // Binary file
    return ICONS.FILE;
  };

  // Navigates user to publish page
  const navigateToPublish = React.useCallback(() => {
    // Navigate only if location is not publish area
    // - Prevents spam in browser history
    if (history.location.pathname !== PUBLISH_URL) {
      history.push(PUBLISH_URL);
    }
  }, [history]);

  // Delay hide and navigation for a smooth transition
  const hideDropArea = React.useCallback(() => {
    hideTimer.current = setTimeout(() => {
      setFiles([]);
      // Navigate to publish area
      navigationTimer.current = setTimeout(() => {
        navigateToPublish();
      }, NAVIGATE_TIME_OUT);
    }, HIDE_TIME_OUT);
  }, [navigateToPublish]);

  // Handle file selection
  const handleFileSelected = React.useCallback(
    (selectedFile) => {
      updatePublishForm({ filePath: selectedFile });
      hideDropArea();
    },
    [updatePublishForm, hideDropArea]
  );

  // Clear timers when unmounted
  React.useEffect(() => {
    return () => {
      // Clear hide timer
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
      // Clear target timer
      if (targetTimer.current) {
        clearTimeout(targetTimer.current);
      }
      // Clear navigation timer
      if (navigationTimer.current) {
        clearTimeout(navigationTimer.current);
      }
    };
  }, []);

  // Clear selected file after modal closed
  React.useEffect(() => {
    if ((target && !files) || !files.length) {
      // Small delay for a better transition
      targetTimer.current = setTimeout(() => {
        setTarget(null);
      }, TARGET_TIME_OUT);
    }
  }, [files, target]);

  // Handle file drop...
  React.useEffect(() => {
    const DROP_AREA_HEIGHT_PCT = 0.2; // @see: css[.file-drop -> height]
    const windowHeight = window.innerHeight || document.documentElement?.clientHeight || 768;
    const dropAreaBottom = windowHeight * DROP_AREA_HEIGHT_PCT;

    if (dropData && dropData.y <= dropAreaBottom && !files.length && (!modal || modal.id !== MODALS.FILE_SELECTION)) {
      getTree(dropData.dataTransfer)
        .then((entries) => {
          if (entries && entries.length) {
            setFiles(entries);
          }
        })
        .catch((error) => {
          setError(error || true);
        });
    }
  }, [dropData, files, modal]);

  // File(s) or directory dropped
  React.useEffect(() => {
    if (!drag && files.length) {
      // Handle multiple files selection
      if (files.length > 1) {
        openModal(MODALS.FILE_SELECTION, { files: files });
        setFiles([]);
      } else if (files.length === 1) {
        // Handle single file selection
        setTarget(files[0]);
        handleFileSelected(files[0]);
      }
    }
  }, [drag, files, error, openModal, handleFileSelected]);

  // Show icon based on file type
  const icon = target ? getFileIcon(target.type) : ICONS.PUBLISH;
  // Show drop area when files are dragged over or processing dropped file
  const show = files.length === 1 || (!target && drag && (!modal || modal.id !== MODALS.FILE_SELECTION));

  return (
    <div aria-hidden={!show} className={classnames('file-drop', show && 'file-drop--show')}>
      <div className={classnames('card', 'file-drop__area')}>
        <Icon size={64} icon={icon} className={'main-icon'} />
        <p>{target ? target.name : __(`Drop here to publish!`)} </p>
      </div>
    </div>
  );
}

export default withRouter(FileDrop);
