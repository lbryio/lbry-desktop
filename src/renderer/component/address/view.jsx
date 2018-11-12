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
  address: string,
  noSnackbar: boolean,
  doNotify: ({ message: string, displayType: Array<string> }) => void,
};

export default class Address extends React.PureComponent<Props> {
  constructor() {
    super();

    this.input = null;
  }

  input: ?HTMLInputElement;

  render() {
    const { address, doNotify, noSnackbar } = this.props;

    return (
      <FormRow verticallyCentered padded stretch>
        <input
          className="input-copyable form-field__input"
          readOnly
          value={address || ''}
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
            clipboard.writeText(address);
            if (!noSnackbar) {
              doNotify({
                message: __('Address copied'),
                displayType: ['snackbar'],
              });
            }
          }}
        />
      </FormRow>
    );
  }
}
