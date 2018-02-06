// @flow
import React from 'react';
import { remote } from 'electron';
import Button from 'component/link';
import { FormRow } from 'component/common/form';

type Props = {
  type: string,
  currentPath: string,
  onFileChosen: string => void,
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

        const path = paths[0];
        if (this.props.onFileChosen) {
          this.props.onFileChosen(path);
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
