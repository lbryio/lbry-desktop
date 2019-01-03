// @flow
import React from 'react';
// @if TARGET='app'
import { remote } from 'electron';
// @endif
// @if TARGET='web'
import { remote } from '../../../web/stubs';
// @endif
import Button from 'component/button';
import { FormRow } from 'component/common/form';
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
    const files = this.fileInput.current.files;
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
      <FormRow verticallyCentered>
        // @if TARGET='app'
        <Button button="primary" onClick={() => this.handleButtonClick()} label={label} />
        <input
          webkitdirectory="true"
          className="input-copyable"
          type="text"
          ref={input => {
            if (this.input) this.input = input;
          }}
          onFocus={() => {
            if (this.input) this.input.select();
          }}
          readOnly="readonly"
          value={currentPath || __('No File Chosen')}
        />
        // @endif // @if TARGET='web'
        <input type="file" ref={this.fileInput} onChange={() => this.handleFileInputSelection()} />
        <br />
        <button type="submit">Submit</button>
        // @endif
      </FormRow>
    );
  }
}

export default FileSelector;
