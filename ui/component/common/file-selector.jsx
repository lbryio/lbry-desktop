// @flow
import * as React from 'react';

import Button from 'component/button';
import { FormField } from 'component/common/form';

type Props = {
  type: string,
  currentPath?: ?string,
  onFileChosen: WebFile => void,
  label?: string,
  placeholder?: string,
  fileLabel?: string,
  directoryLabel?: string,
  accept?: string,
  error?: string,
  disabled?: boolean,
};

class FileSelector extends React.PureComponent<Props> {
  static defaultProps = {
    type: 'file',
  };

  fileInput: React.ElementRef<any>;

  constructor() {
    super();
    this.fileInput = React.createRef();
    this.handleFileInputSelection = this.handleFileInputSelection.bind(this);
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
  };

  fileInputButton = () => {
    this.fileInput.current.click();
  };

  input: ?HTMLInputElement;

  render() {
    const { type, currentPath, label, fileLabel, directoryLabel, placeholder, accept, error, disabled } = this.props;

    const buttonLabel = type === 'file' ? fileLabel || __('Choose File') : directoryLabel || __('Choose Directory');
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
            <Button button="primary" disabled={disabled} onClick={this.fileInputButton} label={buttonLabel} />
          }
        />
        <input
          type={'file'}
          style={{ display: 'none' }}
          accept={accept}
          ref={this.fileInput}
          onChange={() => this.handleFileInputSelection()}
          webkitdirectory={type === 'openDirectory' ? 'True' : null}
        />
      </React.Fragment>
    );
  }
}

export default FileSelector;
