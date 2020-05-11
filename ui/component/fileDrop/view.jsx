// @flow
import React from 'react';
import useDragDrop from 'effects/use-drag-drop';
import classnames from 'classnames';
import { getTree } from 'util/web-file-system';

type Props = {
  filePath: string | WebFile,
  clearPublish: () => void,
  updatePublishForm: ({}) => void,
};

function FileDrop(props: Props) {
  const { drag, dropData } = useDragDrop();
  const [show, setShow] = React.useState(false);
  const [files, setFiles] = React.useState([]);
  const [error, setError] = React.useState(false);

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
    // Handle files
  }, [drag, files, error]);

  return (
    <div className={classnames('file-drop', show && 'file-drop--show')}>
      <p>Drop your files here!</p>
      {files.map(file => (
        <div key={file.path}>{file.path}</div>
      ))}
    </div>
  );
}

export default FileDrop;
