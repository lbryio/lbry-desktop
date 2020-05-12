// @flow
import React from 'react';
import * as PAGES from 'constants/pages';
import * as PUBLISH_TYPES from 'constants/publish_types';
import useDragDrop from 'effects/use-drag-drop';
import classnames from 'classnames';
import { getTree } from 'util/web-file-system';
import { withRouter } from 'react-router';

type Props = {
  // Lazy fix for flow errors:
  // Todo -> add appropiate types
  filePath: ?any,
  clearPublish: () => void,
  updatePublishForm: ({}) => void,
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

const PUBLISH_URL = `/$/${PAGES.PUBLISH}`;

function FileDrop(props: Props) {
  const { history, filePath, updatePublishForm } = props;
  const { drag, dropData } = useDragDrop();
  const [show, setShow] = React.useState(false);
  const [files, setFiles] = React.useState([]);
  const [selectedFile, setSelectedFile] = React.useState('');
  const [error, setError] = React.useState(false);

  const navigateToPublish = React.useCallback(() => {
    // Navigate only if location is not publish area:
    // - Prevent spam in history
    if (history.location.pathname !== PUBLISH_URL) {
      history.push(PUBLISH_URL);
    }
  }, [history]);

  React.useEffect(() => {
    // Handle drop...
    if (dropData) {
      getTree(dropData)
        .then(entries => {
          setFiles(entries);
        })
        .catch(error => {
          // Invalid entry / entries
          setError(error || true);
        });
    }
  }, [dropData]);

  React.useEffect(() => {
    //  Files are drag over or already dropped
    if (drag || files.length) {
      setShow(true);
      // No drag over or files dropped
    } else if (!drag && !files.length) {
      setShow(false);
    }

    // Filew dropped on drop area
    if (!drag && files.length) {
      if (files.length === 1) {
        // Handle single file publish
        files[0].entry.file(webFile => {
          setSelectedFile(webFile);
          updatePublishForm({ filePath: { publish: PUBLISH_TYPES.DROP, webFile } });
        });
      }
    }
    // Handle files
  }, [drag, files, error]);

  // Wait for publish state update:
  React.useEffect(() => {
    // Publish form has a file
    if (selectedFile && filePath && filePath.webFile !== undefined) {
      // Update completed
      if (selectedFile.path === filePath.webFile.path) {
        // Done! close the drop area:
        setFiles([]);
        // Go to publish area
        navigateToPublish();
      }
    }
  }, [filePath, selectedFile, navigateToPublish]);

  return (
    <div className={classnames('file-drop', show && 'file-drop--show')}>
      <p>Drop your files here!</p>
      {files.map(({ entry }) => (
        <div key={entry.name}>{entry.name}</div>
      ))}
    </div>
  );
}

export default withRouter(FileDrop);
