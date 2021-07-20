// @flow
import * as React from 'react';
import { remote } from 'electron';
import Button from 'component/button';
import { FormField } from 'component/common/form';

type Props = {
  type: string,
  currentPath?: ?string,
  onFileChosen: (WebFile) => void,
  label?: string,
  placeholder?: string,
  accept?: string,
  error?: string,
  disabled?: boolean,
  autoFocus?: boolean,
};

class FileSelector extends React.PureComponent<Props> {
  static defaultProps = {
    autoFocus: false,
    type: 'file',
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
      this.props.onFileChosen(file);
    }
    this.fileInput.current.value = null; // clear the file input
  };

  handleDirectoryInputSelection = () => {
    remote.dialog.showOpenDialog({ properties: ['openDirectory'] }).then(result => {
      const path = result && result.filePaths[0];
      if (path) {
        // $FlowFixMe
        this.props.onFileChosen({ path });
      }
    });
  };

  fileInputButton = () => {
    this.fileInput.current.click();
  };

  input: ?HTMLInputElement;

  render() {
    const { type, currentPath, label, placeholder, accept, error, disabled, autoFocus = false } = this.props;
    const placeHolder = currentPath || placeholder;

    return (
      <React.Fragment>
        <FormField
          label={label}
          webkitdirectory="true"
          className="form-field--copyable"
          error={error}
          disabled={disabled}
          type="text"
          readOnly="readonly"
          value={placeHolder || __('Choose a file')}
          inputButton={
            <Button
              autoFocus={autoFocus}
              button="secondary"
              disabled={disabled}
              onClick={type === 'openDirectory' ? this.handleDirectoryInputSelection : this.fileInputButton}
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
