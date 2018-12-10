// @flow
import * as ICONS from 'constants/icons';
import * as React from 'react';
import { clipboard } from 'electron';
import { FormRow } from 'component/common/form';
import Button from 'component/button';

type Props = {
  address: string,
  doToast: ({ message: string }) => void,
};

export default class Address extends React.PureComponent<Props> {
  constructor() {
    super();

    this.input = null;
  }

  input: ?HTMLInputElement;

  render() {
    const { address, doToast } = this.props;

    return (
      <FormRow verticallyCentered stretch>
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
          icon={ICONS.CLIPBOARD}
          onClick={() => {
            clipboard.writeText(address);
            doToast({
              message: __('Address copied'),
            });
          }}
        />
      </FormRow>
    );
  }
}
