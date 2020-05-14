// @flow
import React from 'react';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import Icon from 'component/common/icon';
import classnames from 'classnames';
import useDragDrop from 'effects/use-drag-drop';
import { getTree } from 'util/web-file-system';
import { withRouter } from 'react-router';
import { useRadioState, Radio, RadioGroup } from 'reakit/Radio';

type Props = {
  filePath: string | WebFile,
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

type FileListProps = {
  files: Array<WebFile>,
  onSelected: string => void,
};

const PUBLISH_URL = `/$/${PAGES.PUBLISH}`;

function FileList(props: FileListProps) {
  const { files, onSelected } = props;
  const radio = useRadioState();

  React.useEffect(() => {
    if (!radio.currentId) {
      radio.first();
    }

    if (radio.state && radio.state !== '') {
      onSelected(radio.state);
    }
  }, [radio, onSelected]);

  return (
    <RadioGroup {...radio} aria-label="fruits">
      {files.map((entry, index) => {
        const item = radio.stops[index];
        const selected = item && item.id === radio.currentId;

        return (
          <label key={entry.name} className={classnames(selected && 'selected')}>
            <Radio {...radio} value={entry.name} />
            <Icon size={18} selected={selected} icon={selected ? ICONS.COMPLETED : ICONS.CIRCLE} />
            <span>{entry.name}</span>
          </label>
        );
      })}
    </RadioGroup>
  );
}

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

  const handleFileSelected = name => {
    if (files && files.length) {
      const selected = files.find(file => file.name === name);
      if (selected && selected.name !== (selectedFile && selectedFile.name)) {
        setSelectedFile(selected);
      }
    }
  };

  React.useEffect(() => {
    // Handle drop...
    if (dropData) {
      getTree(dropData)
        .then(entries => {
          if (entries && entries.length) {
            setFiles(entries);
          }
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
        setSelectedFile(files[0]);
        updatePublishForm({ filePath: files[0] });
      }
    }
    // Handle files
  }, [drag, files, error, updatePublishForm, setSelectedFile]);

  // Wait for publish state update:
  React.useEffect(() => {
    /*
    // Publish form has a file
    if (selectedFile && filePath) {
      // Update completed
      if (selectedFile.path === filePath.path) {
        // Done! close the drop area:
        setFiles([]);
        // Go to publish area
        navigateToPublish();
      }
    }
    */
  }, [filePath, selectedFile, navigateToPublish, setFiles]);

  const multipleFiles = files.length > 1;
  return (
    <div className={classnames('file-drop', show && 'file-drop--show')}>
      <div className={classnames('card', 'file-drop__area')}>
        <Icon size={64} icon={multipleFiles ? ICONS.ALERT : ICONS.PUBLISH} className={'main-icon'} />
        <p>{multipleFiles ? `Only one file is allowed choose wisely` : `Drop here to publish!`} </p>
        {files && files.length > 0 && (
          <div className="file-drop__list">
            <FileList files={files} onSelected={handleFileSelected} />
          </div>
        )}
      </div>
    </div>
  );
}

export default withRouter(FileDrop);
