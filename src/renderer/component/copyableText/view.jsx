// @flow
import * as React from 'react';
import { clipboard } from 'electron';
import { FormRow } from 'component/common/form';
import Button from 'component/button';
import * as icons from 'constants/icons';
/*
noSnackbar added due to issue 1945
https://github.com/lbryio/lbry-desktop/issues/1945
"Snackbars and modals can't be displayed at the same time"
*/
type Props = {
  copyable: string,
  noSnackbar: boolean,
  doNotify: ({ message: string, displayType: Array<string> }) => void,
};

export default class CopyableText extends React.PureComponent<Props> {
  constructor() {
    super();

    this.input = null;
  }

  input: ?HTMLInputElement;

  render() {
    const { copyable, doNotify, noSnackbar } = this.props;

    return (
      <FormRow verticallyCentered padded stretch>
        <input
          className="input-copyable form-field__input"
          readOnly
          value={copyable || ''}
          ref={input => {
            this.input = input;
          }}
          onFocus={() => {
            if (this.input) {
              this.input.select();
            }
          }}
        />

        <Button
          noPadding
          button="secondary"
          icon={icons.CLIPBOARD}
          onClick={() => {
            clipboard.writeText(copyable);
            if (!noSnackbar) {
              doNotify({
                message: __('Text copied'),
                displayType: ['snackbar'],
              });
            }
          }}
        />
      </FormRow>
    );
  }
}
