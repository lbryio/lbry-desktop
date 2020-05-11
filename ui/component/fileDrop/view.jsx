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
  const [files, setFiles] = React.useState([]);
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const showDropArea = drag || (files && files.length > 0 && loading && !error);

  React.useEffect(() => {
    // Handle drop...
    if (dropData && !loading) {
      setLoading(true);
      getTree(dropData)
        .then(entries => {
          setLoading(false);
          setFiles(entries);
        })
        .catch(error => {
          // Invalid entry / entries
          setError(true);
          setLoading(false);
        });
    }
  }, [dropData, loading]);

  return (
    <div className={classnames('file-drop', showDropArea && 'file-drop--show')}>
      <p>Drop your files</p>
    </div>
  );
}

export default FileDrop;
