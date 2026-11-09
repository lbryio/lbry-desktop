import * as React from 'react';
import * as remote from '@electron/remote';
import { ipcRenderer } from 'electron';
import path from 'path';
import Button from 'component/button';
import { FormField } from 'component/common/form';

type Props = {
  type: string,
  currentPath?: string | null | undefined,
  onFileChosen: (arg1: FileWithPath) => void,
  label?: string,
  placeholder?: string,
  accept?: string,
  error?: string,
  disabled?: boolean,
  autoFocus?: boolean,
  filters?: Array<{
    name: string,
    extension: string[]
  }>,
  readFile?: boolean
};

// The folder of the last file picked with an "openFile" selector, so the next dialog starts there.
const LAST_FILE_FOLDER_KEY = 'file-selector:last-file-folder';

function getLastFileFolder(): string | null | undefined {
  try {
    return localStorage.getItem(LAST_FILE_FOLDER_KEY);
  } catch (e: any) {
    return null;
  }
}

function setLastFileFolder(filePath: string) {
  try {
    localStorage.setItem(LAST_FILE_FOLDER_KEY, path.dirname(filePath));
  } catch (e: any) {}
}

// Where the open dialog starts. With no default, Windows opens the folder the app is installed in.
function getDefaultPath(type: string, currentPath?: string | null): string {
  if (type === 'openDirectory') {
    return currentPath || remote.app.getPath('home');
  }
  try {
    return getLastFileFolder() || remote.app.getPath('documents');
  } catch (e: any) {
    // Electron throws if the system has no Documents folder (possible on Linux).
    return remote.app.getPath('home');
  }
}

class FileSelector extends React.PureComponent<Props> {
  static defaultProps = {
    autoFocus: false,
    type: 'file',
    readFile: true,
  };

  fileInput: React.ElementRef<any>;

  constructor() {
    super();
    this.fileInput = React.createRef();
    this.handleFileInputSelection = this.handleFileInputSelection.bind(this);
    this.handleDirectoryInputSelection = this.handleDirectoryInputSelection.bind(this);
    this.fileInputButton = this.fileInputButton.bind(this);
  }

  handleFileInputSelection = () => {
    const { files } = this.fileInput.current;
    if (!files) {
      return;
    }

    const file = files[0];

    if (this.props.onFileChosen) {
      this.props.onFileChosen({ file, path: file.path || file.name });
    }
    this.fileInput.current.value = null; // clear the file input
  };

  handleDirectoryInputSelection = () => {
    const { type, currentPath, filters, readFile } = this.props;
    const properties = type === 'openDirectory' ? ['openDirectory'] : ['openFile'];

    remote.dialog
      .showOpenDialog({
        properties,
        defaultPath: getDefaultPath(type, currentPath),
        filters,
      })
      .then((result) => {
        const chosenPath = result && result.filePaths[0];
        if (chosenPath) {
          if (type === 'openFile') {
            setLastFileFolder(chosenPath);
          }
          return ipcRenderer.invoke('get-file-from-path', chosenPath, readFile);
        }
      })
      .then((result) => {
        if (!result) {
          return;
        }
        const file = new File([result.buffer], result.name, {
          type: result.mime,
        });
        this.props.onFileChosen({ file, path: result.path });
      });
  };

  fileInputButton = () => {
    this.fileInput.current.click();
  };

  input: HTMLInputElement | null | undefined;

  render() {
    const { type, currentPath, label, placeholder, accept, error, disabled, autoFocus = false } = this.props;
    const placeHolder = currentPath || placeholder;

    return (
      <React.Fragment>
        <FormField
          label={label}
          webkitdirectory="true"
          className="form-field--with-button"
          error={error}
          disabled={disabled}
          type="text"
          readOnly="readonly"
          value={placeHolder || __('Choose a file')}
          inputButton={
            <Button
              autoFocus={autoFocus}
              button="primary"
              disabled={disabled}
              onClick={
                type === 'openDirectory' || type === 'openFile'
                  ? this.handleDirectoryInputSelection
                  : this.fileInputButton
              }
              label={__('Browse')}
            />
          }
        />
        <input
          type={'file'}
          style={{ display: 'none' }}
          accept={accept}
          ref={this.fileInput}
          onChange={() => (type === 'openDirectory' ? () => {} : this.handleFileInputSelection())}
          webkitdirectory={type === 'openDirectory' ? 'True' : null}
        />
      </React.Fragment>
    );
  }
}

export default FileSelector;
