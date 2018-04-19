// @flow
import * as React from 'react';
import { clipboard } from 'electron';
import { FormRow } from 'component/common/form';
import Button from 'component/button';
import * as icons from 'constants/icons';

type Props = {
  address: string,
  doNotify: ({ message: string, displayType: Array<string> }) => void,
};

export default class Address extends React.PureComponent<Props> {
  constructor() {
    super();

    this.input = null;
  }

  input: ?HTMLInputElement;

  render() {
    const { address, doNotify } = this.props;

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
            doNotify({
              message: __('Address copied'),
              displayType: ['snackbar']
            });
          }}
        />
      </FormRow>
    );
  }
}
