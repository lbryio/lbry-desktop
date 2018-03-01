// @flow
import * as React from 'react';
import { clipboard } from 'electron';
import { FormRow } from 'component/common/form';
import Button from 'component/link';

type Props = {
  address: string,
  doShowSnackBar: ({ message: string }) => void,
};

export default class Address extends React.PureComponent<Props> {
  constructor() {
    super();

    this.input = null;
  }

  input: ?HTMLInputElement;

  render() {
    const { address, doShowSnackBar } = this.props;

    return (

        <FormRow>
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
            alt
            icon="Clipboard"
            onClick={() => {
              clipboard.writeText(address);
              doShowSnackBar({ message: __('Address copied') });
            }}
          />
      </FormRow>
    );
  }
}
