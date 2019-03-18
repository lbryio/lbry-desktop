// @flow
import * as React from 'react';
// @if TARGET='app'
// $FlowFixMe
import { remote } from 'electron';
// @endif
// @if TARGET='web'
// $FlowFixMe
import { remote } from 'web/stubs';
// @endif
import Button from 'component/button';
import { FormField } from 'component/common/form';
import path from 'path';

type FileFilters = {
  name: string,
  extensions: string[],
};

type Props = {
  type: string,
  currentPath: ?string,
  onFileChosen: (string, string) => void,
  fileLabel?: string,
  directoryLabel?: string,
  filters?: FileFilters[],
};

class FileSelector extends React.PureComponent<Props> {
  static defaultProps = {
    type: 'file',
  };

  fileInput: { current: React.ElementRef<any> };

  constructor() {
    super();
    this.input = null;
    // @if TARGET='web'
    this.fileInput = React.createRef();
    // @endif
  }

  handleButtonClick() {
    remote.dialog.showOpenDialog(
      remote.getCurrentWindow(),
      {
        properties:
          this.props.type === 'file' ? ['openFile'] : ['openDirectory', 'createDirectory'],
        filters: this.props.filters,
      },
      paths => {
        if (!paths) {
          // User hit cancel, so do nothing
          return;
        }

        const filePath = paths[0];

        const extension = path.extname(filePath);
        const fileName = path.basename(filePath, extension);

        if (this.props.onFileChosen) {
          this.props.onFileChosen(filePath, fileName);
        }
      }
    );
  }

  handleFileInputSelection() {
    const { files } = this.fileInput.current;
    if (!files) {
      return;
    }

    const filePath = files[0];
    const fileName = filePath.name;

    if (this.props.onFileChosen) {
      this.props.onFileChosen(filePath, fileName);
    }
  }

  input: ?HTMLInputElement;

  render() {
    const { type, currentPath, fileLabel, directoryLabel } = this.props;

    const label =
      type === 'file' ? fileLabel || __('Choose File') : directoryLabel || __('Choose Directory');

    return (
      <React.Fragment>
        {/* @if TARGET='app' */}
        <FormField
          webkitdirectory='true'
          className='form-field--copyable'
          type='text'
          ref={input => {
            if (this.input) this.input = input;
          }}
          onFocus={() => {
            if (this.input) this.input.select();
          }}
          readOnly='readonly'
          value={currentPath || __('No File Chosen')}
          inputButton={
            <Button button='primary' onClick={() => this.handleButtonClick()} label={label} />
          }
        />
        {/* @endif */}
        {/* @if TARGET='web' */}
        <input type='file' ref={this.fileInput} onChange={() => this.handleFileInputSelection()} />
        {/* @endif */}
      </React.Fragment>
    );
  }
}

export default FileSelector;
