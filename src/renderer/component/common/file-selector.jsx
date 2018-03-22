// @flow
import React from 'react';
import { remote } from 'electron';
import Button from 'component/button';
import { FormRow } from 'component/common/form';
import path from 'path';

type Props = {
  type: string,
  currentPath: ?string,
  onFileChosen: (string, string) => void,
};

class FileSelector extends React.PureComponent<Props> {
  static defaultProps = {
    type: 'file',
  };

  constructor() {
    super();
    this.input = null;
  }

  handleButtonClick() {
    remote.dialog.showOpenDialog(
      {
        properties:
          this.props.type === 'file' ? ['openFile'] : ['openDirectory', 'createDirectory'],
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

  input: ?HTMLInputElement;

  render() {
    const { type, currentPath } = this.props;

    return (
      <FormRow verticallyCentered padded>
        <Button
          button="primary"
          onClick={() => this.handleButtonClick()}
          label={type === 'file' ? __('Choose File') : __('Choose Directory')}
        />
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
      </FormRow>
    );
  }
}

export default FileSelector;
