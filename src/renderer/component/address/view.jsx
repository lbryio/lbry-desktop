// @flow
import * as React from 'react';
import { clipboard } from 'electron';
import { FormField } from 'component/common/form';
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
      <FormField
        name="address"
        render={() => (
          <React.Fragment>
            <input
              id="address"
              className="input-copyable"
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
          </React.Fragment>
        )}
      />
    );
  }
}
